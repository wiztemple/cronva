'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { CronvaLogo } from './CronvaLogo'

export function Nav() {
  const router = useRouter()
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <nav className="nav">
      <div className="flex items-center gap-6 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" style={{ textDecoration: 'none' }}>
          <CronvaLogo size={28} />
          <span style={{ fontWeight: 500, fontSize: '16px', color: 'var(--color-navy)', letterSpacing: '-0.2px' }}>
            Cronva
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 hidden sm:block max-w-md">
          <input
            type="search"
            className="search-input"
            placeholder="Search calendars…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          <Link href="/trending" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-fog)', textDecoration: 'none' }}>
            Trending
          </Link>
          <Link href="/about" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-fog)', textDecoration: 'none' }}>
            About
          </Link>

          {session?.user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setAvatarMenuOpen((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 4px 4px 12px',
                  borderRadius: 9999,
                  border: '1px solid rgba(26,63,111,0.2)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-navy)',
                }}
              >
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.user.name?.split(' ')[0] ?? 'Account'}
                </span>
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    width={28}
                    height={28}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--color-navy)',
                      color: 'var(--color-snow)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >
                    {(session.user.name ?? session.user.email ?? '?')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {avatarMenuOpen && (
                <>
                  <div
                    onClick={() => setAvatarMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  />
                  <div
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
                      background: '#ffffff',
                      border: '0.5px solid rgba(26,63,111,0.15)',
                      borderRadius: 10, padding: '6px 0',
                      minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setAvatarMenuOpen(false)}
                      style={{ display: 'block', padding: '9px 16px', fontSize: '14px', color: 'var(--color-navy)', textDecoration: 'none' }}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/request"
                      onClick={() => setAvatarMenuOpen(false)}
                      style={{ display: 'block', padding: '9px 16px', fontSize: '14px', color: 'var(--color-navy)', textDecoration: 'none' }}
                    >
                      Request a calendar
                    </Link>
                    <div style={{ height: 1, background: 'rgba(26,63,111,0.08)', margin: '4px 0' }} />
                    <button
                      onClick={() => { setAvatarMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: '14px', color: 'var(--color-fog)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ fontSize: '13px', padding: '7px 16px' }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
