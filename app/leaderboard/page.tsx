import { prisma } from '@/lib/db/client'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Top Cronva prediction makers — weekly and all-time accuracy rankings.',
}

async function getWeeklyLeaderboard() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const rows = await prisma.prediction.groupBy({
    by: ['userId'],
    where: { userId: { not: null }, createdAt: { gte: since } },
    _count: { id: true },
    _sum: { isCorrect: true } as never,
  })

  const userIds = rows.map((r) => r.userId).filter(Boolean) as string[]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  })
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]))

  return rows
    .map((r) => {
      const total = r._count.id
      const correct = (r as Record<string, unknown>)['_sum']
        ? ((r as Record<string, { isCorrect?: number }>)['_sum'].isCorrect ?? 0)
        : 0
      const accuracy = total > 0 ? Math.round((Number(correct) / total) * 100) : 0
      const user = r.userId ? userMap[r.userId] : null
      return { userId: r.userId, name: user?.name ?? 'Anonymous', image: user?.image, total, correct: Number(correct), accuracy }
    })
    .filter((r) => r.total >= 3)
    .sort((a, b) => b.correct - a.correct || b.accuracy - a.accuracy)
    .slice(0, 20)
}

async function getAllTimeLeaderboard() {
  const rows = await prisma.prediction.groupBy({
    by: ['userId'],
    where: { userId: { not: null } },
    _count: { id: true },
    _sum: { isCorrect: true } as never,
  })

  const userIds = rows.map((r) => r.userId).filter(Boolean) as string[]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  })
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]))

  return rows
    .map((r) => {
      const total = r._count.id
      const correct = (r as Record<string, { isCorrect?: number }>)['_sum']?.isCorrect ?? 0
      const accuracy = total > 0 ? Math.round((Number(correct) / total) * 100) : 0
      const user = r.userId ? userMap[r.userId] : null
      return { userId: r.userId, name: user?.name ?? 'Anonymous', image: user?.image, total, correct: Number(correct), accuracy }
    })
    .filter((r) => r.total >= 5)
    .sort((a, b) => b.correct - a.correct || b.accuracy - a.accuracy)
    .slice(0, 50)
}

function RankBadge({ rank }: { rank: number }) {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null
  return (
    <span
      style={{
        minWidth: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: medal ? 18 : 13, fontWeight: 500,
        color: rank <= 3 ? 'var(--color-navy)' : 'var(--color-fog)',
      }}
    >
      {medal ?? `#${rank}`}
    </span>
  )
}

type LeaderRow = {
  userId: string | null
  name: string
  image: string | null | undefined
  total: number
  correct: number
  accuracy: number
}

function Table({ rows }: { rows: LeaderRow[] }) {
  if (rows.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-fog)', fontSize: 14 }}>
        Not enough data yet — make predictions to appear here!
      </div>
    )
  }
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: '36px 1fr 80px 80px 80px',
          gap: 12, padding: '8px 12px',
          borderBottom: '1px solid rgba(26,63,111,0.1)',
          fontSize: 11, fontWeight: 500, color: 'var(--color-fog)',
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}
      >
        <span>#</span>
        <span>Player</span>
        <span style={{ textAlign: 'right' }}>Correct</span>
        <span style={{ textAlign: 'right' }}>Total</span>
        <span style={{ textAlign: 'right' }}>Accuracy</span>
      </div>

      {rows.map((row, i) => (
        <div
          key={row.userId ?? i}
          style={{
            display: 'grid', gridTemplateColumns: '36px 1fr 80px 80px 80px',
            gap: 12, padding: '12px 12px',
            borderBottom: '0.5px solid rgba(26,63,111,0.07)',
            alignItems: 'center',
          }}
        >
          <RankBadge rank={i + 1} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {row.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.image}
                alt=""
                width={28}
                height={28}
                style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--color-sky)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 500, color: 'var(--color-navy)', flexShrink: 0,
                }}
              >
                {(row.name ?? '?')[0].toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: i < 3 ? 500 : 400, color: 'var(--color-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row.name}
            </span>
          </div>
          <span style={{ textAlign: 'right', fontSize: 14, fontWeight: 500, color: 'var(--color-navy)' }}>
            {row.correct}
          </span>
          <span style={{ textAlign: 'right', fontSize: 13, color: 'var(--color-fog)' }}>
            {row.total}
          </span>
          <span style={{ textAlign: 'right', fontSize: 14, fontWeight: 500, color: row.accuracy >= 60 ? 'var(--color-blue)' : 'var(--color-navy)' }}>
            {row.accuracy}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default async function LeaderboardPage() {
  const [weekly, allTime] = await Promise.all([
    getWeeklyLeaderboard(),
    getAllTimeLeaderboard(),
  ])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <h1 style={{ fontWeight: 500, fontSize: 32, letterSpacing: '-0.384px', color: 'var(--color-navy)' }}>
            Leaderboard
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-fog)', marginBottom: 40 }}>
          Top predictors ranked by correct calls. Sign in to appear.
        </p>

        {/* Weekly */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span className="badge-live">This week</span>
            <h2 style={{ fontWeight: 500, fontSize: 18, color: 'var(--color-navy)' }}>
              Weekly rankings
            </h2>
            <span style={{ fontSize: 12, color: 'var(--color-fog)', marginLeft: 4 }}>
              — resets Monday 00:00 WAT
            </span>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid rgba(26,63,111,0.12)', borderRadius: 12, overflow: 'hidden' }}>
            <Table rows={weekly} />
          </div>
        </section>

        {/* All-time */}
        <section>
          <h2 style={{ fontWeight: 500, fontSize: 18, color: 'var(--color-navy)', marginBottom: 20 }}>
            All-time rankings
          </h2>
          <div style={{ background: '#fff', border: '0.5px solid rgba(26,63,111,0.12)', borderRadius: 12, overflow: 'hidden' }}>
            <Table rows={allTime} />
          </div>
        </section>
      </div>
    </div>
  )
}
