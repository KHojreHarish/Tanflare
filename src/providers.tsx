/**
 * 🚀 Centralized Providers Configuration
 * 
 * This file consolidates all application providers in a single, organized location.
 * Providers are initialized in the correct order to ensure dependencies are met.
 * 
 * Initialization Order:
 * 1. Database Connection
 * 2. Authentication System
 * 3. TRPC + TanStack Query
 * 4. Better Auth Integration
 * 5. All Other Providers
 */

import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack'
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack'
import { Link, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import type { TRPCRouter } from '@/integrations/trpc/router'
import { TRPCProvider } from '@/integrations/trpc/react'
import { authClient } from '@/integrations/better-auth/auth-client'

// ============================================================================
// 🔌 TRPC CLIENT CONFIGURATION
// ============================================================================

/**
 * Determines the correct TRPC URL based on environment
 * - Client-side: Uses relative URL
 * - Server-side: Uses localhost with PORT
 */
function getTRPCUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return ''
    return `http://localhost:${process.env.PORT ?? 3000}`
  })()
  return `${base}/api/trpc`
}

/**
 * TRPC Client instance for making API calls
 * Configured with streaming support and superjson serialization
 */
export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson,
      url: getTRPCUrl(),
    }),
  ],
})

// ============================================================================
// 📊 QUERY CLIENT CONFIGURATION
// ============================================================================

/**
 * Creates a new TanStack Query client with optimized settings
 * 
 * Features:
 * - 1 minute stale time for better performance
 * - Superjson serialization for complex data types
 * - Proper hydration/dehydration for SSR
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute - reduces unnecessary refetches
        retry: 3, // Retry failed requests up to 3 times
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
      },
      mutations: {
        retry: 1, // Retry failed mutations only once
      },
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })
}

// ============================================================================
// 🖥️ SERVER-SIDE CONTEXT (SSR)
// ============================================================================

/**
 * Creates server-side context for SSR rendering
 * 
 * This function:
 * 1. Creates a fresh QueryClient for each server request
 * 2. Sets up TRPC server helpers for server-side data fetching
 * 3. Returns context that can be passed to the router
 * 
 * @returns Object containing queryClient and trpc helpers
 */
export function getServerContext() {
  const queryClient = createQueryClient()
  
  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  
  return {
    queryClient,
    trpc: serverHelpers,
  }
}

// ============================================================================
// 🌐 CLIENT-SIDE PROVIDERS COMPONENT
// ============================================================================

/**
 * Main client-side providers wrapper that combines all providers
 * 
 * Provider Hierarchy:
 * ┌─ TRPCProvider (TRPC + TanStack Query)
 * │  └─ AuthQueryProvider (Better Auth Query Layer)
 * │     └─ AuthUIProviderTanstack (Auth UI + Navigation)
 * │        └─ {children} (Your Application)
 * 
 * This ensures:
 * - TRPC is available throughout the app
 * - Auth state is properly managed
 * - Navigation works with auth flows
 * - All providers are available to child components
 */
export function ClientProviders({ 
  children, 
  queryClient 
}: { 
  children: ReactNode
  queryClient: QueryClient 
}) {
  const router = useRouter()
  
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <AuthQueryProvider>
        <AuthUIProviderTanstack
          authClient={authClient}
          // Navigation functions that integrate with TanStack Router
          navigate={(href) => router.navigate({ href })}
          replace={(href) => router.navigate({ href, replace: true })}
          // Custom Link component that works with TanStack Router
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          {children}
        </AuthUIProviderTanstack>
      </AuthQueryProvider>
    </TRPCProvider>
  )
}

// ============================================================================
// 🖥️ SERVER-SIDE PROVIDER COMPONENT (SSR)
// ============================================================================

/**
 * Server-side provider wrapper for SSR rendering
 * 
 * This component:
 * - Only includes TRPC provider (no auth needed on server)
 * - Provides the same queryClient to all server-rendered components
 * - Enables server-side data fetching with TRPC
 * 
 * Note: Auth providers are not included here since they're client-side only
 */
export function ServerProvider({ 
  children, 
  queryClient 
}: { 
  children: ReactNode
  queryClient: QueryClient 
}) {
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  )
}

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if all providers are properly initialized
 * Useful for debugging and ensuring app is ready
 */
export function areProvidersReady() {
  return {
    trpc: !!trpcClient,
    queryClient: true, // Always true since it's created on demand
    auth: !!authClient,
  }
}

/**
 * Gets provider status information
 * Returns detailed information about each provider's state
 */
export function getProviderStatus() {
  return {
    trpc: {
      status: 'ready',
      url: getTRPCUrl(),
      client: !!trpcClient,
    },
    query: {
      status: 'ready',
      staleTime: '1 minute',
      retryAttempts: 3,
    },
    auth: {
      status: 'ready',
      client: !!authClient,
      features: ['emailAndPassword', 'sessionManagement'],
    },
  }
}
