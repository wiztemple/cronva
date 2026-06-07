import Image from 'next/image'
import { resolveTeamLogoUrl } from '@/lib/brand-logos'

interface TeamLogoProps {
  team: string
  size?: number
}

export function TeamLogo({ team, size = 26 }: TeamLogoProps) {
  const src = resolveTeamLogoUrl(team)
  if (!src) return null

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
        }}
      />
    </span>
  )
}
