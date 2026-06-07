'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  visible: boolean
  message?: string
}

export function Toast({ visible, message = 'Added to your calendar ✓' }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
    } else {
      const t = setTimeout(() => setShow(false), 200)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        zIndex: 1000,
        pointerEvents: 'none',
        transition: 'opacity 200ms ease, transform 200ms ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        display: show ? 'block' : 'none',
      }}
    >
      <div
        style={{
          background: 'var(--color-navy)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          padding: '12px 18px',
          borderRadius: 10,
          whiteSpace: 'nowrap',
        }}
      >
        {message}
      </div>
    </div>
  )
}
