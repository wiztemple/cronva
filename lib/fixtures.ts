export interface Fixture {
  id: string
  title: string
  competition: string
  venue: string
  date: Date
  time: string
  badge?: 'live' | 'playoffs'
}

const FIXTURE_TEMPLATES: Record<string, Fixture[]> = {
  epl: [
    { id: '1', title: 'Arsenal vs Chelsea', competition: 'Premier League', venue: 'Emirates Stadium', date: new Date('2026-05-25T14:00:00'), time: '3:00pm WAT' },
    { id: '2', title: 'Liverpool vs Man City', competition: 'Premier League', venue: 'Anfield', date: new Date('2026-05-28T19:00:00'), time: '8:00pm WAT' },
    { id: '3', title: 'Man United vs Tottenham', competition: 'Premier League', venue: 'Old Trafford', date: new Date('2026-06-01T15:00:00'), time: '4:00pm WAT' },
    { id: '4', title: 'Newcastle vs Brighton', competition: 'Premier League', venue: "St James' Park", date: new Date('2026-06-04T14:00:00'), time: '3:00pm WAT' },
    { id: '5', title: 'West Ham vs Aston Villa', competition: 'Premier League', venue: 'London Stadium', date: new Date('2026-06-07T16:30:00'), time: '5:30pm WAT' },
    { id: '6', title: 'Fulham vs Brentford', competition: 'Premier League', venue: 'Craven Cottage', date: new Date('2026-06-10T14:00:00'), time: '3:00pm WAT' },
    { id: '7', title: 'Crystal Palace vs Wolves', competition: 'Premier League', venue: 'Selhurst Park', date: new Date('2026-06-14T14:00:00'), time: '3:00pm WAT' },
    { id: '8', title: 'Everton vs Bournemouth', competition: 'Premier League', venue: 'Goodison Park', date: new Date('2026-06-17T14:00:00'), time: '3:00pm WAT' },
    { id: '9', title: 'Nottm Forest vs Leeds', competition: 'Premier League', venue: 'City Ground', date: new Date('2026-06-21T14:00:00'), time: '3:00pm WAT' },
    { id: '10', title: 'Burnley vs Sheff Utd', competition: 'Premier League', venue: 'Turf Moor', date: new Date('2026-06-24T14:00:00'), time: '3:00pm WAT' },
    { id: '11', title: 'Luton vs Ipswich', competition: 'Premier League', venue: 'Kenilworth Road', date: new Date('2026-06-28T14:00:00'), time: '3:00pm WAT' },
    { id: '12', title: 'Arsenal vs Man United', competition: 'Premier League', venue: 'Emirates Stadium', date: new Date('2026-07-02T16:30:00'), time: '5:30pm WAT' },
  ],
  'champions-league': [
    { id: '1', title: 'Real Madrid vs Dortmund', competition: 'Champions League', venue: 'Santiago Bernabéu', date: new Date('2026-06-07T19:00:00'), time: '8:00pm WAT', badge: 'live' },
    { id: '2', title: 'Bayern vs PSG', competition: 'Champions League', venue: 'Allianz Arena', date: new Date('2026-06-10T19:00:00'), time: '8:00pm WAT' },
    { id: '3', title: 'Barcelona vs Inter', competition: 'Champions League', venue: 'Camp Nou', date: new Date('2026-06-14T19:00:00'), time: '8:00pm WAT' },
    { id: '4', title: 'Man City vs Arsenal', competition: 'Champions League', venue: 'Etihad Stadium', date: new Date('2026-06-17T19:00:00'), time: '8:00pm WAT' },
    { id: '5', title: 'Liverpool vs Atletico', competition: 'Champions League', venue: 'Anfield', date: new Date('2026-06-21T19:00:00'), time: '8:00pm WAT' },
    { id: '6', title: 'Juventus vs Napoli', competition: 'Champions League', venue: 'Allianz Stadium', date: new Date('2026-06-24T19:00:00'), time: '8:00pm WAT' },
    { id: '7', title: 'AC Milan vs Porto', competition: 'Champions League', venue: 'San Siro', date: new Date('2026-06-28T19:00:00'), time: '8:00pm WAT' },
    { id: '8', title: 'Benfica vs Ajax', competition: 'Champions League', venue: 'Estádio da Luz', date: new Date('2026-07-02T19:00:00'), time: '8:00pm WAT' },
    { id: '9', title: 'Celtic vs Feyenoord', competition: 'Champions League', venue: 'Celtic Park', date: new Date('2026-07-05T19:00:00'), time: '8:00pm WAT' },
    { id: '10', title: 'Galatasaray vs Club Brugge', competition: 'Champions League', venue: 'RAMS Park', date: new Date('2026-07-08T19:00:00'), time: '8:00pm WAT' },
    { id: '11', title: 'Shakhtar vs Red Star', competition: 'Champions League', venue: 'Arena Lviv', date: new Date('2026-07-12T19:00:00'), time: '8:00pm WAT' },
    { id: '12', title: 'Young Boys vs Salzburg', competition: 'Champions League', venue: 'Wankdorf Stadium', date: new Date('2026-07-15T19:00:00'), time: '8:00pm WAT' },
  ],
  nba: [
    { id: '1', title: 'Celtics vs Knicks — Game 7', competition: 'NBA Playoffs', venue: 'TD Garden', date: new Date('2026-06-07T00:30:00'), time: '1:30am WAT', badge: 'playoffs' },
    { id: '2', title: 'Nuggets vs Timberwolves', competition: 'NBA Playoffs', venue: 'Ball Arena', date: new Date('2026-06-09T02:00:00'), time: '3:00am WAT', badge: 'playoffs' },
    { id: '3', title: 'Mavericks vs Thunder', competition: 'NBA Playoffs', venue: 'American Airlines Center', date: new Date('2026-06-11T01:30:00'), time: '2:30am WAT', badge: 'playoffs' },
    { id: '4', title: 'Pacers vs Bucks', competition: 'NBA Playoffs', venue: 'Gainbridge Fieldhouse', date: new Date('2026-06-13T00:00:00'), time: '1:00am WAT', badge: 'playoffs' },
    { id: '5', title: 'Lakers vs Warriors', competition: 'NBA Playoffs', venue: 'Crypto.com Arena', date: new Date('2026-06-15T03:30:00'), time: '4:30am WAT', badge: 'playoffs' },
    { id: '6', title: 'Heat vs 76ers', competition: 'NBA Playoffs', venue: 'Kaseya Center', date: new Date('2026-06-17T23:30:00'), time: '12:30am WAT', badge: 'playoffs' },
    { id: '7', title: 'Suns vs Clippers', competition: 'NBA Playoffs', venue: 'Footprint Center', date: new Date('2026-06-20T02:00:00'), time: '3:00am WAT', badge: 'playoffs' },
    { id: '8', title: 'Cavaliers vs Magic', competition: 'NBA Playoffs', venue: 'Rocket Mortgage FieldHouse', date: new Date('2026-06-22T23:00:00'), time: '12:00am WAT', badge: 'playoffs' },
    { id: '9', title: 'Pelicans vs Kings', competition: 'NBA Playoffs', venue: 'Smoothie King Center', date: new Date('2026-06-25T01:00:00'), time: '2:00am WAT', badge: 'playoffs' },
    { id: '10', title: 'Hawks vs Nets', competition: 'NBA Playoffs', venue: 'State Farm Arena', date: new Date('2026-06-28T00:30:00'), time: '1:30am WAT', badge: 'playoffs' },
  ],
}

