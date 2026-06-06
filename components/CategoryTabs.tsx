'use client'

import { useState } from 'react'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'f1', label: 'F1' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'tv', label: 'Movies & TV' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'local', label: 'Local' },
]

interface Props {
  onSelect: (value: string) => void
  initial?: string
}

export function CategoryTabs({ onSelect, initial = 'all' }: Props) {
  const [active, setActive] = useState(initial)

  function handleClick(value: string) {
    setActive(value)
    onSelect(value)
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.value}
          className={`category-tab${active === tab.value ? ' active' : ''}`}
          onClick={() => handleClick(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
