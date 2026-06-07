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
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '0.5px solid var(--color-border)',
        overflowX: 'auto',
      }}
      className="scroll-row"
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 32px',
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
              className={`category-pill${isActive ? ' active' : ''}`}
            >
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
