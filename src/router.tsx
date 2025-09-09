import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ServerProvider, getServerContext } from './integrations/providers'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const createRouter = () => {
  const serverContext = getServerContext()

  const router = createTanstackRouter({
    routeTree,
    context: { ...serverContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <ServerProvider queryClient={serverContext.queryClient}>
          {props.children}
        </ServerProvider>
      )
    },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: serverContext.queryClient,
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
