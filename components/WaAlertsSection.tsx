'use client'

import { useState } from 'react'

interface Sub {
  calendarId: string
  calendarName: string
  waAlert: boolean
}

interface Props {
  initialPhone: string | null
  initialAlertsOn: boolean
  subscriptions: Sub[]
}

export function WaAlertsSection({ initialPhone, initialAlertsOn, subscriptions }: Props) {
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [alertsOn, setAlertsOn] = useState(initialAlertsOn)
  const [step, setStep] = useState<'idle' | 'otp' | 'verified'>(
    initialPhone ? 'verified' : 'idle'
  )
  const [otp, setOtp] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [error, setError] = useState('')
  const [subs, setSubs] = useState<Sub[]>(subscriptions)

  async function handleSendOtp() {
    if (!phone.trim()) return
    setSendLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wa/verify-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('otp')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP')
    } finally {
      setSendLoading(false)
    }
  }

  async function handleConfirmOtp() {
    setConfirmLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wa/verify-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('verified')
      setAlertsOn(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed')
    } finally {
      setConfirmLoading(false)
    }
  }

  async function toggleCalendarAlert(calendarId: string, enabled: boolean) {
    await fetch('/api/subscribe/wa-alert', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calendarId, enabled }),
    })
    setSubs((prev) =>
      prev.map((s) => (s.calendarId === calendarId ? { ...s, waAlert: enabled } : s))
    )
  }

  return (
    <section
      style={{
        background: '#ffffff',
        border: '0.5px solid rgba(26,63,111,0.1)',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontWeight: 500, fontSize: 15, color: 'var(--color-navy)' }}>
          WhatsApp match alerts
        </h2>
        {alertsOn && step === 'verified' && (
          <span
            style={{
              background: '#25D366', color: '#fff',
              fontSize: 10, fontWeight: 500, padding: '2px 7px',
              borderRadius: 9999, letterSpacing: '0.05em',
            }}
          >
            ON
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-fog)', marginBottom: 16 }}>
        Get a WhatsApp message 2 hours before kick-off for any calendar you enable below.
      </p>

      {step === 'verified' ? (
        <>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              background: 'var(--color-sky)', borderRadius: 8, marginBottom: 16,
              fontSize: 13,
            }}
          >
            <span style={{ color: '#25D366' }}>✓</span>
            <span style={{ color: 'var(--color-navy)', fontWeight: 500 }}>{phone}</span>
            <span style={{ color: 'var(--color-fog)' }}>verified</span>
            <button
              onClick={() => { setStep('idle'); setPhone('') }}
              style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-fog)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Change
            </button>
          </div>

          {subs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 12, color: 'var(--color-fog)', marginBottom: 4 }}>
                Enable alerts per calendar:
              </p>
              {subs.map((s) => (
                <label
                  key={s.calendarId}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, padding: '8px 12px', borderRadius: 8,
                    border: '0.5px solid rgba(26,63,111,0.1)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--color-navy)' }}>{s.calendarName}</span>
                  <input
                    type="checkbox"
                    checked={s.waAlert}
                    onChange={(e) => toggleCalendarAlert(s.calendarId, e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#25D366', cursor: 'pointer' }}
                  />
                </label>
              ))}
            </div>
          )}
        </>
      ) : step === 'otp' ? (
        <div style={{ maxWidth: 320 }}>
          <p style={{ fontSize: 13, color: 'var(--color-fog)', marginBottom: 10 }}>
            Enter the 6-digit code sent to {phone} on WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="search-input"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleConfirmOtp}
              disabled={otp.length !== 6 || confirmLoading}
              className="btn-primary"
              style={{ flexShrink: 0, opacity: confirmLoading ? 0.7 : 1 }}
            >
              {confirmLoading ? '…' : 'Verify'}
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#EB5757', marginTop: 6 }}>{error}</p>}
          <button
            onClick={() => setStep('idle')}
            style={{ fontSize: 12, color: 'var(--color-fog)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, textDecoration: 'underline' }}
          >
            ← Back
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 320 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="tel"
              className="search-input"
              placeholder="+2348012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSendOtp}
              disabled={!phone.trim() || sendLoading}
              className="btn-primary"
              style={{ flexShrink: 0, opacity: sendLoading ? 0.7 : 1 }}
            >
              {sendLoading ? '…' : 'Verify'}
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#EB5757', marginTop: 6 }}>{error}</p>}
          <p style={{ fontSize: 11, color: 'var(--color-fog)', marginTop: 6 }}>
            Enter your WhatsApp number with country code.
          </p>
        </div>
      )}
    </section>
  )
}
