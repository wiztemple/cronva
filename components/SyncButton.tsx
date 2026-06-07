'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useSyncState } from '@/hooks/useSyncState'

interface SyncButtonProps {
  slug: string
  size?: 'sm' | 'md'
  label?: string
  onSync?: () => void
}

export function SyncButton({ slug, size = 'md', label, onSync }: SyncButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [synced, sync, unsync] = useSyncState(slug)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`)
      return
    }
    if (synced) {
      setDropdownOpen((v) => !v)
      return
    }
    sync()
    onSync?.()
  }

  const fontSize = size === 'sm' ? 12 : 13
  const padding = size === 'sm' ? '5px 14px' : '7px 18px'

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleClick}
        style={{
          fontSize,
          fontWeight: 500,
          padding,
          borderRadius: 9999,
          cursor: 'pointer',
          transition: 'background 120ms',
          whiteSpace: 'nowrap',
          lineHeight: 1.4,
          ...(synced
            ? { background: '#EAF3DE', color: '#27500A', border: '0.5px solid #B5D9A0' }
            : { background: 'var(--color-blue)', color: '#fff', border: '0.5px solid var(--color-blue)' }),
        }}
        onMouseEnter={(e) => {
          if (!synced) e.currentTarget.style.background = '#3A8FD8'
        }}
        onMouseLeave={(e) => {
          if (!synced) e.currentTarget.style.background = 'var(--color-blue)'
        }}
      >
        {synced ? 'Synced ✓' : (label ?? '+ Sync')}
      </button>

      {dropdownOpen && synced && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            background: '#fff',
            border: '0.5px solid var(--color-border)',
            borderRadius: 10,
            overflow: 'hidden',
            zIndex: 300,
            minWidth: 210,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              padding: '11px 16px',
              fontSize: 13,
              color: 'var(--color-navy)',
              borderBottom: '0.5px solid var(--color-border)',
              lineHeight: 1.4,
            }}
          >
            ✓ Synced to Google Calendar
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              unsync()
              setDropdownOpen(false)
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '11px 16px',
              fontSize: 13,
              color: '#C0392B',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              lineHeight: 1.4,
            }}
          >
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  )
}
