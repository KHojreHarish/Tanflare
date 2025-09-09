import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'
import { buildSecurityHeaders, generateNonce } from './config/security'

// Create the base handler provided by TanStack Start
const baseHandler = createStartHandler({
  createRouter,
})(defaultStreamHandler)

// Create a wrapper function that adds secure CSP headers with nonce
const handleRequest = async (
  request: any,
  env: Env,
  _ctx: ExecutionContext,
) => {
  // Generate unique nonce for this request
  const nonce = generateNonce()

  // Create smart security headers with nonce (dev-friendly)
  const securityHeaders = buildSecurityHeaders(nonce)

  const response: Response = await baseHandler(request)

  // Add secure security headers
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value)
  }

  // For HTML responses, inject nonce and environment variables
  if (response.headers.get('content-type')?.includes('text/html')) {
    const html = await response.text()

    // Inject nonce into all script tags that don't already have one
    const htmlWithNonce = html.replace(
      /<script(?![^>]*nonce=)([^>]*)>/g,
      `<script nonce="${nonce}"$1>`,
    )

    // Inject nonce into all style tags that don't already have one
    const htmlWithStyleNonce = htmlWithNonce.replace(
      /<style(?![^>]*nonce=)([^>]*)>/g,
      `<style nonce="${nonce}"$1>`,
    )

    // Inject Cloudinary configuration for client-side use
    const cloudinaryConfig = {
      cloudName: env?.CLOUDINARY_CLOUD_NAME || 'demo',
      uploadPreset: 'ml_default', // Default preset for unsigned uploads
    }

    const htmlWithConfig = htmlWithStyleNonce.replace(
      '</head>',
      `<script nonce="${nonce}">
        window.__CLOUDINARY_CONFIG__ = ${JSON.stringify(cloudinaryConfig)};
      </script>
      </head>`,
    )

    return new Response(htmlWithConfig, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

// Export the handler function directly as default
export default handleRequest
