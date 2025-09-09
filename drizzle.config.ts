import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

const getLocalD1 = () => {
  const basePath = path.resolve(
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
  )
  const dbFile = fs.readdirSync(basePath).find((f) => f.endsWith('.sqlite'))
  if (!dbFile) throw new Error('No local D1 SQLite file found')
  // Return relative path starting with .wrangler/
  const relativePath = `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/${dbFile}`
  console.log('Generated URL path:', relativePath)
  return relativePath
}

const db = defineConfig({
  out: './src/lib/db/migrations',
  schema: './src/lib/db/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: getLocalD1(),
  },
})

export default db
