import { baseProcedure, createTRPCRouter } from '../utils/trpc'
import { router as executionsRouter } from './executions'
import { router as nodesRouter } from './nodes'

export const appRouter = createTRPCRouter({
  ping: baseProcedure
    .query(() => 'pong'),

  health: baseProcedure
    .query(() => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })),

  node: nodesRouter,
  execution: executionsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
