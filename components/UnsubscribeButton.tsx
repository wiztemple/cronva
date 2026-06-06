'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  calendarId: string
}

export function UnsubscribeButton({ calendarId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUnsubscribe(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Unsubscribe from this calendar?')) return
    setLoading(true)
    try {
      await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUnsubscribe}
      disabled={loading}
      title="Unsubscribe"
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: '1px solid rgba(235,87,87,0.4)',
        background: 'white',
        color: '#EB5757',
        fontSize: 14,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 0.5 : 1,
        transition: 'background 160ms',
      }}
    >
      ×
    </button>
  )
}
