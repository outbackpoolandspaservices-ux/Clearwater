# Architecture

ClearWater is a modular Next.js application with domain-first folders and a shared foundation for auth, database access, tables, calendar scheduling, routing, reporting, chemistry, integrations, mobile workflows, and AI assistance.

## Application Shape

The user-facing recommended structure maps into this project under `src/` because the app was scaffolded with the Next.js `src` layout.

- `src/app` contains App Router routes and layouts.
- `src/app/(auth)` contains login and registration route foundations.
- `src/app/(app)` contains authenticated staff modules.
- `src/app/(portal)` contains customer portal modules.
- `src/app/api` contains API route foundations.
- `src/features` contains domain-specific logic, components, schemas, and actions as modules grow.
- `src/components` contains shared UI, layout, tables, calendar, forms, reports, and mobile components.
- `src/db` contains the active Drizzle connection and PostgreSQL schema.
- `src/lib` contains cross-cutting helpers for auth, RBAC, routing, integrations, notifications, reports, chemistry, AI, config, and utilities.
- `src/server` is reserved for shared server actions and database queries.
- `db`, `mobile`, and `tests` are reserved for future schema splitting, mobile app work, and test suites.

## Route Groups

- `(auth)`: login and registration.
- `(app)`: dashboard, dispatch, jobs, customers, properties, pools, equipment, water testing, chemicals, stock, quotes, invoices, reports, customer portal administration, routing, AI, integrations, settings, and users.
- `(portal)`: customer-facing portal, jobs, reports, quotes, and invoices.
- `api`: auth, jobs, customers, water tests, quotes, invoices, Xero, payments, routing, and AI.

## Data Layer

Drizzle ORM maps PostgreSQL tables in `src/db/schema.ts`. The current UI still reads from `src/lib/mock-data.ts`; the schema is prepared so future work can migrate one workflow at a time. The current schema includes:

- Auth.js tables: users, accounts, sessions, verification tokens.
- Organisation and RBAC tables: organisations, roles, permissions, user roles, and role permissions.
- Core business tables: customers, sites, pools, equipment, jobs, visits, recurring jobs, water tests, chemical products, stock, stock movements, quotes, quote line items, invoices, invoice line items, payments, reports, attachments, messages, routes, route stops, and integrations.
- Enums for roles, customer type, job status, job type, visits, recurrence, quote status, invoice status, payments, reports, attachments, messages, routing, integrations, and stock movements.

As modules grow, query logic should start close to each feature. Shared query functions belong in `src/server/queries`. Mutations shared by routes belong in `src/server/actions`.

## Auth And RBAC

Auth.js is configured in `src/auth.ts` and `src/lib/auth/config.ts`. The adapter is wired for Drizzle/PostgreSQL. Providers are intentionally empty in the scaffold so the business can choose email, Google, Microsoft, or another provider later.

Roles and placeholder permission helpers are scaffolded in `src/lib/rbac/roles.ts`: owner, admin, dispatcher, technician, customer, and finance. Route group access planning lives in `src/lib/auth/route-access.ts`, but real login enforcement is intentionally deferred so the mock-data demo remains reviewable.

## Dispatch And Calendar

Dispatch should use `react-big-calendar` for scheduling views and drag-and-drop patterns. Calendar UI belongs in `src/components/calendar`, and dispatch-specific behavior belongs in `src/features/dispatch`.

## Tables

Use TanStack Table for reusable typed grids. Shared table primitives belong in `src/components/tables`; feature-specific column definitions should stay inside the feature folder unless reused.

## Routing

Routing should use a provider adapter boundary under `src/lib/routing` or `src/lib/integrations`. GraphHopper is a routing concept reference, not code to copy. The dispatch calendar should not depend directly on a specific routing provider.

## Chemistry And Product Intelligence

Water chemistry interpretation and chemical dosing rules belong in `src/lib/chemistry`. The first implementation should focus on BioGuard Australian products, while keeping product and dosing rules flexible enough for Pool Pro and generic products later.

## Reports And Documents

Report components belong in `src/components/reports`; PDF generation helpers belong in `src/lib/reports`; report assets belong in `public/report-assets`. Documents and photos are represented in the schema through the `documents` table.

## Offline And Mobile

The first version is a mobile-friendly web app. Offline workflows should be designed with a future sync queue in mind. Mobile-specific components belong in `src/components/mobile`; future native or wrapper work can live under `mobile`.

## AI

AI should assist, draft, explain, and recommend, but final business decisions stay with users. AI code belongs in `src/features/ai` and `src/lib/ai`.

## Integrations

Integration adapters belong under `src/lib/integrations` and feature folders where appropriate. Planned integrations include Xero, payment provider, maps/routing, SMS, email, suppliers, and LaMotte SpinTouch.

## Deployment

The project is Vercel-ready. Production deployments need:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `NEXT_PUBLIC_APP_URL`

Database migrations should be generated with `npm run db:generate` and applied with `npm run db:migrate`.
