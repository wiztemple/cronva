import Image from 'next/image'
import { SportIcon } from './icons/SportIcon'
import { resolveCalendarIconUrl } from '@/lib/brand-logos'

interface CalendarIconProps {
  slug: string
  iconCategory: string
  iconUrl?: string | null
  iconBg?: string
  size?: number
  logoHeight?: number
  sportIconSize?: number
}

export function CalendarIcon({
  slug,
  iconCategory,
  iconUrl,
  iconBg = '#fff',
  size = 40,
  logoHeight,
  sportIconSize = 18,
}: CalendarIconProps) {
  const src = resolveCalendarIconUrl(slug, iconUrl)
  const hasBrandLogo = Boolean(src)
  const inner = size - (hasBrandLogo ? 10 : 0)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: hasBrandLogo ? '#fff' : iconBg,
        border: hasBrandLogo ? '0.5px solid var(--color-border)' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: hasBrandLogo ? 5 : 0,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={inner}
          height={logoHeight ?? inner}
          style={{
            width: '100%',
            height: logoHeight ?? '100%',
            maxHeight: inner,
            objectFit: 'contain',
          }}
        />
      ) : (
        <SportIcon category={iconCategory} size={sportIconSize} />
      )}
    </div>
  )
}
