/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={card}>
          <Text style={brand}>PLAN B ASIA</Text>
          <Text style={tagline}>The Sovereign OS</Text>
          <Hr style={rule} />
          <Heading style={h1}>Confirm reauthentication</Heading>
          <Text style={text}>
            Use the code below to confirm your identity:
          </Text>
          <Section style={{ textAlign: 'center' as const, margin: '32px 0' }}>
            <Text style={codeStyle}>{token}</Text>
          </Section>
          <Text style={footer}>
            This code will expire shortly. If you did not request this, you may
            safely disregard this message.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', margin: 0, padding: '40px 0' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '0 20px' }
const card = { backgroundColor: '#f5f1e8', padding: '48px 40px', borderRadius: '4px', border: '1px solid #e8e0d0' }
const brand = { fontFamily: 'Arial, sans-serif', fontSize: '11px', letterSpacing: '0.3em', color: '#15402F', margin: '0 0 4px', fontWeight: 'bold' as const }
const tagline = { fontFamily: 'Georgia, serif', fontSize: '13px', fontStyle: 'italic' as const, color: '#7a7363', margin: '0 0 20px' }
const rule = { borderColor: '#c9b88a', borderWidth: '0.5px', margin: '0 0 32px' }
const h1 = { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '26px', fontWeight: 400 as const, color: '#15402F', margin: '0 0 20px', lineHeight: '1.3' }
const text = { fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#3d3d3d', lineHeight: '1.6', margin: '0 0 20px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '32px', fontWeight: 'bold' as const, color: '#15402F', letterSpacing: '0.3em', margin: '0', padding: '16px 24px', backgroundColor: '#ffffff', border: '1px solid #c9b88a', borderRadius: '4px', display: 'inline-block' }
const footer = { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#8a8275', margin: '32px 0 0', lineHeight: '1.5' }
