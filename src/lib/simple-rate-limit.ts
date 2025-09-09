/**
 * Simplified Rate Limiting
 *
 * This is a much simpler approach to rate limiting that's easier to understand
 * and maintain. Perfect for templates and most applications.
 */

import { rateLimit } from '@tanstack/pacer'

// ============================================================================
// 🚦 SIMPLE RATE LIMITS
// ============================================================================

/**
 * Simple rate limit configuration
 * Adjust these values based on your needs
 */
const RATE_LIMITS = {
  email: { limit: 5, window: 60000 }, // 5 emails per minute
  auth: { limit: 10, window: 900000 }, // 10 auth attempts per 15 minutes
  api: { limit: 100, window: 60000 }, // 100 API calls per minute
  public: { limit: 1000, window: 60000 }, // 1000 public calls per minute
} as const

// ============================================================================
// 🚦 RATE LIMITERS
// ============================================================================

/**
 * Create a simple rate limiter
 */
function createSimpleRateLimiter(limit: number, window: number) {
  return rateLimit(
    (request: any) => {
      // Use IP address as the key, fallback to 'anonymous'
      return (
        request.ip || request.headers?.get('cf-connecting-ip') || 'anonymous'
      )
    },
    { limit, window },
  )
}

// Export rate limiters for different endpoint types
export const emailRateLimiter = createSimpleRateLimiter(
  RATE_LIMITS.email.limit,
  RATE_LIMITS.email.window,
)

export const authRateLimiter = createSimpleRateLimiter(
  RATE_LIMITS.auth.limit,
  RATE_LIMITS.auth.window,
)

export const apiRateLimiter = createSimpleRateLimiter(
  RATE_LIMITS.api.limit,
  RATE_LIMITS.api.window,
)

export const publicRateLimiter = createSimpleRateLimiter(
  RATE_LIMITS.public.limit,
  RATE_LIMITS.public.window,
)

// ============================================================================
// 🚦 TRPC MIDDLEWARE
// ============================================================================

/**
 * Create rate limit middleware for tRPC
 */
export function createRateLimitMiddleware(rateLimiter: any) {
  return async ({ ctx, next }: { ctx: any; next: any }) => {
    const request = {
      ip: ctx.ip,
      headers: ctx.req?.headers || new Headers(),
    }

    try {
      // TanStack Pacer returns a simple boolean
      const allowed = await rateLimiter(request)

      if (!allowed) {
        throw new Error('Rate limit exceeded. Try again in 60 seconds.')
      }

      return next()
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Rate limit exceeded')
      ) {
        throw new Error('Rate limit exceeded. Try again in 60 seconds.')
      }

      // If rate limiter fails, allow the request but log the error
      console.error('Rate limit check failed:', error)
      return next()
    }
  }
}

// ============================================================================
// 🚦 HTTP UTILITY
// ============================================================================

/**
 * Check rate limit for HTTP requests
 */
export async function checkHttpRateLimit(
  rateLimiter: any,
  request: Request,
  ip: string,
) {
  const rateLimitRequest = {
    ip,
    headers: request.headers,
  }

  try {
    const allowed = await rateLimiter(rateLimitRequest)

    const headers = {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': allowed ? '99' : '0',
      'X-RateLimit-Reset': Math.ceil((Date.now() + 60000) / 1000).toString(),
    }

    if (!allowed) {
      return {
        allowed: false,
        headers,
        error: 'Rate limit exceeded. Try again in 60 seconds.',
      }
    }

    return {
      allowed: true,
      headers,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return {
      allowed: true,
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '100',
        'X-RateLimit-Reset': Math.ceil((Date.now() + 60000) / 1000).toString(),
      },
    }
  }
}
