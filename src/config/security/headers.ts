// Security Headers Configuration
// Simple security headers for different environments

export function getSecurityHeaders(nonce: string) {
  const isDev = process.env.NODE_ENV === 'development'
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site',
    'X-XSS-Protection': '0',
    'X-Nonce': nonce,
    ...(isDev
      ? {}
      : { 'Strict-Transport-Security': 'max-age=63072000; includeSubDomains' }),
  }
}
