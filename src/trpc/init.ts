import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { getDBClient } from '@/lib/db'
import { auth } from '@/integrations/better-auth/auth'
import {
  apiRateLimiter,
  authRateLimiter,
  createRateLimitMiddleware,
  emailRateLimiter,
  publicRateLimiter,
} from '@/lib/simple-rate-limit'
import { getBindings } from '@/utils/bindings'

// ============================================================================
// 🏗️ TRPC CONTEXT CREATION
// ============================================================================

/**
 * Creates the tRPC context for each request
 *
 * Context includes:
 * - Environment variables and Cloudflare bindings
 * - Request metadata (IP address)
 * - User session from Better Auth
 * - Database connection
 * - Standardized logger
 */
export async function createTRPCContext({ req }: { req: Request }) {
  // Extract request metadata
  const ip =
    req.headers.get('CF-Connecting-IP') ||
    req.headers.get('X-Forwarded-For') ||
    'unknown'

  // Get user session from Better Auth
  let user = null
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    user = session?.user || null
  } catch (error) {
    // Session parsing failed, user remains null
    console.warn('Failed to parse session:', error)
  }

  // Get database connection
  const db = await getDBClient()

  // Simple standardized logger
  const log = {
    info: (message: string, data?: any) => {
      console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '')
    },
    warn: (message: string, data?: any) => {
      console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '')
    },
    error: (message: string, data?: any) => {
      console.error(`[ERROR] ${message}`, data ? JSON.stringify(data) : '')
    },
  }

  return {
    // Environment and infrastructure (server-side only)
    env: getBindings(),

    // Request metadata
    ip,
    req, // Include original request for rate limiting

    // Authentication
    user,

    // Utilities
    db,
    log,
  }
}

// ============================================================================
// 🛡️ TRPC INITIALIZATION
// ============================================================================

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        requestId: (error.cause as any)?.requestId || 'unknown',
        timestamp: new Date().toISOString(),
      },
    }
  },
})

// ============================================================================
// 🔧 PROCEDURE EXPORTS
// ============================================================================

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// ============================================================================
// 🛡️ AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Middleware that requires user authentication
 * Throws UNAUTHORIZED error if no user session
 */
const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    ctx.log.warn('Unauthorized access attempt', { ip: ctx.ip })
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // TypeScript now knows user is not null
    },
  })
})

// Note: Admin and role-based middleware removed for template simplicity
// Add back if you need role-based access control in your application

// ============================================================================
// 🎯 PROTECTED PROCEDURES
// ============================================================================

/**
 * Procedure that requires authentication
 * Use for user-specific operations
 */
export const authProcedure = publicProcedure.use(requireAuth)

// ============================================================================
// 🚦 RATE LIMITED PROCEDURES
// ============================================================================

/**
 * Rate-limited public procedure for API endpoints
 * 100 requests per minute
 */
export const rateLimitedProcedure = publicProcedure.use(
  createRateLimitMiddleware(apiRateLimiter),
)

/**
 * Rate-limited auth procedure for authentication endpoints
 * 5 requests per 15 minutes
 */
export const rateLimitedAuthProcedure = authProcedure.use(
  createRateLimitMiddleware(authRateLimiter),
)

/**
 * Rate-limited email procedure for email endpoints
 * 3 requests per minute
 */
export const rateLimitedEmailProcedure = publicProcedure.use(
  createRateLimitMiddleware(emailRateLimiter),
)

/**
 * Rate-limited API procedure for general API endpoints
 * 100 requests per minute
 */
export const rateLimitedApiProcedure = publicProcedure.use(
  createRateLimitMiddleware(apiRateLimiter),
)

/**
 * Rate-limited public procedure for public endpoints
 * 1000 requests per minute
 */
export const rateLimitedPublicProcedure = publicProcedure.use(
  createRateLimitMiddleware(publicRateLimiter),
)

// ============================================================================
// 📝 CONTEXT TYPE EXPORT
// ============================================================================

export type Context = typeof createTRPCContext
