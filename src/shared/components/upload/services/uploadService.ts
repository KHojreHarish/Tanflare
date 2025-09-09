// ============================================================================
// 🔐 SECURE UPLOAD SERVICE
// ============================================================================

import {
  CloudinaryConfig,
  CloudinaryResponse,
  UploadedFile,
  UploadProgress,
  UploadErrorCode,
} from '../types'

/**
 * Secure upload service with server-side signature generation
 * Handles all Cloudinary upload operations with proper security
 */

// ============================================================================
// 🚨 SECURITY WARNING
// ============================================================================

/**
 * ⚠️ CRITICAL SECURITY WARNING ⚠️
 *
 * NEVER expose API secrets in client-side code!
 * This service is designed to work with server-side signature generation.
 * All sensitive operations should be handled by your backend API.
 */

// ============================================================================
// 📡 API ENDPOINTS
// ============================================================================

const API_ENDPOINTS = {
  SIGNATURE: '/api/cloudinary/signature',
  UPLOAD: '/api/cloudinary/upload',
  DELETE: '/api/cloudinary/delete',
} as const

// ============================================================================
// 🔧 UPLOAD SERVICE CLASS
// ============================================================================

export class UploadService {
  private cloudName: string
  private uploadPreset: string
  private baseUrl: string

  constructor(config: {
    cloudName: string
    uploadPreset: string
    baseUrl?: string
  }) {
    this.cloudName = config.cloudName
    this.uploadPreset = config.uploadPreset
    this.baseUrl = config.baseUrl || ''
  }

  /**
   * Uploads a file to Cloudinary using server-side signature generation
   * @param file - File to upload
   * @param options - Upload options
   * @param onProgress - Progress callback
   * @returns Promise that resolves to uploaded file data
   */
  async uploadFile(
    file: File,
    options: {
      folder?: string
      publicId?: string
      transformation?: string
      tags?: string[]
      eager?: string
    } = {},
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<UploadedFile> {
    try {
      // Get server-side signature
      const signature = await this.getUploadSignature({
        folder: options.folder,
        publicId: options.publicId,
        transformation: options.transformation,
        tags: options.tags,
        eager: options.eager,
      })

      // Upload file with signature
      const response = await this.performUpload(file, signature, onProgress)

      return this.transformCloudinaryResponse(response, file)
    } catch (error) {
      throw this.handleUploadError(error, file)
    }
  }

  /**
   * Uploads multiple files in parallel
   * @param files - Array of files to upload
   * @param options - Upload options
   * @param onProgress - Progress callback for each file
   * @returns Promise that resolves to array of uploaded files
   */
  async uploadFiles(
    files: File[],
    options: {
      folder?: string
      publicId?: string
      transformation?: string
      tags?: string[]
      eager?: string
      parallelUploads?: number
    } = {},
    onProgress?: (fileId: string, progress: UploadProgress) => void,
  ): Promise<UploadedFile[]> {
    const parallelUploads = options.parallelUploads || 3
    const results: UploadedFile[] = []
    const errors: Error[] = []

    // Process files in batches
    for (let i = 0; i < files.length; i += parallelUploads) {
      const batch = files.slice(i, i + parallelUploads)

      const batchPromises = batch.map(async (file, index) => {
        const fileId = `file-${i + index}`

        try {
          const result = await this.uploadFile(file, options, (progress) => {
            onProgress?.(fileId, progress)
          })
          return { success: true, result, fileId }
        } catch (error) {
          errors.push(error as Error)
          return { success: false, error, fileId }
        }
      })

      const batchResults = await Promise.all(batchPromises)

      // Add successful uploads to results
      batchResults.forEach(({ success, result }) => {
        if (success && result) {
          results.push(result)
        }
      })
    }

    if (errors.length > 0 && results.length === 0) {
      throw new Error(
        `All uploads failed: ${errors.map((e) => e.message).join(', ')}`,
      )
    }

    return results
  }

  /**
   * Deletes a file from Cloudinary
   * @param publicId - Public ID of the file to delete
   * @returns Promise that resolves when deletion is complete
   */
  async deleteFile(publicId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DELETE}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`)
      }
    } catch (error) {
      throw new Error(
        `Delete operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  // ============================================================================
  // 🔐 PRIVATE METHODS
  // ============================================================================

  /**
   * Gets upload signature from server
   * @param params - Upload parameters
   * @returns Promise that resolves to signature data
   */
  private async getUploadSignature(params: {
    folder?: string
    publicId?: string
    transformation?: string
    tags?: string[]
    eager?: string
  }): Promise<{
    signature: string
    timestamp: number
    apiKey: string
  }> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.SIGNATURE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
        ...params,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get upload signature: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.signature || !data.timestamp || !data.apiKey) {
      throw new Error('Invalid signature response from server')
    }

