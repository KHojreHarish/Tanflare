import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Core User table (Table Name: 'user')
export const user = sqliteTable('user', {
  id: text('id').primaryKey(), // SQLite uses text for UUIDs
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  image: text('image'), // Optional
  // Role field for RBAC - can be a single role or comma-separated roles
  role: text('role').default('buyer'), // Default role for new users
  // Use integer timestamps that map to JS Date
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`) // DB default in ms
    .$onUpdate(() => new Date()), // App-level update hook in Date
})

// Core Session table (Table Name: 'session')
export const session = sqliteTable('session', {
  id: text('id').primaryKey(), // SQLite uses text for UUIDs
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'), // Optional
  userAgent: text('user_agent'), // Optional
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`) // DB default in ms
    .$onUpdate(() => new Date()),
})

// Core Account table (Table Name: 'account')
export const account = sqliteTable('account', {
  id: text('id').primaryKey(), // SQLite uses text for UUIDs
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'), // Optional
  refreshToken: text('refresh_token'), // Optional
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }), // Optional
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }), // Optional
  scope: text('scope'), // Optional
  idToken: text('id_token'), // Optional
  password: text('password'), // Optional - Mainly for email/password auth
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`) // DB default in ms
    .$onUpdate(() => new Date()),
})

// Core Verification table (Table Name: 'verification')
export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(), // SQLite uses text for UUIDs
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CAST(strftime('%s','now') AS INTEGER) * 1000)`) // DB default in ms
    .$onUpdate(() => new Date()),
})

// Indexes for better performance
export const sessionIndexes = {
  userIdIdx: index('session_user_id_idx').on(session.userId),
  tokenIdx: index('session_token_idx').on(session.token),
}

export const accountIndexes = {
  userIdIdx: index('account_user_id_idx').on(account.userId),
  providerIdx: index('account_provider_idx').on(account.providerId),
}

export const verificationIndexes = {
  identifierIdx: index('verification_identifier_idx').on(
    verification.identifier,
  ),
}

// Export the complete schema
export const schema = {
  user,
  session,
  account,
  verification,
  // Indexes
  sessionIndexes,
  accountIndexes,
  verificationIndexes,
}
