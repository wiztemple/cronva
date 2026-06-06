import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0D1B2E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(74,159,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,159,232,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo mark */}
        <div style={{ position: 'relative', marginBottom: 32, display: 'flex' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              background: '#1A3F6F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                border: '3px solid rgba(255,255,255,0.85)',
                borderRadius: 4,
                transform: 'rotate(45deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 34,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#F5C400',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 34,
                left: 8,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#4A9FE8',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 34,
                right: 8,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#4A9FE8',
              }}
            />
          </div>
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: '#F7F8F8',
            letterSpacing: '-2px',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          Cronva
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#8A8F98',
            letterSpacing: '-0.5px',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          Time, delivered.
        </div>

        {/* Pill tags */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['EPL', 'Champions League', 'Formula 1', 'NBA', 'BBNaija'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 18px',
                borderRadius: 9999,
                border: '1px solid rgba(74,159,232,0.4)',
                color: '#4A9FE8',
                fontSize: 16,
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
