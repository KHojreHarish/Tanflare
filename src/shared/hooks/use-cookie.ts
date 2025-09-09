/**
 * Simple Cookie Manager Hook
 *
 * Minimal hook for cookie management with developer control.
 */

import { useCallback, useEffect, useState } from 'react'
import type { CookieCategory, CookieConsent } from '@/shared/types/cookie'
import {
  clearConsent,
  getConsent,
  hasConsent,
  saveConsent,
} from '@/shared/utils/cookie'

export const useCookieManager = () => {
  const [consent, setConsentState] = useState<CookieConsent | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize consent state
  useEffect(() => {
    const storedConsent = getConsent()
    setConsentState(storedConsent)
    setIsInitialized(true)
  }, [])

  // Update consent
  const updateConsent = useCallback((newConsent: CookieConsent) => {
    saveConsent(newConsent)
    setConsentState(newConsent)
  }, [])

  // Check if user has consented to a category
  const checkConsent = useCallback((category: CookieCategory) => {
    return hasConsent(category)
  }, [])

  // Accept all categories
  const acceptAll = useCallback(
    (categories: Array<CookieCategory>) => {
      const allConsent: CookieConsent = {}
      categories.forEach((category) => {
        allConsent[category] = true
      })
      updateConsent(allConsent)
    },
    [updateConsent],
  )

  // Deny all non-essential categories
  const denyAll = useCallback(
    (categories: Array<CookieCategory>) => {
      const minimalConsent: CookieConsent = {}
      categories.forEach((category) => {
        minimalConsent[category] = category === 'essential'
      })
      updateConsent(minimalConsent)
    },
    [updateConsent],
  )

  // Clear all consent
  const clearAllConsent = useCallback(() => {
    clearConsent()
    setConsentState(null)
  }, [])

  return {
    consent,
    isInitialized,
    updateConsent,
    checkConsent,
    acceptAll,
    denyAll,
    clearAllConsent,
  }
}
