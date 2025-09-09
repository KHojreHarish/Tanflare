/**
 * Minimal Cookie Manager Component
 *
 * Single component that handles all cookie management with a drawer interface.
 * Only shows when developer configures non-essential cookies.
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CookieCategory, CookieManagerProps } from '@/shared/types/cookie'
import { Button } from '@/shared/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { useCookieManager } from '@/shared/hooks/use-cookie'
import { cn } from '@/shared/utils'

// Cookie category display info
const getCategoryInfo = (category: CookieCategory) => {
  const info = {
    essential: {
      name: 'Essential Cookies',
      description: 'Required for the website to function properly',
      icon: '🔒',
      required: true,
    },
    analytics: {
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website',
      icon: '📊',
      required: false,
    },
    marketing: {
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      icon: '📢',
      required: false,
    },
    functional: {
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      icon: '⚙️',
      required: false,
    },
  }
  return info[category]
}

// Simple toggle switch component
const ToggleSwitch = ({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}) => {
  return (
    <button
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        enabled ? 'bg-primary' : 'bg-muted',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
    >
      <motion.span
        className="inline-block h-4 w-4 transform rounded-full bg-background shadow-lg border border-border"
        animate={{ x: enabled ? 20 : 4 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </button>
  )
}

// Cookie category toggle component
const CookieCategoryToggle = ({
  category,
  enabled,
  onChange,
  disabled = false,
}: {
  category: CookieCategory
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}) => {
  const info = getCategoryInfo(category)

  return (
    <motion.div
      className={cn(
        'flex items-start justify-between rounded-xl border p-4 transition-colors',
        disabled && 'opacity-50',
        !disabled && 'hover:bg-accent/50',
      )}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="text-2xl flex-shrink-0">{info.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground">{info.name}</h4>
          <p className="text-sm text-muted-foreground break-words">
            {info.description}
          </p>
          {info.required && (
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Required
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 ml-3">
        <ToggleSwitch
          enabled={enabled}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </motion.div>
  )
}

// Main CookieManager component
export const CookieManager = ({
  config = { categories: ['essential'] },
  className,
  style,
}: CookieManagerProps) => {
  const { consent, isInitialized, updateConsent, acceptAll, denyAll } =
    useCookieManager()
  const [isOpen, setIsOpen] = React.useState(false)
  const [localConsent, setLocalConsent] = React.useState<
    Record<CookieCategory, boolean>
  >({})

  // Check if we should show the cookie manager
  const shouldShow = config.categories.some((cat) => cat !== 'essential')

  // Initialize local consent state and handle auto-open
  React.useEffect(() => {
    if (!isInitialized) return

    const initialConsent: Record<CookieCategory, boolean> = {} as Record<
      CookieCategory,
      boolean
    >

    config.categories.forEach((category) => {
      // Check if user has existing consent
      if (consent?.[category] !== undefined) {
        initialConsent[category] = consent[category]
      } else {
        // Use default enabled categories or essential only
        initialConsent[category] =
          config.defaultEnabled?.includes(category) ?? category === 'essential'
      }
    })

    setLocalConsent(initialConsent)

    // Auto-open drawer if configured and no consent exists
    if (config.autoOpen && !consent && shouldShow) {
      setIsOpen(true)
    }
  }, [
    isInitialized,
    consent,
    config.categories,
    config.autoOpen,
    config.defaultEnabled,
    shouldShow,
  ])

  // Handle category toggle
  const handleCategoryToggle = (category: CookieCategory, enabled: boolean) => {
    setLocalConsent((prev) => ({ ...prev, [category]: enabled }))
  }

  // Handle save preferences
  const handleSave = () => {
    updateConsent(localConsent)
    setIsOpen(false)
  }

  // Handle accept all
  const handleAcceptAll = () => {
    acceptAll(config.categories)
    setIsOpen(false)
  }

  // Handle deny all
  const handleDenyAll = () => {
    denyAll(config.categories)
    setIsOpen(false)
  }

  // Don't render if only essential cookies or not initialized
  if (!shouldShow || !isInitialized) {
    return null
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)} style={style}>
      {/* Cookie Settings Button */}
      <motion.div
        className="rounded-2xl bg-background border border-border shadow-lg backdrop-blur-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-border bg-background hover:bg-accent hover:text-accent-foreground"
            >
              🍪 Cookie Settings
            </Button>
          </DrawerTrigger>

          <DrawerContent className="rounded-t-3xl border-border bg-background">
            <DrawerHeader className="pb-4">
              <DrawerTitle className="text-foreground">
                Cookie Preferences
              </DrawerTitle>
              <DrawerDescription className="text-muted-foreground">
                Manage your cookie preferences. You can enable or disable
                different types of cookies below.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 space-y-4">
              {config.categories.map((category) => {
                const info = getCategoryInfo(category)
                return (
                  <CookieCategoryToggle
                    key={category}
                    category={category}
                    enabled={localConsent[category] ?? false}
                    onChange={(enabled) =>
                      handleCategoryToggle(category, enabled)
                    }
                    disabled={category === 'essential'}
                  />
                )
              })}
            </div>

            <DrawerFooter className="flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleDenyAll}
                className="flex-1 rounded-xl border-border bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Deny All
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                className="flex-1 rounded-xl border-border bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Save Preferences
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Accept All
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </motion.div>
    </div>
  )
}
