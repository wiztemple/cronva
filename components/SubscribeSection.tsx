'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SubscribeButtons } from './SubscribeButtons'
import { PlatformBrandIcon } from './PlatformBrandIcon'

interface Props {
  calendarId: string
  calendarName: string
  calendarSlug: string
  baseUrl: string
  isSubscribed: boolean
  pickable?: boolean
  selectedExternalIds?: string[]
}

export function SubscribeSection({
  calendarId,
  calendarName,
  calendarSlug,
  baseUrl,
  isSubscribed: initialSubscribed,
  pickable = false,
  selectedExternalIds,
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
          {pickable ? 'Add to your calendar' : 'Subscribe to this calendar'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-fog)', marginBottom: 20 }}>
          {pickable
            ? selectedExternalIds && selectedExternalIds.length > 0
              ? `${selectedExternalIds.length} event${selectedExternalIds.length !== 1 ? 's' : ''} selected — only these will be added.`
              : 'Tick specific events on the left, or add the full calendar below.'
            : 'Fixtures auto-sync to your calendar app. Updates happen automatically.'}
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

        <SubscribeButtons
          slug={calendarSlug}
          baseUrl={baseUrl}
          selectedExternalIds={
            pickable && selectedExternalIds && selectedExternalIds.length > 0
              ? selectedExternalIds
              : undefined
          }
        />

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
  return <PlatformBrandIcon platform="whatsapp" size={18} />
}

