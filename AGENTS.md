# ClearWater Codex Guide

ClearWater is a professional pool service management system for Outback Pool & Spa Services in Alice Springs, Australia.

It should combine pool-specific depth from PoolTrackr-style software with stronger field-service patterns inspired by ServiceM8, Skimmer, Pool Brain, Jobber, and Housecall Pro. Build toward a complete pool service operating system, not a simple job list.

## Working Principles

- Keep the app beginner-friendly: clear names, small files, and obvious boundaries.
- Use the reference repositories for architectural inspiration only. Do not copy code blindly.
- Keep pool-specific workflows first-class: water testing, chemical dosing, service reports, equipment, recurring services, and technician mobile work.
- Design mobile and offline workflows with future Apple App Store and Google Play availability in mind.
- AI should assist, draft, explain, and recommend. It should not make final business decisions without review.
- Prefer incremental, typed changes with focused verification.
- Keep domain features in `src/features/<area>` and shared UI in `src/components`.
- Keep database tables in `src/db/schema.ts` until a module grows large enough to justify splitting.
- Use Tailwind utility classes for styling unless a shared component or token is clearly useful.
- Treat `docs/architecture.md`, `docs/product-requirements.md`, and `docs/roadmap.md` as living documents.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Drizzle ORM
- Auth.js through `next-auth`
- Vercel deployment
- React Big Calendar
- TanStack Table
- GraphHopper-inspired routing provider boundary

## Before Changing Code

- Read the nearby file and the matching docs section first.
- Preserve existing user changes.
- Add or update docs when a change alters product scope, architecture, or setup.
- Run `npm run lint` and `npm run build` when the change affects application code.
