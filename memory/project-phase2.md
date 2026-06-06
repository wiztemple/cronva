---
name: project-phase2
description: Phase 2 features built — NextAuth, dashboard, subscribe flow, email, trending, request
metadata:
  type: project
---

Phase 2 is complete and running on localhost:4500.

**Why:** Auth, user subscriptions, email digests, and community request voting added on top of Phase 1 iCal engine.

**How to apply:** Do not re-add these features. Extend from what's here.

## What was built

- **Auth:** `auth.ts` (NextAuth v5 beta, JWT strategy), `app/api/auth/[...nextauth]/route.ts`, `proxy.ts` (replaces deprecated `middleware.ts` in Next.js 16)
- **Pages:** `/login`, `/dashboard` (protected), `/trending`, `/request`
- **APIs:** `/api/subscribe` (POST/DELETE), `/api/shares` (POST), `/api/requests` (GET/POST), `/api/requests/[id]/vote` (POST)
- **Email:** `lib/email/digest.ts` (weekly, Mon 06:00 UTC), `lib/email/alert.ts` (on fixture change), `lib/email/templates.ts` (HTML)
- **Components:** `SubscribeSection.tsx` (auth-aware subscribe + WhatsApp share + sign-in modal), `UnsubscribeButton.tsx`, `RequestForm.tsx`, `RequestList.tsx`, `Providers.tsx` (SessionProvider wrapper)
- **Favicons:** `app/icon.tsx` (32px), `app/apple-icon.tsx` (180px), `app/opengraph-image.tsx` (1200×630)

## Critical patterns

- `FormEvent` from React is deprecated in React 19 — use `{ preventDefault(): void }` inline
- `new Resend(key)` must be called inside functions, not at module top level (crashes if key missing)
- `middleware.ts` is deprecated in Next.js 16 — use `proxy.ts`
- IDE TS errors on Prisma map callbacks are stale cache artifacts — `tsc --noEmit` is authoritative
