/**
 * Cookie Management Components
 *
 * Simple, developer-controlled cookie management system.
 */

export { CookieManager } from './CookieManager'
export { useCookieManager } from '@/shared/hooks/use-cookie'
export type {
  CookieManagerProps,
  CookieConfig,
  CookieCategory,
  CookieConsent,
} from '@/shared/types/cookie'
