// Security Configuration
// Simple security configuration combining CSP and headers

import { randomBytes } from 'node:crypto'
import { buildCSPHeader } from './security/csp'
import { getSecurityHeaders } from './security/headers'

// Generate a cryptographically secure nonce
export function generateNonce(): string {
  return randomBytes(16).toString('base64')
}

// Build all security headers
export function buildSecurityHeaders(nonce: string) {
  return {
    'Content-Security-Policy': buildCSPHeader(nonce),
    ...getSecurityHeaders(nonce),
  }
}
