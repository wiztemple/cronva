import type { BadgeVariant } from '@/lib/calendars'

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string; label: string }> = {
  live: { bg: '#F5C400', color: '#412402', label: 'Live' },
  active: { bg: '#F5C400', color: '#412402', label: 'Season active' },
  hot: { bg: '#EAF3DE', color: '#27500A', label: 'Most synced' },
  soon: { bg: '#E6F1FB', color: '#0C447C', label: 'Coming soon' },
  playoffs: { bg: '#E6F1FB', color: '#0C447C', label: 'Playoffs' },
}

interface BadgeProps {
  variant: BadgeVariant
  label?: string
}

export function Badge({ variant, label }: BadgeProps) {
  const style = VARIANT_STYLES[variant]
  const extraClass =
    variant === 'hot' ? ' badge-hot-pulse' : variant === 'live' ? ' live-pulse' : ''
  return (
    <span
      className={`text-badge${extraClass}`}
      style={{
        display: 'inline-block',
        background: style.bg,
        color: style.color,
        padding: '3px 9px',
        borderRadius: 9999,
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? style.label}
    </span>
  )
}
