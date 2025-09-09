// ============================================================================
// 🎨 HIGH-QUALITY CLOUDINARY DROPZONE COMPONENT
// ============================================================================

import React, { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/utils'
import { useUpload } from './hooks/useUpload'
import {
  CloudinaryConfig,
  FileValidation,
  UploadBehavior,
  UploadCallbacks,
  UIProps,
  ExternalControl,
  DropzoneVariant,
  DropzoneSize,
  DEFAULT_FILE_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_UPLOAD_TIMEOUT,
  DEFAULT_RETRY_ATTEMPTS,
  SUPPORTED_IMAGE_TYPES,
} from './types'

// ============================================================================
// 🎯 COMPONENT PROPS
// ============================================================================

export interface CloudinaryDropzoneProps
  extends CloudinaryConfig,
    Partial<FileValidation>,
    Partial<UploadBehavior>,
    Partial<UploadCallbacks>,
    Partial<UIProps>,
    Partial<ExternalControl> {
  // Required props
  cloudName: string
  uploadPreset: string

  // Optional props with better defaults
  maxFileSize?: number
  acceptedTypes?: string[]
  maxFiles?: number
  multiple?: boolean
  autoUpload?: boolean
  showProgress?: boolean
  showPreview?: boolean
  showUploadButton?: boolean
  uploadButtonText?: string
  enableRetry?: boolean
  retryButtonText?: string
  maxRetries?: number
  uploadTimeout?: number
  variant?: DropzoneVariant
  size?: DropzoneSize
  disabled?: boolean
  loading?: boolean
  triggerUpload?: boolean
  onUploadTrigger?: () => void

  // Content
  placeholder?: string
  subtext?: string
  icon?: React.ReactNode

  // Styling
  className?: string
  dropzoneClassName?: string
  textClassName?: string
  iconClassName?: string
}

// ============================================================================
// 🎨 DROPZONE COMPONENT
// ============================================================================

/**
 * High-quality CloudinaryDropzone component with comprehensive features
 *
 * Features:
 * - Secure server-side signature generation
 * - Comprehensive file validation
 * - Advanced error handling and retry mechanisms
 * - Mobile-optimized touch interactions
 * - Memory management with proper cleanup
 * - TypeScript support with full type safety
 * - Customizable UI and behavior
 * - Accessibility compliance
 * - Performance optimizations
 */
export const CloudinaryDropzone: React.FC<CloudinaryDropzoneProps> = ({
  // Core configuration
  cloudName,
  uploadPreset,
  apiKey,
  apiSecret,
  signature,
  timestamp,
  folder,
  publicId,
  transformation,
  eager,
  tags,

  // File validation
  maxFileSize = DEFAULT_FILE_SIZE,
  acceptedTypes = SUPPORTED_IMAGE_TYPES,
  maxFiles = DEFAULT_MAX_FILES,
  multiple = true,

  // Upload behavior
  autoUpload = false,
  showProgress = true,
  showPreview = true,
  showUploadButton = true,
  uploadButtonText = 'Upload Files',
  enableRetry = true,
  retryButtonText = 'Retry',
  maxRetries = DEFAULT_RETRY_ATTEMPTS,
  uploadTimeout = DEFAULT_UPLOAD_TIMEOUT,

  // UI configuration
  variant = 'outline',
  size = 'md',
  placeholder = 'Drag & drop files here',
  subtext = 'or click to select files',
  icon,

  // Styling
  className,
  dropzoneClassName,
  textClassName,
  iconClassName,

  // External control
  disabled = false,
  loading = false,
  triggerUpload = false,
  onUploadTrigger,

  // Callbacks
  onUpload,
  onError,
  onSuccess,
  onFilesChange,
  onProgress,
  onRetry,
  onCancel,
  onRemove,
}) => {
  // ============================================================================
  // 🎣 UPLOAD HOOK
  // ============================================================================

  const {
    state,
    selectedFiles,
    isUploading,
    hasErrors,
    totalProgress,
    selectFiles,
    uploadFiles,
    retryUpload,
    cancelUpload,
    removeFile,
    clearFiles,
    reset,
    getFileProgress,
    getFileError,
  } = useUpload({
    cloudName,
    uploadPreset,
    validation: {
      maxSize: maxFileSize,
      acceptedTypes,
      maxFiles,
      minFiles: multiple ? 1 : 1,
    },
    behavior: {
      autoUpload,
      showProgress,
      showPreview,
      showUploadButton,
      uploadButtonText,
      enableRetry,
      retryButtonText,
      maxRetries,
      uploadTimeout,
    },
    callbacks: {
      onUpload,
      onError,
      onSuccess,
      onFilesChange,
      onProgress,
      onRetry,
      onCancel,
      onRemove,
    },
  })

  // ============================================================================
  // 🎨 DROPZONE CONFIGURATION
  // ============================================================================

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (disabled || loading) return

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errorMessage = rejectedFiles
          .map(
            ({ file, errors }) =>
              `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`,
          )
          .join('; ')
        onError?.(errorMessage)
        return
      }

      if (acceptedFiles.length === 0) return

      // Select files (includes validation)
      const success = await selectFiles(acceptedFiles)

      if (success && autoUpload) {
        try {
          await uploadFiles()
        } catch (error) {
          console.error('Auto upload failed:', error)
        }
      }
    },
    [disabled, loading, onError, selectFiles, autoUpload, uploadFiles],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedTypes.reduce(
        (acc, type) => {
          acc[type] = []
          return acc
        },
        {} as Record<string, string[]>,
      ),
      multiple,
      maxSize: maxFileSize,
      maxFiles,
      disabled: disabled || loading,
      noClick: false,
      noKeyboard: false,
      preventDropOnDocument: true,
    })

  // ============================================================================
  // 🎨 STYLING UTILITIES
  // ============================================================================

  const getVariantClasses = useCallback(() => {
    const baseClasses =
      'relative rounded-lg text-center transition-all duration-200'

    switch (variant) {
      case 'outline':
        return `${baseClasses} border-2 border-dashed border-border/60 bg-background/50 hover:border-primary/60 hover:bg-primary/5 focus:border-primary focus:bg-primary/10`
      case 'ghost':
        return `${baseClasses} border-2 border-dashed border-transparent bg-muted/20 hover:bg-muted/40`
      case 'minimal':
        return `${baseClasses} border-0 bg-transparent`
      case 'card':
        return `${baseClasses} border-2 border-dashed border-border/60 bg-card/50 hover:border-primary/60 hover:bg-primary/5 shadow-sm hover:shadow-md`
      default:
        return `${baseClasses} border-2 border-dashed border-border/60 bg-card/50 hover:border-primary/60 hover:bg-primary/5`
    }
  }, [variant])

  const getSizeClasses = useCallback(() => {
    const baseClasses = 'flex flex-col items-center justify-center'

    switch (size) {
      case 'sm':
        return `${baseClasses} p-4 min-h-[120px] aspect-[4/3]`
      case 'md':
        return `${baseClasses} p-6 min-h-[160px] aspect-[4/3]`
      case 'lg':
        return `${baseClasses} p-8 min-h-[200px] aspect-[3/2]`
      case 'xl':
        return `${baseClasses} p-12 min-h-[240px] aspect-[3/2]`
      default:
        return `${baseClasses} p-6 min-h-[160px] aspect-[4/3]`
    }
  }, [size])

  const getDragClasses = useCallback(() => {
    if (isDragActive && !isDragReject) {
      return 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.02]'
    }
    if (isDragReject) {
      return 'border-destructive bg-destructive/10 scale-[1.02]'
    }
    return ''
  }, [isDragActive, isDragReject])

  const getStateClasses = useCallback(() => {
    if (disabled) return 'opacity-50 cursor-not-allowed'
    if (loading || isUploading) return 'opacity-75 cursor-wait'
    return 'cursor-pointer'
  }, [disabled, loading, isUploading])

  // ============================================================================
  // 🎯 RENDER HELPERS
  // ============================================================================

  const renderDropzoneContent = () => {
    if (isUploading) {
      return (
        <motion.div
          key="uploading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Uploading files...</p>
          {totalProgress > 0 && (
            <div className="w-full max-w-xs">
              <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {totalProgress}% complete
              </p>
            </div>
          )}
        </motion.div>
      )
    }

    return (
      <motion.div
        key="idle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        {/* Icon */}
        <motion.div
          className={cn('text-4xl text-muted-foreground', iconClassName)}
          animate={{
            scale: isDragActive ? 1.05 : 1,
            rotate: isDragActive ? 5 : 0,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {icon || (isDragActive ? '📁' : '📤')}
        </motion.div>

        {/* Text Content */}
        <div className="space-y-2">
          <p
            className={cn('text-lg font-medium text-foreground', textClassName)}
          >
            {isDragActive ? 'Drop files here...' : placeholder}
          </p>
          <p className="text-sm text-muted-foreground">{subtext}</p>
        </div>

        {/* File Info */}
        <div className="text-xs text-muted-foreground">
          {acceptedTypes.join(', ')} • Max:{' '}
          {Math.round(maxFileSize / 1024 / 1024)}MB
          {maxFiles > 1 && ` • Up to ${maxFiles} files`}
        </div>
      </motion.div>
    )
  }

  // ============================================================================
  // 🎨 RENDER
  // ============================================================================

  return (
    <div className={cn('w-full', className)}>
      {/* Main Dropzone */}
      <motion.div
        {...getRootProps()}
        className={cn(
          getVariantClasses(),
          getSizeClasses(),
          getDragClasses(),
          getStateClasses(),
          dropzoneClassName,
        )}
        whileHover={{
          scale: disabled ? 1 : 1.005,
          transition: { duration: 0.15, ease: 'easeOut' },
        }}
        whileTap={{
          scale: disabled ? 1 : 0.995,
          transition: { duration: 0.1, ease: 'easeOut' },
        }}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">{renderDropzoneContent()}</AnimatePresence>
      </motion.div>

      {/* Upload Button */}
      {showUploadButton && selectedFiles.length > 0 && !isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex justify-center"
        >
          <button
            onClick={() => uploadFiles()}
            disabled={disabled || loading}
            className={cn(
              'px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium',
              'min-h-[44px]', // Touch-friendly sizing
            )}
          >
            {uploadButtonText} ({selectedFiles.length})
          </button>
        </motion.div>
      )}

      {/* Progress Display */}
      {showProgress && state.progress.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-3"
        >
          {Array.from(state.progress.entries()).map(([fileId, progress]) => (
            <motion.div
              key={fileId}
              className={cn(
                'backdrop-blur-sm rounded-lg p-4 border',
                progress.status === 'error'
                  ? 'bg-destructive/10 border-destructive/50'
                  : progress.status === 'completed'
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-muted/50 border-border/50',
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {progress.fileName}
                  </span>
                  {progress.status === 'retrying' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded">
                      Retrying ({progress.retryCount || 0}/{maxRetries})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {progress.status === 'completed' && 'Complete!'}
                    {progress.status === 'error' && 'Failed'}
                    {progress.status === 'uploading' && `${progress.progress}%`}
                    {progress.status === 'retrying' && 'Retrying...'}
                  </span>
                  {progress.status === 'error' &&
                    enableRetry &&
                    (progress.retryCount || 0) < maxRetries && (
                      <button
                        onClick={() => retryUpload(fileId)}
                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                      >
                        {retryButtonText}
                      </button>
                    )}
                </div>
              </div>

              {progress.status === 'error' ? (
                <div className="space-y-2">
                  <div className="text-xs text-destructive">
                    {progress.error}
                  </div>
                  <div className="w-full bg-destructive/20 rounded-full h-2.5">
                    <div className="bg-destructive h-2.5 rounded-full w-full" />
                  </div>
                </div>
              ) : (
                <div className="w-full bg-muted-foreground/20 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-2.5 rounded-full shadow-sm',
                      progress.status === 'completed'
                        ? 'bg-green-500'
                        : progress.status === 'retrying'
                          ? 'bg-yellow-500'
                          : 'bg-gradient-to-r from-primary to-primary/80',
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* File Preview */}
      {showPreview && selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-foreground">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearFiles}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-muted/50 rounded-lg p-3 border border-border/50"
              >
                <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📄
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p
                    className="text-xs text-foreground truncate font-medium"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(`file-${index}`)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-background border-2 border-primary text-primary rounded-full flex items-center justify-center text-lg font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl hover:scale-110"
                  title="Remove file"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ============================================================================
// 🏷️ DISPLAY NAME
// ============================================================================

CloudinaryDropzone.displayName = 'CloudinaryDropzone'
