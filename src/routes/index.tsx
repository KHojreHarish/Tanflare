import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Logo with Gradient Animation */}
        <div className="mb-8">
          <img src="/logo.png" alt="Tanflare" className="w-20 h-16 m-auto " />
          <h1 className="text-6xl font-bold">
            <span className="text-brand-gradient animate-brand-gradient bg-clip-text text-transparent">
              TANFLARE
            </span>
          </h1>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-12 text-lg">
          <p className="text-foreground">
            Get started by editing{' '}
            <code className="bg-muted px-3 py-1 rounded-md text-primary font-mono text-sm">
              src/routes/index.tsx
            </code>
          </p>
          <p className="text-muted-foreground">
            Save and see your changes instantly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="btn-brand animate-brand-gradient hover:scale-105 transition-transform duration-200 flex items-center gap-2 shadow-lg"
            onClick={() => (window.location.href = '/auth/login')}
          >
            <span>Test Auth</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
            onClick={() => (window.location.href = '/account')}
          >
            View Account
          </Button>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm">
          <a
            href="https://tanstack.com/router/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn
          </a>
          <a
            href="https://github.com/your-username/tanflare"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Examples
          </a>
          <a
            href="https://tanstack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                clipRule="evenodd"
              />
            </svg>
            Go to tanstack.com →
          </a>
        </div>
      </div>
    </div>
  )
}
