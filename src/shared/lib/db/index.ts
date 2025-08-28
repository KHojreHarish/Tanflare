import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'
import { getBindings } from '@/shared/utils/bindings'

// Database client for Cloudflare D1
// This creates a type-safe interface to interact with your database
export async function getDBClient() {
  const db = getBindings().DB
  console.log(db)
  if (!db) {
    throw new Error('DB not found')
  }

  return drizzle(db, { schema })
}

// Type for the drizzle client
export type DrizzleClient = ReturnType<typeof getDBClient>

// Database exports (includes schemas, tables, and types)
export * from './schema'
