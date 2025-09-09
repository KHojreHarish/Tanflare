// ============================================================================
// 🎣 UPLOAD STATE MANAGEMENT HOOK
// ============================================================================

import { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import {
  UploadedFile,
  UploadProgress,
  UploadError,
  UploadState,
  FileValidation,
  UploadBehavior,
  UploadCallbacks,
  UploadErrorCode,
} from '../types'
import { validateFiles, validateImageDimensions } from '../utils/validation'
import { UploadService } from '../services/uploadService'

/**
 * Custom hook for managing file upload state and operations
 * Provides a clean interface for handling uploads with proper state management
 */

interface UseUploadOptions {
  cloudName: string
  uploadPreset: string
  validation?: FileValidation
  behavior?: UploadBehavior
  callbacks?: UploadCallbacks
  baseUrl?: string
}

interface UseUploadReturn {
  // State
  state: UploadState
  selectedFiles: File[]
  isUploading: boolean
  hasErrors: boolean
  totalProgress: number

  // Actions
  selectFiles: (files: File[]) => Promise<boolean>
  uploadFiles: () => Promise<UploadedFile[]>
  retryUpload: (fileId: string) => Promise<void>
  cancelUpload: (fileId: string) => void
  removeFile: (fileId: string) => void
  clearFiles: () => void
  reset: () => void

  // Utilities
  validateFiles: (files: File[]) => Promise<boolean>
  getFileProgress: (fileId: string) => UploadProgress | undefined
  getFileError: (fileId: string) => UploadError | undefined
}

export function useUpload(options: UseUploadOptions): UseUploadReturn {
  const {
    cloudName,
    uploadPreset,
    validation = {},
    behavior = {},
    callbacks = {},
    baseUrl,
  } = options

  // ============================================================================
  // 🏗️ STATE MANAGEMENT
  // ============================================================================

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, UploadProgress>
  >(new Map())
  const [uploadErrors, setUploadErrors] = useState<Map<string, UploadError>>(
    new Map(),
  )
  const [isUploading, setIsUploading] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)

  // Refs for cleanup and cancellation
  const uploadServiceRef = useRef<UploadService | null>(null)
  const activeUploadsRef = useRef<Map<string, AbortController>>(new Map())
  const fileIdCounterRef = useRef(0)

  // ============================================================================
  // 🔧 INITIALIZATION
  // ============================================================================

  // Initialize upload service
  if (!uploadServiceRef.current) {
    uploadServiceRef.current = new UploadService({
      cloudName,
      uploadPreset,
      baseUrl,
    })
  }

  // ============================================================================
  // 📊 COMPUTED VALUES
  // ============================================================================

  const totalProgress = useMemo(() => {
    if (uploadProgress.size === 0) return 0

    const progressValues = Array.from(uploadProgress.values())
    const totalProgress = progressValues.reduce(
      (sum, progress) => sum + progress.progress,
      0,
    )
    return Math.round(totalProgress / progressValues.length)
  }, [uploadProgress])

  const state: UploadState = useMemo(
    () => ({
      files: uploadedFiles,
      progress: uploadProgress,
      errors: uploadErrors,
      isUploading,
      hasErrors,
      totalProgress,
    }),
    [
      uploadedFiles,
      uploadProgress,
      uploadErrors,
      isUploading,
      hasErrors,
      totalProgress,
    ],
  )

  // ============================================================================
  // 🔄 FILE SELECTION
  // ============================================================================

  const selectFiles = useCallback(
    async (files: File[]): Promise<boolean> => {
      try {
        // Validate files
        const validationResult = await validateFiles(files, validation)

        if (!validationResult.isValid) {
          // Handle validation errors
          validationResult.errors.forEach((error) => {
            callbacks.onError?.(error.message, error.file, {
              code: error.code,
              type: 'validation',
            })
          })
          return false
        }

        // Validate image dimensions if needed
        if (
          validation.maxWidth ||
          validation.maxHeight ||
          validation.minWidth ||
          validation.minHeight
        ) {
          for (const file of files) {
            if (file.type.startsWith('image/')) {
              const dimensionResult = await validateImageDimensions(
                file,
                validation.maxWidth,
                validation.maxHeight,
                validation.minWidth,
                validation.minHeight,
              )

              if (!dimensionResult.isValid) {
                dimensionResult.errors.forEach((error) => {
                  callbacks.onError?.(error.message, error.file, {
                    code: error.code,
                    type: 'validation',
                  })
                })
                return false
              }
            }
          }
        }

        // Add files to selection
        setSelectedFiles((prev) => [...prev, ...files])
        callbacks.onFilesChange?.(files)

        return true
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'File selection failed'
        callbacks.onError?.(errorMessage, undefined, {
          code: UploadErrorCode.VALIDATION_ERROR,
          type: 'selection',
        })
        return false
      }
    },
    [validation, callbacks],
  )

  // ============================================================================
  // 📤 UPLOAD OPERATIONS
  // ============================================================================

  const uploadFiles = useCallback(async (): Promise<UploadedFile[]> => {
    if (selectedFiles.length === 0) {
      throw new Error('No files selected for upload')
    }

    setIsUploading(true)
    setHasErrors(false)
    setUploadErrors(new Map())

    try {
      const results = await uploadServiceRef.current!.uploadFiles(
        selectedFiles,
        {
          parallelUploads: behavior.parallelUploads || 3,
        },
        (fileId, progress) => {
          setUploadProgress((prev) => new Map(prev.set(fileId, progress)))
          callbacks.onProgress?.(progress)
        },
      )

      // Update state with successful uploads
      setUploadedFiles((prev) => [...prev, ...results])
      setSelectedFiles([]) // Clear selected files after successful upload

      // Call success callbacks
      results.forEach((result) => callbacks.onUpload?.(result))
      callbacks.onSuccess?.(results)

      return results
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed'
      setHasErrors(true)

      // Create error entries for failed uploads
      selectedFiles.forEach((file, index) => {
        const fileId = `file-${index}`
        const uploadError: UploadError = {
          file,
          error: errorMessage,
          retryCount: 0,
          timestamp: new Date(),
          code: UploadErrorCode.UPLOAD_FAILED,
        }
        setUploadErrors((prev) => new Map(prev.set(fileId, uploadError)))
      })

      callbacks.onError?.(errorMessage, undefined, {
        code: UploadErrorCode.UPLOAD_FAILED,
        type: 'upload',
      })

      throw error
    } finally {
      setIsUploading(false)
    }
  }, [selectedFiles, behavior.parallelUploads, callbacks])

  // ============================================================================
  // 🔄 RETRY OPERATIONS
  // ============================================================================

  const retryUpload = useCallback(
    async (fileId: string): Promise<void> => {
      const error = uploadErrors.get(fileId)
      if (!error) return

      const retryCount = (error.retryCount || 0) + 1
      const maxRetries = behavior.maxRetries || 3

      if (retryCount > maxRetries) {
        const newError: UploadError = {
          ...error,
          error: `Max retries (${maxRetries}) exceeded`,
          retryCount,
        }
        setUploadErrors((prev) => new Map(prev.set(fileId, newError)))
        return
      }

      try {
        // Update error with retry count
        const updatedError: UploadError = { ...error, retryCount }
        setUploadErrors((prev) => new Map(prev.set(fileId, updatedError)))

        // Retry upload
        const result = await uploadServiceRef.current!.uploadFile(
          error.file,
          {},
          (progress) => {
            setUploadProgress((prev) => new Map(prev.set(fileId, progress)))
            callbacks.onProgress?.(progress)
          },
        )

        // Remove from errors and add to uploaded files
        setUploadErrors((prev) => {
          const newMap = new Map(prev)
          newMap.delete(fileId)
          return newMap
        })
        setUploadedFiles((prev) => [...prev, result])
        callbacks.onUpload?.(result)
      } catch (retryError) {
        const errorMessage =
          retryError instanceof Error ? retryError.message : 'Retry failed'
        const newError: UploadError = {
          ...error,
          error: errorMessage,
          retryCount,
          timestamp: new Date(),
        }
        setUploadErrors((prev) => new Map(prev.set(fileId, newError)))
        callbacks.onError?.(errorMessage, error.file, {
          code: UploadErrorCode.UPLOAD_FAILED,
          type: 'retry',
        })
      }
    },
    [uploadErrors, behavior.maxRetries, callbacks],
  )

  // ============================================================================
  // 🗑️ CLEANUP OPERATIONS
  // ============================================================================

  const cancelUpload = useCallback(
    (fileId: string): void => {
      const controller = activeUploadsRef.current.get(fileId)
      if (controller) {
        controller.abort()
        activeUploadsRef.current.delete(fileId)
      }

      setUploadProgress((prev) => {
        const newMap = new Map(prev)
        const progress = newMap.get(fileId)
        if (progress) {
          newMap.set(fileId, { ...progress, status: 'cancelled' })
        }
        return newMap
      })

      callbacks.onCancel?.(fileId)
    },
    [callbacks],
  )

  const removeFile = useCallback(
    (fileId: string): void => {
      // Remove from selected files
      setSelectedFiles((prev) =>
        prev.filter((_, index) => `file-${index}` !== fileId),
      )

      // Remove from uploaded files
      setUploadedFiles((prev) =>
        prev.filter((file) => file.publicId !== fileId),
      )

      // Remove from progress
      setUploadProgress((prev) => {
        const newMap = new Map(prev)
        newMap.delete(fileId)
        return newMap
      })

      // Remove from errors
      setUploadErrors((prev) => {
        const newMap = new Map(prev)
        newMap.delete(fileId)
        return newMap
      })

      callbacks.onRemove?.(fileId)
    },
    [callbacks],
  )

  const clearFiles = useCallback((): void => {
    setSelectedFiles([])
    setUploadedFiles([])
    setUploadProgress(new Map())
    setUploadErrors(new Map())
    setHasErrors(false)
    callbacks.onFilesChange?.([])
  }, [callbacks])

  const reset = useCallback((): void => {
    clearFiles()
    setIsUploading(false)
  }, [clearFiles])

  // ============================================================================
  // 🔍 UTILITY FUNCTIONS
  // ============================================================================

  const getFileProgress = useCallback(
    (fileId: string): UploadProgress | undefined => {
      return uploadProgress.get(fileId)
    },
    [uploadProgress],
  )

  const getFileError = useCallback(
    (fileId: string): UploadError | undefined => {
      return uploadErrors.get(fileId)
    },
    [uploadErrors],
  )

  // ============================================================================
  // 🧹 CLEANUP ON UNMOUNT
  // ============================================================================

  // Cleanup active uploads on unmount
  const cleanup = useCallback(() => {
    activeUploadsRef.current.forEach((controller) => controller.abort())
    activeUploadsRef.current.clear()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  // Return cleanup function for component to use
  return {
    // State
    state,
    selectedFiles,
    isUploading,
    hasErrors,
    totalProgress,

    // Actions
    selectFiles,
    uploadFiles,
    retryUpload,
    cancelUpload,
    removeFile,
    clearFiles,
    reset,

    // Utilities
    validateFiles: (files: File[]) =>
      validateFiles(files, validation).then((result) => result.isValid),
    getFileProgress,
    getFileError,

    // Cleanup function (for component use)
    cleanup,
  }
}
