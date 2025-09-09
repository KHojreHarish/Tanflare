import { createServerFileRoute } from '@tanstack/react-start/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { trpcRouter } from '@/trpc/routers'
import { createTRPCContext } from '@/trpc/init'

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: '/api/trpc',
    createContext: ({ req }) => createTRPCContext({ req }),
  })
}

export const ServerRoute = createServerFileRoute('/api/trpc/$').methods({
  GET: handler,
  POST: handler,
})
