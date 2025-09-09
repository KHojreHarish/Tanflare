import { Button } from '@/shared/components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6">
        {/* 404 Number with gradient */}
        <h1 className="text-8xl sm:text-9xl font-black text-brand-gradient animate-brand-gradient bg-clip-text text-transparent mb-8">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => window.history.back()}
            className="btn-brand animate-brand-gradient hover:scale-105 transition-transform duration-200 px-8 py-3 text-base font-medium shadow-lg"
          >
            Go Back
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="px-8 py-3 text-base font-medium border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
