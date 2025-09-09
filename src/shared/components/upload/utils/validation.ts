// ============================================================================
// 🔍 FILE VALIDATION UTILITIES
// ============================================================================

import {
  FileValidation,
  FileValidationError,
  FileValidationResult,
  UploadErrorCode,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_DOCUMENT_TYPES,
} from '../types'

/**
 * Comprehensive file validation utility
 * Provides robust validation for file uploads with detailed error reporting
 */

// ============================================================================
// 📋 VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a single file against the provided validation rules
 * @param file - The file to validate
 * @param validation - Validation rules to apply
 * @returns Validation result with detailed error information
 */
export function validateFile(
  file: File,
  validation: FileValidation,
): FileValidationResult {
  const errors: FileValidationError[] = []

  // File size validation
  if (validation.maxSize && file.size > validation.maxSize) {
    errors.push({
      code: UploadErrorCode.FILE_TOO_LARGE,
      message: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(validation.maxSize)})`,
      file,
    })
  }

  if (validation.minSize && file.size < validation.minSize) {
    errors.push({
      code: UploadErrorCode.FILE_TOO_SMALL,
      message: `File size (${formatFileSize(file.size)}) is below minimum required size (${formatFileSize(validation.minSize)})`,
      file,
    })
  }

  // File type validation
  if (validation.acceptedTypes && validation.acceptedTypes.length > 0) {
    const isAcceptedType = validation.acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isAcceptedType) {
      errors.push({
        code: UploadErrorCode.INVALID_FILE_TYPE,
        message: `File type "${file.type}" is not allowed. Accepted types: ${validation.acceptedTypes.join(', ')}`,
        file,
      })
    }
  }

  // Extension validation
  if (validation.allowedExtensions && validation.allowedExtensions.length > 0) {
    const fileExtension = getFileExtension(file.name)
    if (!validation.allowedExtensions.includes(fileExtension)) {
      errors.push({
        code: UploadErrorCode.INVALID_FILE_TYPE,
        message: `File extension "${fileExtension}" is not allowed. Allowed extensions: ${validation.allowedExtensions.join(', ')}`,
        file,
      })
    }
  }

  if (validation.blockedExtensions && validation.blockedExtensions.length > 0) {
    const fileExtension = getFileExtension(file.name)
    if (validation.blockedExtensions.includes(fileExtension)) {
      errors.push({
        code: UploadErrorCode.INVALID_FILE_TYPE,
        message: `File extension "${fileExtension}" is blocked`,
        file,
      })
    }
  }

  // Image dimension validation (for images only)
  if (file.type.startsWith('image/')) {
    // Note: Image dimension validation would require loading the image
    // This is handled separately in the image validation utility
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates multiple files against the provided validation rules
 * @param files - Array of files to validate
 * @param validation - Validation rules to apply
 * @returns Validation result with detailed error information
 */
export function validateFiles(
  files: File[],
  validation: FileValidation,
): FileValidationResult {
  const errors: FileValidationError[] = []

  // Check file count limits
  if (validation.maxFiles && files.length > validation.maxFiles) {
    errors.push({
      code: UploadErrorCode.TOO_MANY_FILES,
      message: `Too many files selected. Maximum allowed: ${validation.maxFiles}, selected: ${files.length}`,
      file: files[0], // Use first file as reference
    })
  }

  if (validation.minFiles && files.length < validation.minFiles) {
    errors.push({
      code: UploadErrorCode.VALIDATION_ERROR,
      message: `Not enough files selected. Minimum required: ${validation.minFiles}, selected: ${files.length}`,
      file: files[0], // Use first file as reference
    })
  }

  // Validate each file
  files.forEach((file) => {
    const fileValidation = validateFile(file, validation)
    errors.push(...fileValidation.errors)
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// 🖼️ IMAGE VALIDATION
// ============================================================================

/**
 * Validates image dimensions
 * @param file - Image file to validate
 * @param maxWidth - Maximum allowed width
 * @param maxHeight - Maximum allowed height
 * @param minWidth - Minimum required width
 * @param minHeight - Minimum required height
 * @returns Promise that resolves to validation result
 */
export async function validateImageDimensions(
  file: File,
  maxWidth?: number,
  maxHeight?: number,
  minWidth?: number,
  minHeight?: number,
): Promise<FileValidationResult> {
  if (!file.type.startsWith('image/')) {
    return { isValid: true, errors: [] }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const errors: FileValidationError[] = []

      if (maxWidth && img.width > maxWidth) {
        errors.push({
          code: UploadErrorCode.VALIDATION_ERROR,
          message: `Image width (${img.width}px) exceeds maximum allowed width (${maxWidth}px)`,
          file,
        })
      }

      if (maxHeight && img.height > maxHeight) {
        errors.push({
          code: UploadErrorCode.VALIDATION_ERROR,
          message: `Image height (${img.height}px) exceeds maximum allowed height (${maxHeight}px)`,
          file,
        })
      }

      if (minWidth && img.width < minWidth) {
        errors.push({
          code: UploadErrorCode.VALIDATION_ERROR,
          message: `Image width (${img.width}px) is below minimum required width (${minWidth}px)`,
          file,
        })
      }

      if (minHeight && img.height < minHeight) {
        errors.push({
          code: UploadErrorCode.VALIDATION_ERROR,
          message: `Image height (${img.height}px) is below minimum required height (${minHeight}px)`,
          file,
        })
      }

      resolve({
        isValid: errors.length === 0,
        errors,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        isValid: false,
        errors: [
          {
            code: UploadErrorCode.VALIDATION_ERROR,
            message: 'Failed to load image for dimension validation',
            file,
          },
        ],
      })
    }

    img.src = url
  })
}

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Gets file extension from filename
 * @param filename - The filename
 * @returns File extension in lowercase
 */
export function getFileExtension(filename: string): string {
  return filename
    .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase()
}

/**
 * Checks if file type is supported
 * @param fileType - MIME type to check
 * @param supportedTypes - Array of supported MIME types
 * @returns True if file type is supported
 */
export function isFileTypeSupported(
  fileType: string,
  supportedTypes: string[],
): boolean {
  return supportedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return fileType.startsWith(type.slice(0, -1))
    }
    return fileType === type
  })
}

/**
 * Gets human-readable file type description
 * @param fileType - MIME type
 * @returns Human-readable description
 */
export function getFileTypeDescription(fileType: string): string {
  if (fileType.startsWith('image/')) return 'Image'
  if (fileType.startsWith('video/')) return 'Video'
  if (fileType.startsWith('audio/')) return 'Audio'
  if (fileType === 'application/pdf') return 'PDF Document'
  if (fileType.startsWith('text/')) return 'Text Document'
  if (fileType.includes('word')) return 'Word Document'
  if (fileType.includes('excel') || fileType.includes('spreadsheet'))
    return 'Spreadsheet'
  if (fileType.includes('presentation') || fileType.includes('powerpoint'))
    return 'Presentation'
  return 'File'
}

/**
 * Sanitizes filename by removing dangerous characters
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 255) // Limit length
}

/**
 * Creates a default validation configuration
 * @returns Default validation rules
 */
export function createDefaultValidation(): FileValidation {
  return {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: [
      ...SUPPORTED_IMAGE_TYPES,
      ...SUPPORTED_VIDEO_TYPES,
      ...SUPPORTED_DOCUMENT_TYPES,
    ],
    maxFiles: 10,
    minFiles: 1,
  }
}

/**
 * Creates validation configuration for images only
 * @returns Image-specific validation rules
 */
export function createImageValidation(): FileValidation {
  return {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: SUPPORTED_IMAGE_TYPES,
    maxFiles: 10,
    minFiles: 1,
    maxWidth: 4096,
    maxHeight: 4096,
    minWidth: 1,
    minHeight: 1,
  }
}

/**
 * Creates validation configuration for documents only
 * @returns Document-specific validation rules
 */
export function createDocumentValidation(): FileValidation {
  return {
    maxSize: 50 * 1024 * 1024, // 50MB
    acceptedTypes: SUPPORTED_DOCUMENT_TYPES,
    maxFiles: 5,
    minFiles: 1,
  }
}
