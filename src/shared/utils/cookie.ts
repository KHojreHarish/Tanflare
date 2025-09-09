/**
 * Minimal Cookie Utilities
 *
 * Simple cookie operations for the cookie management system.
 */

import type { CookieCategory, CookieConsent } from '@/shared/types/cookie'

const CONSENT_STORAGE_KEY = 'cookie_consent'

// Basic cookie operations
export const setCookie = (
  name: string,
  value: string,
  options: {
    expires?: Date
    maxAge?: number
    path?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
  } = {},
) => {
  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (options.expires) {
    cookieString += `; Expires=${options.expires.toUTCString()}`
  }
  if (options.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`
  }
  if (options.path) {
    cookieString += `; Path=${options.path || '/'}`
  }
  if (options.secure) {
    cookieString += `; Secure`
  }
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`
  }

  document.cookie = cookieString
}

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null

  const nameEQ = name + '='
  const ca = document.cookie.split(';')

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  }
  return null
}

export const deleteCookie = (name: string, path = '/') => {
  setCookie(name, '', { expires: new Date(0), path })
}

// Consent management
export const saveConsent = (consent: CookieConsent) => {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
}

export const getConsent = (): CookieConsent | null => {
  if (typeof localStorage === 'undefined') return null

  const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as CookieConsent
  } catch {
    return null
  }
}

export const hasConsent = (category: CookieCategory): boolean => {
  const consent = getConsent()
  return consent?.[category] === true
}

export const clearConsent = () => {
  localStorage.removeItem(CONSENT_STORAGE_KEY)
}
