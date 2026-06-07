import type { TablerIcon } from '@tabler/icons-react'
import {
  IconLayoutGrid,
  IconTrendingUp,
  IconSearch,
  IconUser,
} from '@tabler/icons-react'

export type NavTab = 'browse' | 'trending' | 'search' | 'account'

interface NavIconProps {
  tab: NavTab
  size?: number
  color?: string
  stroke?: number
}

const ICONS: Record<NavTab, TablerIcon> = {
  browse: IconLayoutGrid,
  trending: IconTrendingUp,
  search: IconSearch,
  account: IconUser,
}

export function NavIcon({
  tab,
  size = 20,
  color = 'currentColor',
  stroke = 1.5,
}: NavIconProps) {
  const Icon = ICONS[tab]
  return <Icon size={size} color={color} stroke={stroke} />
}
