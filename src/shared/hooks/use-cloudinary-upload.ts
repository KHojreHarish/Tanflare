import { useState, useCallback } from 'react'
import { UploadedFile, UploadProgress } from '@/shared/components/upload/types'

interface UseCloudinaryUploadOptions {
  onSuccess?: (files: UploadedFile[]) => void
  onError?: (error: string) => void
  onProgress?: (progress: UploadProgress) => void
}

export const useCloudinaryUpload = (
  options: UseCloudinaryUploadOptions = {},
) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // For now, use hardcoded config until TRPC is properly set up
  const uploadConfig = {
    cloudName: 'deoutrwoa',
    uploadPreset: 'ml_default',
    maxFileSize: 10 * 1024 * 1024,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    multiple: true,
    autoUpload: true,
  }

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!uploadConfig) {
        setError('Upload configuration not available')
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        const uploadPromises = files.map(async (file) => {
          // Direct Cloudinary upload
          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', uploadConfig.uploadPreset)

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            },
          )

          if (!response.ok) {
            throw new Error('Upload failed')
          }

          const data = await response.json()

          return {
            publicId: data.public_id,
            url: data.secure_url,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
          } as UploadedFile
        })

        const results = await Promise.all(uploadPromises)
        setUploadedFiles((prev) => [...prev, ...results])
        options.onSuccess?.(results)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Upload failed'
        setError(errorMessage)
        options.onError?.(errorMessage)
      } finally {
        setIsUploading(false)
      }
    },
    [uploadConfig, options],
  )

  const clearFiles = useCallback(() => {
    setUploadedFiles([])
    setError(null)
  }, [])

  const removeFile = useCallback((publicId: string) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.publicId !== publicId),
    )
  }, [])

  return {
    uploadedFiles,
    isUploading,
    error,
    uploadConfig,
    uploadFiles,
    clearFiles,
    removeFile,
  }
}
