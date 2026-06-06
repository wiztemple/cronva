'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SubscribeButtons } from './SubscribeButtons'

interface Props {
  calendarId: string
  calendarName: string
  calendarSlug: string
  baseUrl: string
  isSubscribed: boolean
}

export function SubscribeSection({
  calendarId,
  calendarName,
  calendarSlug,
  baseUrl,
  isSubscribed: initialSubscribed,
}: Props) {
  const { data: session } = useSession()
  const [subscribed, setSubscribed] = useState(initialSubscribed)
  const [loading, setLoading] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)

  async function handleSubscribe() {
    if (!session) {
      setShowSignInModal(true)
      return
    }
    setLoading(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId }),
      })
      setSubscribed(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleUnsubscribe() {
    setLoading(true)
    try {
      await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId }),
      })
      setSubscribed(false)
    } finally {
      setLoading(false)
    }
  }

  const pageUrl = `${baseUrl}/cal/${calendarSlug}`
  const waText = encodeURIComponent(
    `Check out the ${calendarName} calendar on Cronva — sync fixtures to your phone automatically 📅\n\n${pageUrl}`
  )

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${waText}`, '_blank', 'noopener,noreferrer')
    fetch('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calendarId, platform: 'whatsapp' }),
    }).catch(() => {})
  }

  return (
    <>
      <div
        style={{
          background: '#ffffff',
          border: '0.5px solid rgba(26,63,111,0.15)',
          borderRadius: 12,
          padding: '20px 24px',
        }}
      >
        <h2 style={{ fontWeight: 500, fontSize: '15px', color: 'var(--color-navy)', marginBottom: 6 }}>
          Subscribe to this calendar
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-fog)', marginBottom: 20 }}>
          Fixtures auto-sync to your calendar app. Updates happen automatically.
        </p>

        {session ? (
          subscribed ? (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: 'var(--color-sky)', marginBottom: 8 }}>
                <span style={{ color: 'var(--color-blue)', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-blue)' }}>Subscribed</span>
              </div>
              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                style={{ fontSize: '12px', color: 'var(--color-fog)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', opacity: loading ? 0.5 : 1 }}
              >
                Unsubscribe
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 16, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving…' : 'Save to my calendars'}
            </button>
          )
        ) : (
          <button
            onClick={handleSubscribe}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
          >
            Save to my calendars
          </button>
        )}

        <SubscribeButtons slug={calendarSlug} baseUrl={baseUrl} />

        <button
          onClick={handleWhatsApp}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '10px 16px', borderRadius: 9999,
            border: '1px solid rgba(37,211,102,0.5)', background: 'transparent',
            color: '#128C7E', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginTop: 10,
          }}
        >
          <WhatsAppIcon />
          Share on WhatsApp
        </button>
      </div>

      {showSignInModal && (
        <div
          onClick={() => setShowSignInModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,46,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#ffffff', borderRadius: 16, padding: '32px 28px', maxWidth: 360, width: '100%', textAlign: 'center' }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <h3 style={{ fontWeight: 500, fontSize: '18px', color: 'var(--color-navy)', marginBottom: 8 }}>
              Sign in to save your calendars
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-fog)', marginBottom: 24, lineHeight: 1.6 }}>
              Create a free account to save subscriptions and get weekly fixture updates.
              iCal links always work without an account.
            </p>
            <a href="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}>
              Sign in / Create account
            </a>
            <button
              onClick={() => setShowSignInModal(false)}
              style={{ fontSize: '13px', color: 'var(--color-fog)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
