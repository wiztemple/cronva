const STEPS = [
  {
    number: '01',
    title: 'Pick a calendar',
    body: 'Search 47 free sports calendars — from EPL to Super Eagles to BBNaija. Every one is free, always.',
  },
  {
    number: '02',
    title: 'Tap sync once',
    body: 'One click adds it to Google Calendar, Apple Calendar, or Outlook. Nothing to install.',
  },
  {
    number: '03',
    title: 'Done forever',
    body: 'Every fixture, every reschedule, every new matchday — auto-updates in your calendar. You never check again.',
  },
]

const PLATFORMS = [
  { name: 'Google Calendar', emoji: '📅', color: '#E6F1FB' },
  { name: 'Apple Calendar', emoji: '🍎', color: '#F7F6F3' },
  { name: 'Outlook', emoji: '📧', color: '#E6F1FB' },
]

export function HowItWorks() {
  return (
    <section
      style={{
        background: 'var(--color-offwhite)',
        borderTop: '0.5px solid var(--color-border)',
        padding: '64px 32px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--color-navy)',
            marginBottom: 6,
            letterSpacing: '-0.3px',
          }}
        >
          How it works
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-fog)', marginBottom: 28 }}>
          Three steps. Sixty seconds. Then forget about it.
        </p>

        <div
          className="how-it-works-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                background: '#fff',
                border: '0.5px solid var(--color-border)',
                borderRadius: 14,
                padding: 28,
              }}
            >
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 400,
                  color: '#ECEAE4',
                  letterSpacing: '-1px',
                  marginBottom: 12,
                  lineHeight: 1,
                }}
              >
                {step.number}
              </p>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--color-navy)',
                  marginBottom: 8,
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-fog)', lineHeight: 1.65, margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Platform compatibility row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-fog)', fontWeight: 500 }}>
            Works with
          </span>
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                border: '0.5px solid var(--color-border)',
                borderRadius: 9999,
                padding: '6px 14px',
              }}
            >
              <span style={{ fontSize: 16 }}>{p.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-navy)' }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .how-it-works-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
