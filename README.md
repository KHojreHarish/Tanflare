# Tanflare - TanStack + Cloudflare Template

A production-ready template built with TanStack Start, featuring authentication, email capabilities, file uploads, and comprehensive utilities.

## 🚀 Features

- **TanStack Router** - Type-safe routing with SSR
- **tRPC** - End-to-end typesafe APIs
- **TanStack Query** - Powerful data fetching and caching
- **File Uploads** - Uppy Dashboard with Webcam support
- **Tailwind CSS v4** - Latest styling with PostCSS
- **Cloudflare Workers** - Edge deployment ready
- **TypeScript** - Full type safety
- **BetterAuth** - Modern authentication system (ready to configure)
- **Resend + React Emails** - Professional email templates (planned)
- **Cloudinary Integration** - File storage ready (planned)

## 🛠️ Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Query
- **Backend**: tRPC, TanStack Start
- **Styling**: Tailwind CSS v4 with PostCSS
- **Deployment**: Cloudflare Workers & Pages
- **File Upload**: Uppy v5 with Dashboard + Webcam
- **Authentication**: BetterAuth (ready to configure)
- **Email**: Resend + React Emails (planned)
- **File Storage**: Cloudinary (planned)

## 📦 Installation

```bash
# Clone the template
git clone <your-repo-url>
cd start-trpc

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve

# Lint and format
npm run check
```

## ☁️ Cloudflare Deployment

This template is configured for Cloudflare Workers deployment.

### Prerequisites

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`

### Deploy

```bash
# Deploy to development
npm run deploy

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod

# Generate Cloudflare types
npm run cf:typegen
```

### Configuration

Edit `wrangler.toml` to configure:

- Worker names
- Environment variables
- KV namespaces
- D1 databases

## 🔐 Authentication Setup

BetterAuth is pre-configured and ready to use:

1. Configure your auth provider in the auth configuration
2. Set up environment variables
3. Customize auth UI components

## 📧 Email Setup

Resend + React Emails integration:

1. Get your Resend API key
2. Configure email templates
3. Set up environment variables

## 📁 File Upload Setup

Cloudinary + React Uploady integration:

1. Configure Cloudinary credentials
2. Set up upload presets
3. Customize upload components

## 🧰 Utilities

The template includes common utilities for:

- Form validation
- Date/time handling
- String manipulation
- API response handling
- Common React hooks

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── integrations/        # Third-party integrations
│   ├── trpc/           # tRPC setup
│   └── tanstack-query/ # TanStack Query setup
├── lib/                 # Utility libraries
├── routes/              # Application routes
├── store/               # State management
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## 🔧 Customization

### Adding New Routes

Create new route files in `src/routes/` following TanStack Router conventions.

### Adding New tRPC Procedures

Extend the router in `src/integrations/trpc/router.ts`.

### Adding New Components

Place reusable components in `src/components/`.

## 📚 Documentation

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [tRPC](https://trpc.io/)
- [BetterAuth](https://auth.better-auth.com/)
- [Resend](https://resend.com/)
- [Cloudinary](https://cloudinary.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
