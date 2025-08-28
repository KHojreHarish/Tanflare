interface Env {
  // Environment variables
  NODE_ENV: string

  // D1 database binding
  DB: D1Database

  // API keys and secrets
  ANTHROPIC_API_KEY: string

  // KV namespaces (uncomment when needed)
  // CACHE: KVNamespace;

  // R2 storage (uncomment when needed)
  // STORAGE: R2Bucket;
}

export type { Env }
