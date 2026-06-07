import { Badge } from './Badge'
import { TeamLogo } from './TeamLogo'
import { hasTeamBrandLogo, parseFixtureTeams } from '@/lib/brand-logos'
import type { Fixture } from '@/lib/fixtures'

interface FixtureRowProps {
  fixture: Fixture
  isLast?: boolean
}

function formatDateParts(date: Date) {
  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Africa/Lagos' }).format(date)
  const day = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'Africa/Lagos' }).format(date)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'Africa/Lagos' }).format(date)
  return { dayOfWeek, day, month }
}

export function FixtureRow({ fixture, isLast }: FixtureRowProps) {
  const { dayOfWeek, day, month } = formatDateParts(fixture.date)
  const teams = parseFixtureTeams(fixture.title)
  const showTeamLogos =
    teams !== null &&
    (hasTeamBrandLogo(teams.teamA) || hasTeamBrandLogo(teams.teamB))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 18px',
        borderBottom: isLast ? 'none' : '0.5px solid var(--color-border)',
        transition: 'background 120ms',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-offwhite)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ minWidth: 58, textAlign: 'center', flexShrink: 0 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-fog)',
            marginBottom: 2,
          }}
        >
          {dayOfWeek}
        </p>
        <p
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--color-navy)',
            letterSpacing: '-0.4px',
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          {day}
        </p>
        <p
          style={{
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-fog)',
          }}
        >
          {month}
        </p>
      </div>

      <div
        style={{
          width: 0.5,
          height: 30,
          background: 'var(--color-border)',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-navy)',
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {showTeamLogos && teams && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <TeamLogo team={teams.teamA} size={24} />
              <span style={{ color: 'var(--color-fog)', fontWeight: 400, fontSize: 11 }}>vs</span>
              <TeamLogo team={teams.teamB} size={24} />
            </span>
          )}
          <span>{fixture.title}</span>
          {fixture.badge && (
            <span style={{ marginLeft: 8 }}>
              <Badge variant={fixture.badge} />
            </span>
          )}
        </p>
        <p style={{ fontSize: 11, color: 'var(--color-fog)', margin: 0 }}>
          {fixture.competition} · {fixture.venue}
        </p>
      </div>

      <p
        style={{
          fontSize: 12,
          color: 'var(--color-fog)',
          textAlign: 'right',
          whiteSpace: 'nowrap',
          minWidth: 80,
          flexShrink: 0,
        }}
      >
        {fixture.time}
      </p>
    </div>
  )
}