const DEFAULT_FIXTURES: Fixture[] = [
  { id: '1', title: 'Upcoming fixture', competition: 'Season fixture', venue: 'TBC', date: new Date('2026-06-10T15:00:00'), time: '4:00pm WAT' },
  { id: '2', title: 'Matchday fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-06-14T15:00:00'), time: '4:00pm WAT' },
  { id: '3', title: 'Weekend fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-06-17T15:00:00'), time: '4:00pm WAT' },
  { id: '4', title: 'Midweek fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-06-21T19:00:00'), time: '8:00pm WAT' },
  { id: '5', title: 'Saturday fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-06-24T15:00:00'), time: '4:00pm WAT' },
  { id: '6', title: 'Sunday fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-06-28T16:30:00'), time: '5:30pm WAT' },
  { id: '7', title: 'Evening fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-07-02T19:00:00'), time: '8:00pm WAT' },
  { id: '8', title: 'Afternoon fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-07-05T15:00:00'), time: '4:00pm WAT' },
  { id: '9', title: 'Late fixture', competition: 'League match', venue: 'TBC', date: new Date('2026-07-08T20:00:00'), time: '9:00pm WAT' },
  { id: '10', title: 'Final fixture', competition: 'Season finale', venue: 'TBC', date: new Date('2026-07-12T15:00:00'), time: '4:00pm WAT' },
  { id: '11', title: 'Bonus fixture', competition: 'Special event', venue: 'TBC', date: new Date('2026-07-15T15:00:00'), time: '4:00pm WAT' },
  { id: '12', title: 'Extra fixture', competition: 'Special event', venue: 'TBC', date: new Date('2026-07-18T15:00:00'), time: '4:00pm WAT' },
]

export function getFixturesForCalendar(slug: string): Fixture[] {
  return FIXTURE_TEMPLATES[slug] ?? DEFAULT_FIXTURES
}
