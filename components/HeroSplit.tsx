import type { ReactNode } from 'react'

interface HeroSplitProps {
  left: ReactNode
  right: ReactNode
}

export function HeroSplit({ left, right }: HeroSplitProps) {
  return (
    <section className="hero-split">
      {left}
      {right}
    </section>
  )
}
