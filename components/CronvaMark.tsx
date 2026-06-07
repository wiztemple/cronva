interface CronvaMarkProps {
  variant?: 'light' | 'dark'
  size?: number
}

export function CronvaMark({ variant = 'light', size = 20 }: CronvaMarkProps) {
  const stroke = variant === 'dark' ? 'white' : '#1A3F6F'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="2"
        width="16"
        height="16"
        rx="3"
        transform="rotate(45 12 10)"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="2" r="2.5" fill="#F5C400" />
      <circle cx="20" cy="10" r="1.8" fill="#4A9FE8" />
      <circle cx="4" cy="10" r="1.8" fill="#4A9FE8" />
    </svg>
  )
}
