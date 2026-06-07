'use client'

const TABS = ['All', 'Football', 'Basketball', 'Formula 1', 'Entertainment', 'Nigerian', 'Boxing', 'Music'] as const

export type CategoryTab = (typeof TABS)[number]

interface CategoryFilterProps {
  active: CategoryTab
  onChange: (tab: CategoryTab) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 56,
        zIndex: 90,
        background: '#fff',
        borderBottom: '0.5px solid var(--color-border)',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 0,
          padding: '0 32px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              style={{
                fontSize: 13,
                padding: '12px 16px',
                color: isActive ? 'var(--color-navy)' : 'var(--color-fog)',
                fontWeight: isActive ? 500 : 400,
                borderBottom: `2px solid ${isActive ? 'var(--color-navy)' : 'transparent'}`,
                marginBottom: -0.5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: 'none',
                border: 'none',
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: isActive ? 'var(--color-navy)' : 'transparent',
                transition: 'color 120ms',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--color-navy)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--color-fog)'
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
