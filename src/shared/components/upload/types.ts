// ============================================================================
// 🎯 COMPREHENSIVE UPLOAD SYSTEM TYPES
// ============================================================================

/**
 * Core file upload types and interfaces
 * All upload-related types are centralized here for consistency
 */

// ============================================================================
// 📁 FILE TYPES
// ============================================================================

export interface UploadedFile {
  publicId: string
  url: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  width?: number
  height?: number
  format?: string
  bytes?: number
}

export interface FileValidationError {
  code: string
  message: string
  file: File
}

export interface FileValidationResult {
  isValid: boolean
  errors: FileValidationError[]
}

// ============================================================================
// 📊 PROGRESS & STATUS TYPES
// ============================================================================

export type UploadStatus =
  | 'idle'
  | 'pending'
  | 'uploading'
  | 'completed'
  | 'error'
  | 'retrying'
  | 'cancelled'

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: UploadStatus
  error?: string
  retryCount?: number
  uploadedBytes?: number
  totalBytes?: number
  startTime?: Date
  endTime?: Date
}

export interface UploadError {
  file: File
  error: string
  retryCount: number
  timestamp: Date
  code?: string
  details?: Record<string, unknown>
}

// ============================================================================
// ⚙️ CONFIGURATION TYPES
// ============================================================================

export interface CloudinaryConfig {
  cloudName: string
  uploadPreset: string
  apiKey?: string
  apiSecret?: string // ⚠️ Should never be used client-side
  signature?: string
  timestamp?: number
  folder?: string
  publicId?: string
  transformation?: string
  eager?: string
  tags?: string[]
}

export interface FileValidation {
  maxSize?: number
  minSize?: number
  acceptedTypes?: string[]
  maxFiles?: number
  minFiles?: number
  allowedExtensions?: string[]
  blockedExtensions?: string[]
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
}

export interface UploadBehavior {
  autoUpload?: boolean
  showProgress?: boolean
  showPreview?: boolean
  showUploadButton?: boolean
  uploadButtonText?: string
  enableRetry?: boolean
  retryButtonText?: string
  maxRetries?: number
  uploadTimeout?: number
  chunkSize?: number
  parallelUploads?: number
}

// ============================================================================
// 🎨 UI TYPES
// ============================================================================

export type DropzoneVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'minimal'
  | 'card'
export type DropzoneSize = 'sm' | 'md' | 'lg' | 'xl'
export type UploadTheme = 'default' | 'minimal' | 'card' | 'modern'

export interface UIProps {
  className?: string
  dropzoneClassName?: string
  textClassName?: string
  iconClassName?: string
  placeholder?: string
  subtext?: string
  icon?: React.ReactNode
  variant?: DropzoneVariant
  size?: DropzoneSize
  theme?: UploadTheme
}

// ============================================================================
// 🔄 CALLBACK TYPES
// ============================================================================

export interface UploadCallbacks {
  onUpload?: (file: UploadedFile) => void
  onProgress?: (progress: UploadProgress) => void
  onError?: (
    error: string,
    file?: File,
    details?: Record<string, unknown>,
  ) => void
  onSuccess?: (files: UploadedFile[]) => void
  onFilesChange?: (files: File[]) => void
  onUploadTrigger?: () => void
  onRetry?: (fileId: string) => void
  onCancel?: (fileId: string) => void
  onRemove?: (fileId: string) => void
}

// ============================================================================
// 🎛️ CONTROL TYPES
// ============================================================================

export interface ExternalControl {
  triggerUpload?: boolean
  disabled?: boolean
  loading?: boolean
  reset?: boolean
}

// ============================================================================
// 📦 RESULT TYPES
// ============================================================================

export interface UploadResult<T = UploadedFile> {
  success: boolean
  data?: T
  error?: string
  fileId: string
  retryable?: boolean
}

export interface UploadState<T = UploadedFile> {
  files: T[]
  progress: Map<string, UploadProgress>
  errors: Map<string, UploadError>
  isUploading: boolean
  hasErrors: boolean
  totalProgress: number
}

// ============================================================================
// 🔧 UTILITY TYPES
// ============================================================================

export interface UploadOptions {
  cloudName: string
  uploadPreset: string
  validation?: FileValidation
  behavior?: UploadBehavior
  callbacks?: UploadCallbacks
  ui?: UIProps
  control?: ExternalControl
}

export interface CloudinaryResponse {
  public_id: string
  secure_url: string
  width?: number
  height?: number
  format: string
  bytes: number
  created_at: string
  [key: string]: unknown
}

export interface UploadWidgetConfig {
  cloudName: string
  uploadPreset: string
  sources?: string[]
  multiple?: boolean
  cropping?: boolean
  showAdvancedOptions?: boolean
  showUploadMoreButton?: boolean
  showSkipCropButton?: boolean
  showPoweredBy?: boolean
  styles?: Record<string, unknown>
}

// ============================================================================
// 🚨 ERROR CODES
// ============================================================================

export enum UploadErrorCode {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TOO_SMALL = 'FILE_TOO_SMALL',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  TOO_MANY_FILES = 'TOO_MANY_FILES',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ============================================================================
// 📋 CONSTANTS
// ============================================================================

export const DEFAULT_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const DEFAULT_MAX_FILES = 10
export const DEFAULT_UPLOAD_TIMEOUT = 30000 // 30 seconds
export const DEFAULT_RETRY_ATTEMPTS = 3
export const DEFAULT_CHUNK_SIZE = 1024 * 1024 // 1MB

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/avi',
  'video/mov',
]

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
