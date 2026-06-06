import { prisma } from '@/lib/db/client'
import { RequestForm } from '@/components/RequestForm'
import { RequestList } from '@/components/RequestList'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Request a Calendar',
  description: "Don't see your league or event? Request it and the community can upvote.",
}

export default async function RequestPage() {
  const topRequests = await prisma.calendarRequest.findMany({
    orderBy: { votes: 'desc' },
    take: 10,
  })

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ paddingTop: 64, paddingBottom: 48 }}>
        <h1
          style={{
            fontWeight: 500,
            fontSize: '32px',
            letterSpacing: '-0.384px',
            color: 'var(--color-navy)',
            marginBottom: 8,
          }}
        >
          Request a calendar
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-fog)', lineHeight: 1.6 }}>
          Don't see your league, tournament, or event? Submit a request and the community can
          upvote it to help us prioritise.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'start',
          marginBottom: 80,
        }}
        className="request-grid"
      >
        {/* Submit form */}
        <RequestForm />

        {/* Top requests */}
        <div>
          <h2
            style={{
              fontWeight: 500,
              fontSize: '16px',
              color: 'var(--color-navy)',
              marginBottom: 20,
            }}
          >
            Most requested
          </h2>
          <RequestList
            initialRequests={topRequests.map((r) => ({
              id: r.id,
              calendarName: r.calendarName,
              category: r.category,
              votes: r.votes,
            }))}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .request-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
