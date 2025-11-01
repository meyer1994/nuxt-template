import { loggerLink } from '@trpc/client/links/loggerLink'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc'

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [
      loggerLink(),
      httpBatchLink({ url: '/api/trpc' }),
    ],
  })
  return { provide: { trpc } }
})
