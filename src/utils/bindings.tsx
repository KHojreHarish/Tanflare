let cachedEnv: Env | null = null

// This gets called once at startup when running locally
const initDevEnv = async () => {
  // Only run on server side
  if (typeof window === 'undefined' && import.meta.env.DEV) {
    try {
      const { getPlatformProxy } = await import('wrangler')
      const proxy = await getPlatformProxy()
      cachedEnv = proxy.env as unknown as Env
    } catch (error) {
      console.warn(
        'Failed to initialize wrangler, using fallback env vars:',
        error,
      )
    }
  }
}

// Initialize only on server side
if (typeof window === 'undefined' && import.meta.env.DEV) {
  await initDevEnv()
}

/**
 * Server-side only function to get environment bindings
 * This should ONLY be called on the server side (APIs, loaders, server components)
 * @returns Environment bindings
 */
export function getBindings(): Env {
  // Ensure this only runs on server side
  if (typeof window !== 'undefined') {
    throw new Error('getBindings() can only be called on the server side')
  }

  if (import.meta.env.DEV) {
    if (!cachedEnv) {
      throw new Error(
        'Dev bindings not initialized yet. Call initDevEnv() first.',
      )
    }
    return cachedEnv
  }

  return process.env as unknown as Env
}
