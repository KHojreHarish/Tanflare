import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export interface WelcomeEmailProps {
  name?: string
  verificationUrl: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  name = 'there',
  verificationUrl,
}) => {
  const brandGradient = 'linear-gradient(90deg, #ff7a45, #ffd85c, #ff6b8a)'

  return (
    <Html>
      <Head />
      <Preview>Verify your email to get started</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#f6f7fb',
          color: '#0a0a0a',
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
        }}
      >
        <Container
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Top gradient bar */}
          <div
            style={{ height: 8, width: '100%', backgroundImage: brandGradient }}
          />

          <Section style={{ padding: '28px 28px 0 28px' }}>
            <Heading
              as="h1"
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: '28px',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: '#0a0a0a',
              }}
            >
              Welcome{name ? `, ${name}` : ''} 👋
            </Heading>
            <Text
              style={{
                margin: '10px 0 0 0',
                fontSize: 14,
                lineHeight: '22px',
                color: '#4a4a4a',
              }}
            >
              Thanks for joining. Please verify your email address to activate
              your account.
            </Text>
          </Section>

          <Section style={{ padding: 28, textAlign: 'center' }}>
            <a
              href={verificationUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                color: '#0a0a0a',
                backgroundImage: brandGradient,
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(255, 122, 69, 0.25)',
              }}
            >
              Verify Email
            </a>
          </Section>

          <Hr style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '0 28px' }} />

          <Section style={{ padding: 28 }}>
            <Text
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: '20px',
                color: '#6b7280',
              }}
            >
              If the button doesn't work, copy and paste this URL into your
              browser:
            </Text>
            <Text
              style={{
                margin: '6px 0 0 0',
                fontSize: 12,
                lineHeight: '20px',
                wordBreak: 'break-all',
              }}
            >
              <Link
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#ff7a45', textDecoration: 'underline' }}
              >
                {verificationUrl}
              </Link>
            </Text>
          </Section>

          <Section style={{ padding: '0 28px 28px 28px' }}>
            <Text
              style={{
                margin: 0,
                fontSize: 11,
                lineHeight: '18px',
                color: '#9ca3af',
                textAlign: 'center',
              }}
            >
              You’re receiving this email because it was requested by a sign up
              using this address. If you didn’t request it, you can safely
              ignore this email.
            </Text>
          </Section>
        </Container>

        <Section style={{ textAlign: 'center', padding: 16 }}>
          <Text style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
            © {new Date().getFullYear()} Tanflare
          </Text>
        </Section>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
