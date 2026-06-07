'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavIcon, type NavTab } from './icons/NavIcon'

const TABS: Array<{ href: string; label: string; tab: NavTab }> = [
  { href: '/', label: 'Browse', tab: 'browse' },
  { href: '/trending', label: 'Trending', tab: 'trending' },
  { href: '/search', label: 'Search', tab: 'search' },
  { href: '/dashboard', label: 'Account', tab: 'account' },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="mobile-tab-bar"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: '#fff',
        borderTop: '0.5px solid var(--color-border)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {TABS.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href)

          const color = isActive ? 'var(--color-navy)' : 'var(--color-fog)'

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                textDecoration: 'none',
                color,
                fontSize: 10,
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <NavIcon tab={tab.tab} size={20} color={color} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .mobile-tab-bar { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
