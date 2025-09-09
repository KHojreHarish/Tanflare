import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PasswordResetEmailProps {
  userFirstName?: string
  resetUrl: string
  expiresIn?: string
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  userFirstName = 'there',
  resetUrl,
  expiresIn = '1 hour',
}) => {
  const previewText = `Reset your Tanflare password`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={logo}>Tanflare</Heading>
          </Section>

          <Heading style={h1}>Reset Your Password</Heading>

          <Text style={text}>Hi {userFirstName},</Text>

          <Text style={text}>
            We received a request to reset your password for your Tanflare
            account. If you didn't make this request, you can safely ignore this
            email.
          </Text>

          <Text style={text}>
            To reset your password, click the button below:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in {expiresIn}. If you need a new link, please
            request another password reset.
          </Text>

          <Text style={text}>
            For security reasons, this link can only be used once. If you have
            any questions or need assistance, please contact our support team.
          </Text>

          <Text style={text}>
            Best regards,
            <br />
            The Tanflare Team
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              If you didn't request a password reset, please ignore this email
              and ensure your account is secure.
            </Text>
            <Text style={footerText}>
              © 2024 Tanflare. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
}

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  textAlign: 'center' as const,
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const footer = {
  borderTop: '1px solid #e6e6e6',
  marginTop: '32px',
  paddingTop: '32px',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
}

export default PasswordResetEmail
