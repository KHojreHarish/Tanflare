import {
  buildNonceSecurityHeaders,
  createNonceSecurityConfig,
  generateNonce,
} from '@/config/security-nonce'

/**
 * Middleware to generate and inject nonces for CSP
 * This is more secure than using 'unsafe-inline'
 */
export function createNonceMiddleware() {
  return async (request: Request, env: any) => {
    // Generate a unique nonce for this request
    const nonce = generateNonce()

    // Create security config with the nonce
    const securityConfig = createNonceSecurityConfig(nonce)

    // Build security headers with nonce
    const securityHeaders = buildNonceSecurityHeaders(securityConfig, nonce)

    // Store nonce in request context for use in HTML generation
    const requestWithNonce = {
      ...request,
      nonce,
      securityHeaders,
    }

    return requestWithNonce
  }
}

/**
 * Helper to inject nonce into script tags
 */
export function injectNonceIntoScript(
  scriptContent: string,
  nonce: string,
): string {
  return `<script nonce="${nonce}">${scriptContent}</script>`
}

/**
 * Helper to inject nonce into style tags
 */
export function injectNonceIntoStyle(
  styleContent: string,
  nonce: string,
): string {
  return `<style nonce="${nonce}">${styleContent}</style>`
}

/**
 * Helper to inject nonce into inline event handlers
 * Note: This is less secure than using nonce on script tags
 */
export function injectNonceIntoEventHandler(
  handler: string,
  nonce: string,
): string {
  return `nonce="${nonce}" ${handler}`
}
