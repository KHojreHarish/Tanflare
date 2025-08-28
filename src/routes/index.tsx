import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Radial light from top center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_60%)]"
      />
      {/* Soft conic sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_200deg,rgba(255,255,255,0.2)_0%,transparent_50%,rgba(255,255,255,0.12)_75%,transparent_100%)] opacity-20 blur-3xl"
      />
      {/* Grid overlay with edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
      />

      <main className="relative z-10">
        {/* Navbar */}
        <header className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <img src="/logo.png" alt="Tanflare" width={70} height={70} />

            <div className="text-2xl font-extrabold tracking-tight text-brand-gradient animate-brand-gradient bg-clip-text">
              Tanflare
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a
              className="text-sm text-gray-300 hover:text-white transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm text-gray-300 hover:text-white transition-colors"
              href="#docs"
            >
              Docs
            </a>
            <a
              className="text-sm text-black bg-white/90 hover:bg-white px-4 py-2 rounded-md transition-colors"
              href="#start"
            >
              Get Started
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-6 pt-10 pb-20 text-center">
          <h1 className="mx-auto max-w-5xl text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight text-white">
            Modern Monochrome for the Productive Web
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Tanflare ships a robust stack: TanStack Router, tRPC, and React
            Query— ready for Cloudflare Workers. Minimal. Fast. Scalable.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-black shadow-sm transition-transform hover:scale-[1.02] bg-brand-gradient animate-brand-gradient"
            >
              Start Building
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon="🚀"
              title="Production Stack"
              desc="Router, tRPC, React Query with SSR-friendly defaults and centralized providers."
            />
            <FeatureCard
              icon="☁️"
              title="Workers Ready"
              desc="Cloudflare-first build, small bundles, modern targets, and edge-optimized."
            />
            <FeatureCard
              icon="🔐"
              title="Auth Included"
              desc="Better Auth integration with router-aware navigation and session handling."
            />
          </div>
        </section>

        {/* Callout / CTA */}
        <section id="start" className="container mx-auto px-6 pb-28">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <h2 className="text-3xl font-semibold text-white">
              Zero to Deploy in Minutes
            </h2>
            <p className="mt-4 text-gray-300">
              Use the included providers, routes, and integrations to ship
              faster with a clean, monochrome aesthetic.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                className="rounded-md px-6 py-3 text-sm font-medium text-black hover:opacity-95 transition-opacity bg-brand-gradient animate-brand-gradient"
                href="#"
              >
                View Docs
              </a>
              <a
                className="rounded-md border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                href="#"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 pb-12 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Tanflare. Built with TanStack +
          Cloudflare.
        </footer>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/10">
      <div className="text-3xl mb-4 select-none">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-300">{desc}</p>
    </div>
  )
}
