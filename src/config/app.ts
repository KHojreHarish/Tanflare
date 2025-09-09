// App Configuration
// Central configuration for the Tanflare application

export const APP_CONFIG = {
  name: 'Tanflare',
  version: '1.0.0',
  description: 'TanStack + Cloudflare Template',

  // App settings
  settings: {
    defaultLocale: 'en',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
  },

  // Feature flags
  features: {
    auth: true,
    email: true,
  },

  // API configuration
  api: {
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://your-worker.your-subdomain.workers.dev'
        : 'http://localhost:3000',
    timeout: 10000,
  },

  // Cloudflare configuration
  cloudflare: {
    workerName: 'tanflare',
    pagesProject: 'tanflare-pages',
  },
} as const

export type AppConfig = typeof APP_CONFIG
