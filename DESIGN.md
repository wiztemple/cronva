# Cronva — DESIGN.md
> Orbit navy command deck — gold apex node, electric blue signal channels

## Brand
Name: Cronva
Logo: diamond orbit mark — rotated square outline, concentric inner layers,
      gold circle at apex, electric blue nodes on left and right.
      Assets live in /public/brand/. Never rotate the mark. Gold node always at top.
Tagline: Time, delivered.

## Colour tokens — defined in globals.css as CSS custom properties
--color-navy:      #1A3F6F   /* primary brand, headings, icon fill */
--color-cosmos:    #0D1B2E   /* deepest surface, dashboard canvas */
--color-blue:      #4A9FE8   /* CTA buttons, active states, live sync nodes */
--color-gold:      #F5C400   /* ONLY: live badge + next match indicator. Never decorative */
--color-sky:       #E6F1FB   /* surface tints, card backgrounds */
--color-offwhite:  #F1EFE8   /* page background (light mode) */
--color-fog:       #8A8F98   /* secondary text, muted labels */
--color-snow:      #F7F8F8   /* primary text on dark surfaces */

## Typography
Font: Inter (Google Fonts) — weights 400, 500
Fallback: ui-sans-serif, system-ui
Code/IDs: JetBrains Mono — weight 400

Scale:
  Display hero:  64px / weight 400 / tracking -0.96px
  Heading:       32px / weight 500 / tracking -0.384px
  Subheading:    20px / weight 500 / tracking -0.2px
  Body:          16px / weight 400 / tracking 0
  Label:         13px / weight 400 / color var(--color-fog)
  Badge:         11px / weight 500 / letter-spacing 0.07em

## Spacing — 4px base grid
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px
Section gap: 80–96px. Card gap: 12px. Element gap: 8–12px.

## Border radius
Badges: 2px | Inputs/buttons: 6px | Cards: 12px | Pills: 9999px

## Components

Primary CTA button:
  bg #4A9FE8, text #F7F8F8, weight 500, 14px, padding 8px 20px, border-radius 6px
  One blue CTA per screen maximum. Never use gold for buttons.

Subscribe pill button:
  border 1px solid #4A9FE8, bg transparent, text #4A9FE8, border-radius 9999px,
  padding 6px 20px. Hover: bg #E6F1FB.

Calendar card (light):
  bg white, border 0.5px solid rgba(26,63,111,0.15), border-radius 12px,
  padding 20px 24px. Hover: border-color rgba(26,63,111,0.4), bg #F1EFE8.

Calendar card (dark dashboard):
  bg #0D1B2E, inset border 1px solid #1A3F6F, border-radius 12px, padding 20px 24px.

Gold live badge:
  bg #F5C400, text #412402, weight 500, 11px, letter-spacing 0.07em,
  padding 3px 10px, border-radius 9999px.
  Use ONLY for LIVE and NEXT MATCH states. Maximum one per card. Never decorative.

Category badge:
  bg #E6F1FB, text #1A3F6F, border-radius 2px, 11px, uppercase, letter-spacing 0.07em

Status dot:
  6px circle — #4A9FE8 upcoming | #F5C400 live | #8A8F98 TBD | #EB5757 cancelled

Nav bar:
  height 56px, bg white (light pages) / #0D1B2E (dark pages), padding 0 24px.
  Logo left, nav links center (#8A8F98 → #F7F8F8 on hover), auth actions right.

## Rules — do not break these
- Gold (#F5C400) is used ONLY for live/next-match indicators. Never buttons, never borders.
- Font weight caps at 500. Never use 600, 700, or bold beyond 500.
- Border-radius maximum 12px on cards. Pills are 9999px.
- Never place the navy mark on a dark background — use the white variant.
- Navy primary CTA is #4A9FE8 blue, not navy. Navy is for text and structure only.
- One primary CTA per screen. The CTA is always blue. Never two blue buttons competing.
- Mobile-first. Every page must be complete and polished at 375px viewport width.
- Light mode is the primary — dark mode is for the dashboard only.
