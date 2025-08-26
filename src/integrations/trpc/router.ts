import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

// Clean router structure - ready for your application logic
const appRouter = {
  // Add your application routes here
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter(appRouter)
export type TRPCRouter = typeof trpcRouter
