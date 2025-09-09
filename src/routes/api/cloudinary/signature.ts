import { createServerFileRoute } from '@tanstack/react-start/server'
import crypto from 'crypto'

export const ServerRoute = createServerFileRoute(
  '/api/cloudinary/signature',
).methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const {
        cloudName,
        uploadPreset,
        folder,
        publicId,
        transformation,
        tags,
        eager,
      } = body

      // Get Cloudinary credentials from environment
      const apiSecret = process.env.CLOUDINARY_API_SECRET
      const apiKey = process.env.CLOUDINARY_API_KEY

      if (!apiSecret || !apiKey) {
        return new Response(
          JSON.stringify({
            error: 'Cloudinary credentials not configured',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // Generate timestamp
      const timestamp = Math.round(new Date().getTime() / 1000)

      // Create parameters for signature
      const params: Record<string, any> = {
        timestamp,
        upload_preset: uploadPreset,
        ...(folder && { folder }),
        ...(publicId && { public_id: publicId }),
        ...(transformation && { transformation }),
        ...(tags && { tags: tags.join(',') }),
        ...(eager && { eager }),
      }

      // Sort parameters for consistent signature generation
      const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&')

      // Generate signature
      const signature = crypto
        .createHash('sha1')
        .update(sortedParams + apiSecret)
        .digest('hex')

      return new Response(
        JSON.stringify({
          signature,
          timestamp,
          apiKey,
          cloudName,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    } catch (error) {
      console.error('Error generating Cloudinary signature:', error)

      return new Response(
        JSON.stringify({
          error: 'Failed to generate upload signature',
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
})
