import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { reactStartCookies } from 'better-auth/react-start'
import React from 'react'
import { resend } from '../resend'
import WelcomeEmail from '@/lib/email/templates/WelcomeEmail'
import { getBindings } from '@/utils/bindings'
import { getDBClient } from '@/lib/db'

const db = await getDBClient()

export const auth = betterAuth({
  secret: getBindings().BETTER_AUTH_SECRET,
  url: getBindings().BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token: _token }, _request) => {
      console.log('Sending verification email to', user.email)
      const response = await resend.emails.send({
        from: getBindings().RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Verify your email to get started',
        react: React.createElement(WelcomeEmail, {
          name: user.name ?? 'there',
          verificationUrl: url,
        }),
      })
      console.log('Verification email sent to', user.email, response)
    },
  },

  telemetry: {
    enabled: false,
  },
  plugins: [reactStartCookies()],
})
