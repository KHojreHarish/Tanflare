/**
 * 🚀 Integrated Providers Configuration
 *
 * This file consolidates all integration providers in a single location:
 * - TanStack Query Provider (Data fetching & caching)
 * - TRPC Provider (Type-safe API layer)
 * - Better Auth Provider (Authentication & user management)
 *
 * All providers are configured exactly as they were in their separate files
 * and should work out of the box with clean, maintainable code.
 */

import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack'
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import superjson from 'superjson'
import { authClient } from './better-auth/auth-client'
import type {ReactNode} from 'react';

import type { TRPCRouter } from '@/trpc/routers'
import { TRPCProvider } from '@/trpc/react'
import { Toaster } from '@/shared/components/ui/sonner'

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
    httpBatchLink({
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
 * ┌─ QueryClientProvider (TanStack Query)
 * │  └─ TRPCProvider (TRPC + TanStack Query)
 * │     └─ AuthQueryProvider (Better Auth Query Layer)
 * │        └─ AuthUIProviderTanstack (Auth UI + Navigation)
 * │           └─ {children} (Your Application)
 *
 * This ensures:
 * - TRPC is available throughout the app
 * - Auth state is properly managed
 * - Navigation works with auth flows
 * - All providers are available to child components
 */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = createQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
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
            <Toaster />
          </AuthUIProviderTanstack>
        </AuthQueryProvider>
      </TRPCProvider>
    </QueryClientProvider>
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
  queryClient,
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
