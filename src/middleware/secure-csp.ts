import {
  buildSecureSecurityHeaders,
  generateNonce,
} from '@/config/security-secure'

/**
 * Secure CSP Middleware for Tanflare Template
 *
 * This middleware automatically:
 * 1. Generates a unique nonce for each request
 * 2. Applies secure CSP headers with nonce
 * 3. Provides nonce for HTML generation
 * 4. Blocks malicious scripts while allowing legitimate ones
 */
export function createSecureCSPMiddleware() {
  return async (request: Request, env: any) => {
    // Generate unique nonce for this request
    const nonce = generateNonce()

    // Create secure security headers with nonce
    const securityHeaders = buildSecureSecurityHeaders(nonce)

    // Store nonce in request context for HTML generation
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
 * This ensures only legitimate scripts with the correct nonce execute
 */
export function injectNonceIntoScript(
  scriptContent: string,
  nonce: string,
): string {
  return `<script nonce="${nonce}">${scriptContent}</script>`
}

/**
 * Helper to inject nonce into style tags
 * This ensures only legitimate styles with the correct nonce apply
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

/**
 * Template-specific script injection helpers
 * These handle common Tanflare template scripts
 */
export const TanflareScripts = {
  /**
   * Inject React hydration script with nonce
   */
  hydration: (nonce: string, initialState: any) => {
    return injectNonceIntoScript(
      `window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};`,
      nonce,
    )
  },

  /**
   * Inject React client-side script with nonce
   */
  client: (nonce: string) => {
    return injectNonceIntoScript(
      `if (window.__INITIAL_STATE__) { ReactDOM.hydrate(<App />, document.getElementById('root')); }`,
      nonce,
    )
  },

  /**
   * Inject critical CSS with nonce
   */
  criticalCSS: (nonce: string) => {
    return injectNonceIntoStyle(
      `body { margin: 0; font-family: system-ui, sans-serif; } .loading { display: flex; justify-content: center; align-items: center; }`,
      nonce,
    )
  },
}
