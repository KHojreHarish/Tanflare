import { getDBClient } from '@/shared/lib/db'
import { getBindings } from '@/shared/utils/bindings'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { reactStartCookies } from 'better-auth/react-start'

const db = await getDBClient()

export const auth = betterAuth({
  secret: getBindings().BETTER_AUTH_SECRET,
  url: getBindings().BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: {
    enabled: true,
  },
  telemetry: {
    enabled: false,
  },
  plugins: [reactStartCookies()],
})
