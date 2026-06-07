import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardPageClient } from '@/components/DashboardPageClient'
import { getUserDashboardCalendars } from '@/lib/calendars.server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const calendars = await getUserDashboardCalendars(session.user.id)

  return (
    <DashboardPageClient
      calendars={calendars}
      userName={session.user.name}
      userImage={session.user.image}
    />
  )
}
