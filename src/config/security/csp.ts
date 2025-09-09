// Content Security Policy Configuration
// Simple CSP configuration for different environments

export function getCSPConfig(nonce: string) {
  const isDev = process.env.NODE_ENV === 'development'
  const baseSources = ["'self'"]
  const cdnSources = [
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]
  const cloudinarySources = [
    'https://res.cloudinary.com',
    'https://upload-widget.cloudinary.com',
    'https://api.cloudinary.com',
  ]

  return {
    'default-src': baseSources,
    'script-src': [
      ...baseSources,
      ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : [`'nonce-${nonce}'`]),
      ...cdnSources,
      ...cloudinarySources,
    ],
    'style-src': [
      ...baseSources,
      "'unsafe-inline'", // Required for Tailwind and dynamic styles
      ...cdnSources,
    ],
    'img-src': [
      ...baseSources,
      'data:',
      'blob:',
      'https:',
      ...cloudinarySources,
    ],
    'font-src': [...baseSources, 'data:', ...cdnSources],
    'connect-src': [
      ...baseSources,
      'https:',
      'ws:',
      'wss:',
      ...cloudinarySources,
      'https://api.resend.com',
    ],
    'frame-src': [...baseSources, ...cloudinarySources],
    'object-src': ["'none'"],
  }
}

export function buildCSPHeader(nonce: string): string {
  const config = getCSPConfig(nonce)
  return Object.entries(config)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}
