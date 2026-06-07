'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { calendarSyncHref } from '@/lib/calendar-sync'
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
  const [synced, , unsync] = useSyncState(slug)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const syncHref = calendarSyncHref(slug)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  function goToSyncPicker() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(syncHref)}`)
      return
    }
    router.push(syncHref)
    onSync?.()
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (synced) {
      setDropdownOpen((v) => !v)
      return
    }
    goToSyncPicker()
  }

  const fontSize = size === 'sm' ? 12 : 13
  const padding = size === 'sm' ? '5px 14px' : '7px 18px'

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleClick}
        className={`btn-sync${synced ? ' synced' : ''}`}
        style={{
          fontSize,
          padding,
          lineHeight: 1.4,
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDropdownOpen(false)
              goToSyncPicker()
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '11px 16px',
              fontSize: 13,
              color: 'var(--color-navy)',
              background: 'none',
              border: 'none',
              borderBottom: '0.5px solid var(--color-border)',
              cursor: 'pointer',
              textAlign: 'left',
              lineHeight: 1.4,
            }}
          >
            Pick events to sync
          </button>
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
