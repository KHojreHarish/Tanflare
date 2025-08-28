import { defineConfig } from 'drizzle-kit'
import fs from 'fs'
import path from 'path'

const getLocalD1 = () => {
  const basePath = path.resolve(
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
  )
  try {
    const dbFile = fs.readdirSync(basePath).find((f) => f.endsWith('.sqlite'))
    if (dbFile) return path.join(basePath, dbFile)
  } catch {}

  // Fallback: create a local sqlite file for tooling
  const fallbackDir = path.resolve('.local')
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true })
  }
  const fallbackPath = path.join(fallbackDir, 'd1.sqlite')
  if (!fs.existsSync(fallbackPath)) {
    fs.writeFileSync(fallbackPath, '')
  }
  return fallbackPath
}

const db = defineConfig({
  out: './src/lib/db/migrations',
  schema: './src/lib/db/schema/*',
  dialect: 'sqlite',
  dbCredentials: {
    url: getLocalD1(),
  },
})

export default db
