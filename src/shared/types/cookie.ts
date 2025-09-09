/**
 * Minimal Cookie Management Types
 *
 * Simple, developer-controlled cookie management system.
 */

export type CookieCategory =
  | 'essential'
  | 'analytics'
  | 'marketing'
  | 'functional'

export type CookieConsent = {
  [key in CookieCategory]?: boolean
}

export type CookieConfig = {
  categories: Array<CookieCategory>
  autoOpen?: boolean // Auto-open drawer on first visit
  defaultEnabled?: Array<CookieCategory> // Categories enabled by default
}

export type CookieManagerProps = {
  config?: CookieConfig
  className?: string
  style?: React.CSSProperties
}
