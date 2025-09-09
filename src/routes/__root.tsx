import { TanstackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Providers } from '../integrations/providers'

import appCss from '../styles/globals.css?url'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCRouter } from '@/trpc/routers'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { CookieManager } from '@/shared/components/cookie'
import NotFound from '@/shared/components/misc/NotFound'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tanflare - TanStack + Cloudflare Template',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const isDev = import.meta.env.DEV

  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        {/* Cloudinary Upload Widget Script */}
        <script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          type="text/javascript"
        ></script>
      </head>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>

        {/* Cookie Manager - Only shows when non-essential cookies are configured */}
        <CookieManager
          config={{
            categories: ['essential', 'analytics'],
            autoOpen: true,
            defaultEnabled: ['essential', 'analytics'],
          }}
        />

        {isDev && (
          <TanstackDevtools
            config={{
              position: 'bottom-left',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
