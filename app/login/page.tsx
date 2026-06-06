'use client'

import { signIn } from 'next-auth/react'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CronvaLogo } from '@/components/CronvaLogo'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const verify = searchParams.get('verify') === '1'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn('resend', {
        email: email.trim(),
        redirect: false,
        callbackUrl,
      })
      if (result?.error) {
        setError('Could not send magic link. Please try again.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--color-offwhite)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#ffffff',
          border: '0.5px solid rgba(26,63,111,0.15)',
          borderRadius: 16,
          padding: '40px 36px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <CronvaLogo size={40} />
          </div>
          <h1
            style={{
              fontWeight: 500,
              fontSize: '22px',
              letterSpacing: '-0.3px',
              color: 'var(--color-navy)',
              marginBottom: 6,
            }}
          >
            Sign in to Cronva
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-fog)' }}>
            Save calendars and sync fixtures to your apps.
          </p>
        </div>

        {verify ? (
          // Magic link sent confirmation
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-sky)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
              }}
            >
              ✉️
            </div>
            <h2 style={{ fontWeight: 500, fontSize: '18px', color: 'var(--color-navy)', marginBottom: 8 }}>
              Check your email
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-fog)', lineHeight: 1.6 }}>
              A sign-in link has been sent. Click the link in the email to continue.
            </p>
          </div>
        ) : sent ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-sky)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
              }}
            >
              ✉️
            </div>
            <h2 style={{ fontWeight: 500, fontSize: '18px', color: 'var(--color-navy)', marginBottom: 8 }}>
              Magic link sent
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-fog)', lineHeight: 1.6 }}>
              We sent a sign-in link to <strong>{email}</strong>. Check your inbox.
            </p>
          </div>
        ) : (
          <>
            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '11px 20px',
                border: '1px solid rgba(26,63,111,0.2)',
                borderRadius: 8,
                background: '#ffffff',
                color: 'var(--color-navy)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: 20,
                transition: 'border-color 160ms ease, background 160ms ease',
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'rgba(26,63,111,0.1)' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(26,63,111,0.1)' }} />
            </div>

            {/* Email magic link */}
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                className="search-input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 12, padding: '10px 14px' }}
              />
              {error && (
                <p style={{ fontSize: '13px', color: '#EB5757', marginBottom: 10 }}>{error}</p>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          </>
        )}

        <p style={{ fontSize: '12px', color: 'var(--color-fog)', textAlign: 'center', marginTop: 24 }}>
          By signing in, you agree to receive fixture updates.
          <br />iCal feeds always work without an account.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
