import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  authProcedure,
  createTRPCRouter,
  publicProcedure,
  rateLimitedEmailProcedure,
} from '../init'
import { resend } from '@/integrations/resend'

// 🎯 Essential API endpoints for the template
export const appRouter = createTRPCRouter({
  // ============================================================================
  // 🌐 PUBLIC ENDPOINTS (No authentication required)
  // ============================================================================

  health: publicProcedure.query(async ({ ctx }) => {
    ctx.log.info('Health check requested', { ip: ctx.ip })

    const checks = {
      database: 'unknown',
      cloudinary: 'unknown',
      resend: 'unknown',
    }

    // Check database connection
    try {
      await ctx.db.select().from(ctx.db.schema.user).limit(1)
      checks.database = 'healthy'
    } catch (error) {
      checks.database = 'unhealthy'
      ctx.log.error('Database health check failed', { error })
    }

    // Check Cloudinary configuration
    try {
      if (ctx.env.CLOUDINARY_CLOUD_NAME) {
        checks.cloudinary = 'healthy'
      } else {
        checks.cloudinary = 'unhealthy'
      }
    } catch (error) {
      checks.cloudinary = 'unhealthy'
      ctx.log.error('Cloudinary health check failed', { error })
    }

    // Check Resend configuration
    try {
      if (ctx.env.RESEND_API_KEY) {
        checks.resend = 'healthy'
      } else {
        checks.resend = 'unhealthy'
      }
    } catch (error) {
      checks.resend = 'unhealthy'
      ctx.log.error('Resend health check failed', { error })
    }

    const overallStatus = Object.values(checks).every(
      (status) => status === 'healthy',
    )
      ? 'healthy'
      : 'degraded'

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      message:
        overallStatus === 'healthy'
          ? 'All systems operational'
          : 'Some services are degraded',
      checks,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    }
  }),

  // Get Cloudinary upload configuration
  getUploadConfig: publicProcedure.query(({ ctx }) => {
    ctx.log.info('Upload config requested', { ip: ctx.ip })

    // Return only public configuration needed for client-side upload
    return {
      cloudName: ctx.env.CLOUDINARY_CLOUD_NAME || 'demo',
      uploadPreset: 'ml_default', // Default preset for unsigned uploads
      maxFileSize: 10000000, // 10MB
      acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      multiple: true,
      autoUpload: true,
    }
  }),

  // Upload file via server (for signed uploads or processing)
  uploadFile: publicProcedure
    .input(
      z.object({
        file: z.string(), // base64 encoded file
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        ctx.log.info('File upload requested', {
          fileName: input.fileName,
          fileType: input.fileType,
        })

        // Convert base64 to buffer
        const buffer = Buffer.from(input.file, 'base64')

        // Upload to Cloudinary
        const formData = new FormData()
        formData.append('file', new Blob([buffer], { type: input.fileType }))
        formData.append('upload_preset', 'ml_default')

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${ctx.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        )

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data: any = await response.json()

        ctx.log.info('File uploaded successfully', {
          publicId: data.public_id,
          fileName: input.fileName,
        })

        return {
          success: true,
          publicId: data.public_id,
          url: data.secure_url,
          fileName: input.fileName,
        }
      } catch (error) {
        ctx.log.error('File upload failed', {
          fileName: input.fileName,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'File upload failed',
          cause: error,
        })
      }
    }),

  // ============================================================================
  // 🔐 AUTHENTICATED ENDPOINTS (Requires login)
  // ============================================================================

  // Get current user profile
  getProfile: authProcedure.query(({ ctx }) => {
    ctx.log.info('User accessing profile', { userId: ctx.user.id })
    return {
      user: ctx.user,
      timestamp: new Date().toISOString(),
    }
  }),

  // ============================================================================
  // 📧 EMAIL ENDPOINTS (Rate Limited)
  // ============================================================================

  // Send welcome email (rate limited)
  sendWelcome: rateLimitedEmailProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { email, name } = input
        ctx.log.info('Sending welcome email', { email, name })

        // Send welcome email using Resend
        const result = await resend.emails.send({
          from: ctx.env.RESEND_FROM_EMAIL || 'Tanflare <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to Tanflare! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome to Tanflare! 🎉</h1>
              <p>Hello ${name || 'there'},</p>
              <p>Welcome to Tanflare! We're excited to have you on board.</p>
              <p>Best regards,<br>The Tanflare Team</p>
            </div>
          `,
        })

        ctx.log.info('Welcome email sent successfully', {
          emailId: result.data?.id,
        })

        return {
          success: true,
          message: 'Welcome email sent successfully!',
          emailId: result.data?.id || 'unknown',
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        ctx.log.error('Welcome email failed', { email: input.email, error })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send welcome email',
          cause: error,
        })
      }
    }),
})

export const trpcRouter = appRouter

export type TRPCRouter = typeof trpcRouter
