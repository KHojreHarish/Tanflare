// ============================================================================
// 🎯 UPLOAD COMPONENTS EXPORTS
// ============================================================================

// Main components
export { CloudinaryDropzone } from './CloudinaryDropzone'

// Hooks
export { useUpload } from './hooks/useUpload'

// Services
export {
  UploadService,
  createUploadService,
  createDefaultUploadService,
} from './services/uploadService'

// Utilities
export * from './utils/validation'

// Types - All types are now centralized
export type {
  // Core types
  UploadedFile,
  UploadProgress,
  UploadError,
  UploadStatus,
  UploadResult,
  UploadState,

  // Configuration types
  CloudinaryConfig,
  FileValidation,
  UploadBehavior,
  UploadCallbacks,
  UIProps,
  ExternalControl,
  UploadOptions,
  CloudinaryResponse,
  UploadWidgetConfig,

  // UI types
  DropzoneVariant,
  DropzoneSize,
  UploadTheme,

  // Error types
  FileValidationError,
  FileValidationResult,
  UploadErrorCode,

  // Component props
  CloudinaryDropzoneProps,
} from './types'

// Constants
export {
  DEFAULT_FILE_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_UPLOAD_TIMEOUT,
  DEFAULT_RETRY_ATTEMPTS,
  DEFAULT_CHUNK_SIZE,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_DOCUMENT_TYPES,
} from './types'
