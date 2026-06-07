'use client'

import Link from 'next/link'
import { useState } from 'react'
import { IconMenu2 } from '@tabler/icons-react'
import { CronvaMark } from './CronvaMark'

interface NavBarProps {
  authenticated?: boolean
  userName?: string
  userImage?: string | null
}

const NAV_LINKS = [
  { href: '/', label: 'Browse' },
  { href: '/trending', label: 'Trending' },
  { href: '/about', label: 'About' },
]

export function NavBar({ authenticated = false, userName, userImage }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        height: 56,
        background: '#fff',
        borderBottom: '0.5px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <CronvaMark size={20} />
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-navy)', letterSpacing: '-0.2px' }}>
            cronva
          </span>
        </Link>

        <nav className="nav-links-desktop">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13,
                color: 'var(--color-fog)',
                textDecoration: 'none',
                padding: '6px 12px',
                transition: 'color 120ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-navy)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-fog)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {authenticated ? (
            <Link
              href="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-navy)',
              }}
            >
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt=""
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-navy)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {(userName ?? 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="nav-sign-in-label">My calendars</span>
            </Link>
          ) : (
            <Link
              href="/login"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-navy)',
                border: '0.5px solid var(--color-navy)',
                padding: '6px 16px',
                borderRadius: 6,
                textDecoration: 'none',
                transition: 'background 120ms, color 120ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-navy)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--color-navy)'
              }}
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="nav-menu-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: 'var(--color-navy)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <IconMenu2 size={20} stroke={1.5} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="nav-menu-mobile"
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            background: '#fff',
            borderBottom: '0.5px solid var(--color-border)',
            padding: '12px 32px 20px',
            zIndex: 99,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontSize: 14,
                color: 'var(--color-navy)',
                textDecoration: 'none',
                padding: '10px 0',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

    </header>
  )
}
