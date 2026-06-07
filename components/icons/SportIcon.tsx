import type { TablerIcon } from '@tabler/icons-react'
import {
  IconBallFootball,
  IconBallBasketball,
  IconCar,
  IconMasksTheater,
  IconDeviceTv,
  IconActivity,
  IconBallTennis,
  IconMoon,
  IconMusic,
  IconCalendarEvent,
} from '@tabler/icons-react'

export type SportCategory =
  | 'football'
  | 'basketball'
  | 'f1'
  | 'entertainment'
  | 'tv'
  | 'boxing'
  | 'tennis'
  | 'islamic'
  | 'music'
  | string

interface SportIconProps {
  category: SportCategory
  size?: number
  color?: string
  stroke?: number
}

const ICONS: Record<string, TablerIcon> = {
  football: IconBallFootball,
  basketball: IconBallBasketball,
  f1: IconCar,
  entertainment: IconMasksTheater,
  tv: IconDeviceTv,
  boxing: IconActivity,
  tennis: IconBallTennis,
  islamic: IconMoon,
  music: IconMusic,
}

export function SportIcon({
  category,
  size = 18,
  color = 'var(--color-navy)',
  stroke = 1.5,
}: SportIconProps) {
  const Icon = ICONS[category] ?? IconCalendarEvent
  return <Icon size={size} color={color} stroke={stroke} />
}
