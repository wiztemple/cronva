import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { MobileTabBar } from '@/components/MobileTabBar'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cronva — Time, delivered.',
    template: '%s | Cronva',
  },
  description:
    'Subscribe to sports and entertainment calendars — EPL, F1, NBA, movies, TV episodes, BBNaija and more. Auto-syncs to Google, Apple, or Outlook. No app required.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cronva.app'),
  openGraph: {
    title: 'Cronva — Time, delivered.',
    description: 'Sports and entertainment calendars that sync to any calendar app.',
    siteName: 'Cronva',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          {children}
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  )
}
