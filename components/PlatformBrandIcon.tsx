import Image from 'next/image'
import { PLATFORM_BRAND_LOGOS } from '@/lib/brand-logos'
import { PlatformIcon, type Platform } from './icons/PlatformIcon'

interface PlatformBrandIconProps {
  platform: Platform
  size?: number
  color?: string
}

/** Renders /public/brand platform logos when available; falls back to Tabler icons. */
export function PlatformBrandIcon({
  platform,
  size = 18,
  color = 'var(--color-navy)',
}: PlatformBrandIconProps) {
  const src = PLATFORM_BRAND_LOGOS[platform]
  if (!src) {
    return <PlatformIcon platform={platform} size={size} color={color} />
  }

  // WhatsApp asset is a full wordmark — crop to the bubble icon on the left
  const isWhatsAppWordmark = platform === 'whatsapp'

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: isWhatsAppWordmark ? 'cover' : 'contain',
        objectPosition: isWhatsAppWordmark ? 'left center' : 'center',
      }}
    />
  )
}