    return data
  }

  /**
   * Performs the actual file upload to Cloudinary
   * @param file - File to upload
   * @param signature - Upload signature
   * @param onProgress - Progress callback
   * @returns Promise that resolves to Cloudinary response
   */
  private async performUpload(
    file: File,
    signature: { signature: string; timestamp: number; apiKey: string },
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<CloudinaryResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', signature.apiKey)
    formData.append('timestamp', signature.timestamp.toString())
    formData.append('signature', signature.signature)
    formData.append('upload_preset', this.uploadPreset)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            fileId: `upload-${Date.now()}`,
            fileName: file.name,
            progress: Math.round((event.loaded / event.total) * 100),
            status: 'uploading',
            uploadedBytes: event.loaded,
            totalBytes: event.total,
            startTime: new Date(),
          }
          onProgress(progress)
        }
      })

      // Handle successful upload
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error('Invalid response from Cloudinary'))
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
        }
      })

      // Handle upload errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'))
      })

      // Start upload
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      )
      xhr.send(formData)
    })
  }

  /**
   * Transforms Cloudinary response to our UploadedFile format
   * @param response - Cloudinary API response
   * @param originalFile - Original file object
   * @returns UploadedFile object
   */
  private transformCloudinaryResponse(
    response: CloudinaryResponse,
    originalFile: File,
  ): UploadedFile {
    return {
      publicId: response.public_id,
      url: response.secure_url,
      name: originalFile.name,
      size: originalFile.size,
      type: originalFile.type,
      uploadedAt: new Date(response.created_at),
      width: response.width,
      height: response.height,
      format: response.format,
      bytes: response.bytes,
    }
  }

  /**
   * Handles upload errors and provides meaningful error messages
   * @param error - Original error
   * @param file - File that failed to upload
   * @returns Enhanced error with proper error codes
   */
  private handleUploadError(error: unknown, file: File): Error {
    if (error instanceof Error) {
      // Map common error patterns to error codes
      if (error.message.includes('Network error')) {
        return new Error(`${UploadErrorCode.NETWORK_ERROR}: ${error.message}`)
      }
      if (error.message.includes('timeout')) {
        return new Error(
          `${UploadErrorCode.TIMEOUT}: Upload timeout for ${file.name}`,
        )
      }
      if (error.message.includes('cancelled')) {
        return new Error(
          `${UploadErrorCode.CANCELLED}: Upload cancelled for ${file.name}`,
        )
      }
      if (error.message.includes('Invalid response')) {
        return new Error(
          `${UploadErrorCode.UPLOAD_FAILED}: Invalid response from server`,
        )
      }
      return new Error(`${UploadErrorCode.UPLOAD_FAILED}: ${error.message}`)
    }

    return new Error(
      `${UploadErrorCode.UNKNOWN_ERROR}: Unknown error occurred during upload`,
    )
  }
}

// ============================================================================
// 🏭 FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates a new upload service instance
 * @param config - Service configuration
 * @returns UploadService instance
 */
export function createUploadService(config: {
  cloudName: string
  uploadPreset: string
  baseUrl?: string
}): UploadService {
  return new UploadService(config)
}

/**
 * Creates a default upload service with common configuration
 * @param cloudName - Cloudinary cloud name
 * @param uploadPreset - Cloudinary upload preset
 * @returns UploadService instance
 */
export function createDefaultUploadService(
  cloudName: string,
  uploadPreset: string,
): UploadService {
  return new UploadService({
    cloudName,
    uploadPreset,
    baseUrl:
      process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
  })
}
