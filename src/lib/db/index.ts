import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'
import { getBindings } from '@/utils/bindings'

// Database client for Cloudflare D1
// This creates a type-safe interface to interact with your database
export async function getDBClient() {
  const db = getBindings().DB
  if (!db) {
    throw new Error(
      'Database connection not available. Please check your D1 database configuration.',
    )
  }

  return drizzle(db, { schema })
}

// Type for the drizzle client
export type DrizzleClient = ReturnType<typeof getDBClient>

// Database exports (includes schemas, tables, and types)
export * from './schema'
