import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Tanflare
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A production-ready template combining TanStack Router, tRPC, React
          Query, with Cloudflare Workers & Pages deployment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg shadow-xs">
            <h3 className="font-semibold text-gray-800 mb-2">
              🚀 TanStack Stack
            </h3>
            <p className="text-gray-600">
              Router, tRPC, React Query - production ready
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-xs">
            <h3 className="font-semibold text-gray-800 mb-2">
              ☁️ Cloudflare Ready
            </h3>
            <p className="text-gray-600">
              Workers + Pages deployment optimized
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-xs">
            <h3 className="font-semibold text-gray-800 mb-2">📁 File Upload</h3>
            <p className="text-gray-600">Uppy Dashboard with Webcam support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
