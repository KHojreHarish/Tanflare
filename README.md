# 🚀 Tanflare - TanStack + Cloudflare Template

**Clone → Install → Deploy → Build something amazing!**

A production-ready full-stack template built with TanStack Start, Cloudflare Workers, and modern web technologies. Get started with authentication, file uploads, and database integration in minutes.

## ✨ Features

- **🚀 TanStack Start** - Full-stack React framework
- **☁️ Cloudflare Workers** - Serverless deployment
- **🔐 Better Auth** - Complete authentication system
- **📁 File Uploads** - Cloudinary integration with drag & drop
- **🗄️ Database** - Drizzle ORM with Cloudflare D1
- **🎨 UI Components** - shadcn/ui with Tailwind CSS
- **🔒 Security** - CSP, rate limiting, security headers
- **📧 Email** - Resend integration for verification

## 🚀 Quick Start (3 Steps)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/tanflare.git my-awesome-app
cd my-awesome-app
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys (see below)
```

### 3. Start Building

```bash
pnpm run dev
# Open http://localhost:3000
```

## ⚡ What You Get Out of the Box

- ✅ **Authentication** - Complete auth system with Better Auth
- ✅ **File Uploads** - Drag & drop with Cloudinary
- ✅ **Database** - Drizzle ORM with Cloudflare D1
- ✅ **UI Components** - shadcn/ui with Tailwind CSS
- ✅ **Security** - CSP, rate limiting, security headers
- ✅ **Email** - Resend integration for verification
- ✅ **TypeScript** - Full type safety
- ✅ **Testing** - Vitest setup with examples

## 🔑 Required API Keys

You'll need these accounts (all have free tiers):

1. **Cloudflare** - For hosting and database
2. **Cloudinary** - For file uploads
3. **Resend** (optional) - For email verification

Get your keys and add them to `.env`:

```bash
# Authentication (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Cloudinary (get from dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend (optional)
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## 📁 Project Structure

```
src/
├── config/           # App configuration
├── integrations/     # Third-party integrations
├── lib/             # Utilities and database
├── middleware/      # Security middleware
├── routes/          # TanStack Router pages
├── shared/          # Shared components and hooks
├── trpc/            # tRPC API layer
└── styles/          # Global styles
```

## 🚀 Deploy to Production

```bash
# 1. Set up Cloudflare D1 database
npx wrangler d1 create my-app-db

# 2. Update wrangler.jsonc with your database ID

# 3. Deploy!
pnpm run deploy:prod
```

## 🔧 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run deploy:prod` - Deploy to production
- `pnpm run drizzle:gen` - Generate database migrations

## 🎯 Key Components

### Authentication

- Complete auth system with Better Auth
- Email verification with Resend
- Protected routes and API endpoints

### File Uploads

- Drag & drop interface with Cloudinary
- Image optimization and transformation
- Progress tracking and error handling

### Database

- Drizzle ORM with SQLite (Cloudflare D1)
- Type-safe database operations
- Automatic migrations

### Security

- Content Security Policy (CSP)
- Rate limiting with TanStack Pacer
- Security headers and nonce generation

## 📚 Documentation

- [Adding Endpoints](docs/ADDING_ENDPOINTS.md)
- [Cloudinary Dropzone](docs/CLOUDINARY_DROPZONE.md)
- [Production Deployment](docs/PRODUCTION_DEPLOYMENT.md)
- [Security Guide](docs/SECURITY.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for the amazing tools
- [Cloudflare](https://cloudflare.com/) for the platform
- [shadcn/ui](https://ui.shadcn.com/) for the components
- [Better Auth](https://better-auth.com/) for authentication
