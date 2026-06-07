'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export function useSyncState(slug: string): [boolean, () => void, () => void] {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [synced, setSynced] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      setSynced(false)
      return
    }

    let cancelled = false
    fetch(`/api/subscribe?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : { subscribed: false }))
      .then((data: { subscribed?: boolean }) => {
        if (!cancelled) setSynced(Boolean(data.subscribed))
      })
      .catch(() => {
        if (!cancelled) setSynced(false)
      })

    return () => {
      cancelled = true
    }
  }, [session?.user, slug, status])

  const redirectToLogin = useCallback(() => {
    const callbackUrl = encodeURIComponent(pathname || '/')
    router.push(`/login?callbackUrl=${callbackUrl}`)
  }, [pathname, router])

  const sync = useCallback(() => {
    if (loading) return
    if (!session?.user) {
      redirectToLogin()
      return
    }

    setLoading(true)
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
      .then((res) => {
        if (res.status === 401) {
          redirectToLogin()
          return
        }
        if (res.ok) setSynced(true)
      })
      .finally(() => setLoading(false))
  }, [loading, redirectToLogin, session?.user, slug])

  const unsync = useCallback(() => {
    if (!session?.user || loading) return

    setLoading(true)
    fetch('/api/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
      .then((res) => {
        if (res.ok) setSynced(false)
      })
      .finally(() => setLoading(false))
  }, [loading, session?.user, slug])

  return [synced, sync, unsync]
}
