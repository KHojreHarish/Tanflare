// Application Constants
// Centralized constants used throughout the application

export const CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ],

  // Validation
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,

  // API
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // UI
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,

  // Security
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const

export type Constants = typeof CONSTANTS
