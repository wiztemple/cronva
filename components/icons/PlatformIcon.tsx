import type { TablerIcon } from '@tabler/icons-react'
import {
  IconCalendarPlus,
  IconBrandApple,
  IconMail,
  IconLink,
  IconBrandWhatsapp,
} from '@tabler/icons-react'

export type Platform = 'google' | 'apple' | 'outlook' | 'copy' | 'whatsapp'

interface PlatformIconProps {
  platform: Platform
  size?: number
  color?: string
  stroke?: number
}

const ICONS: Record<Platform, TablerIcon> = {
  google: IconCalendarPlus,
  apple: IconBrandApple,
  outlook: IconMail,
  copy: IconLink,
  whatsapp: IconBrandWhatsapp,
}

export function PlatformIcon({
  platform,
  size = 18,
  color = 'var(--color-navy)',
  stroke = 1.5,
}: PlatformIconProps) {
  const Icon = ICONS[platform]
  return <Icon size={size} color={color} stroke={stroke} />
}
