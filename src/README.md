# Tanflare Directory Structure

This document explains the directory structure and conventions used in the Tanflare template.

## 🏗️ Directory Structure

```
src/
├── config/                       # App configuration
│   ├── app.ts                    # Main app configuration
│   ├── constants.ts              # Application constants
│   └── index.ts                  # Configuration exports
│
├── features/                     # Feature-based modules (MUST HAVE)
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth hooks (useAuth, useLogin, etc.)
│   │   ├── services/             # Auth API calls
│   │   ├── types/                # Auth TypeScript interfaces
│   │   ├── utils/                # Auth utility functions
│   │   └── index.ts              # Feature exports
│   │
│   ├── email/                    # Email feature
│   │   ├── components/           # Email templates, forms
│   │   ├── hooks/                # useEmail, useEmailTemplates
│   │   ├── services/             # Resend API integration
│   │   ├── templates/            # React Email templates
│   │   ├── types/                # Email interfaces
│   │   └── index.ts              # Feature exports
│   │
│   └── [other-features]/         # Future features follow same pattern
│
├── shared/                       # Shared across features
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components (Button, Input, etc.)
│   │   ├── forms/                # Form components
│   │   ├── layout/               # Layout components (Header, Footer, etc.)
│   │   └── feedback/             # Toast, Modal, etc.
│   ├── hooks/                    # Common hooks (useLocalStorage, useDebounce, etc.)
│   ├── utils/                    # Utility functions
│   ├── constants/                # App constants
│   ├── types/                    # Global TypeScript types
│   └── lib/                      # Third-party library configurations
│
├── integrations/                 # Third-party integrations
│   ├── trpc/                    # tRPC setup
│   ├── tanstack-query/          # React Query setup
│   ├── better-auth/             # BetterAuth configuration
│   ├── resend/                  # Resend configuration
│   └── cloudflare/              # Cloudflare-specific code
│
├── routes/                       # TanStack Router file-based routes
│   ├── __root.tsx               # Root layout
│   ├── index.tsx                # Home page
│   ├── auth/                    # Auth routes
│   ├── dashboard/                # Dashboard routes
│   └── api/                     # API routes
│
├── styles/                      # Global styles
│   ├── globals.css              # Global CSS
│   ├── components.css           # Component-specific styles
│   └── tailwind.css             # Tailwind imports
│
└── types/                       # Global TypeScript declarations
    ├── global.d.ts              # Global types
    ├── cloudflare.d.ts          # Cloudflare environment types
    └── api.d.ts                 # API response types
```

## 🎯 Key Principles

### 1. Feature-Based Organization

- **Each feature is self-contained** with its own components, hooks, services, types, and utils
- **Features don't import from each other** - they only import from `shared/`
- **Clear boundaries** prevent circular dependencies
- **Easy to scale** - new features follow the same pattern

### 2. Consistent Naming Conventions

- **`components/`** - Always contains UI components
- **`hooks/`** - Always contains React hooks
- **`services/`** - Always contains API calls and external integrations
- **`types/`** - Always contains TypeScript interfaces and types
- **`utils/`** - Always contains utility functions
- **`index.ts`** - Always exports everything from the feature

### 3. Import/Export Patterns

#### Feature Exports (src/features/auth/index.ts):

```typescript
// Components
export { LoginForm } from './components/LoginForm'
export { RegisterForm } from './components/RegisterForm'

// Hooks
export { useAuth } from './hooks/useAuth'
export { useLogin } from './hooks/useLogin'

// Services
export { authService } from './services/authService'

// Types
export type { User } from './types/user'
export type { AuthState } from './types/authState'

// Utils
export { validatePassword } from './utils/validatePassword'
```

#### Shared Exports (src/shared/index.ts):

```typescript
// Components
export * from './components/ui'
export * from './components/forms'
export * from './components/layout'
export * from './components/feedback'

// Hooks
export * from './hooks'

// Utils
export * from './utils'
```

### 4. Import Usage

```typescript
// Import from features
import { LoginForm, useAuth } from '@/features/auth'

// Import from shared
import { Button, useLocalStorage } from '@/shared'

// Import from integrations
import { trpc } from '@/trpc'
```

## 🚀 Benefits for AI Development

1. **Predictable Locations** - AI knows exactly where to find/create code
2. **Feature Isolation** - Changes in one feature don't affect others
3. **Clear Dependencies** - Import/export patterns are obvious
4. **Scalable Patterns** - New features follow established structure
5. **Easy Testing** - Each feature can be tested independently

## 📝 Development Workflow

### Creating a New Feature:

1. Create feature directory: `src/features/[feature-name]/`
2. Create subdirectories: `components/`, `hooks/`, `services/`, `types/`, `utils/`
3. Create `index.ts` with exports
4. Implement components, hooks, services, types, utils
5. Export everything through `index.ts`

### Adding Shared Components:

1. Create component in appropriate `src/shared/components/[category]/`
2. Export from `src/shared/components/[category]/index.ts`
3. Export from `src/shared/index.ts`
4. Use across features: `import { Component } from '@/shared'`

## 🔒 Rules to Follow

1. **Features never import from other features**
2. **Features only import from `shared/` and `integrations/`**
3. **Always use `index.ts` files for exports**
4. **Keep feature boundaries clear and focused**
5. **Use consistent naming across all features**
6. **Document complex patterns in feature READMEs**

## 🎨 Example Feature Structure

```
src/features/user-profile/
├── components/
│   ├── ProfileForm.tsx
│   └── ProfileCard.tsx
├── hooks/
│   ├── useProfile.ts
│   └── useAvatar.ts
├── services/
│   └── profileService.ts
├── types/
│   ├── profile.ts
│   └── avatar.ts
├── utils/
│   ├── formatProfile.ts
│   └── validateProfile.ts
└── index.ts
```

This structure ensures **maintainability**, **scalability**, and **AI-friendliness** for the Tanflare template.
