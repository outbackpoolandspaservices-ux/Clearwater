# ClearWater

ClearWater is a professional pool service management system for Outback Pool & Spa Services in Alice Springs, Australia.

The goal is to combine pool-specific depth from products like PoolTrackr with stronger field-service features inspired by ServiceM8, Skimmer, Pool Brain, Jobber, and Housecall Pro. ClearWater is intended to become a complete pool service operating system for servicing, repairs, inspections, scheduling, technician workflows, water testing, chemical dosing, communication, quotes, invoices, payments, reporting, stock control, route planning, and AI-assisted decision making.

## Stack

- Next.js App Router
- TypeScript and React
- Tailwind CSS
- PostgreSQL
- Drizzle ORM
- Auth.js through `next-auth`
- Vercel deployment
- `react-big-calendar` for dispatch calendar work
- TanStack Table for reusable data grids
- GraphHopper-inspired routing adapter concepts

## Project Structure

This project uses Next.js with a `src` directory, so the recommended app structure lives under `src/app`.

```text
src/
  app/
    (auth)/
      login/
      register/
    (app)/
      dashboard/
      dispatch/
      jobs/
      customers/
      properties/
      pools/
      equipment/
      water-testing/
      chemicals/
      stock/
      quotes/
      invoices/
      reports/
      customer-portal/
      routing/
      ai/
      integrations/
      settings/
      users/
    (portal)/
      portal/
      portal/jobs/
      portal/reports/
      portal/quotes/
      portal/invoices/
    api/
      auth/
      jobs/
      customers/
      water-tests/
      quotes/
      invoices/
      xero/
      payments/
      routing/
      ai/
  components/
    ui/
    layout/
    forms/
    tables/
    calendar/
    reports/
    mobile/
  features/
  lib/
    mock-data.ts
  server/
  db/
db/
mobile/
tests/
docs/
```

## App Foundation

The first working app shell includes:

- Branded header for ClearWater and Outback Pool & Spa Services.
- Desktop sidebar navigation.
- Mobile collapsible menu and bottom navigation.
- Dashboard, jobs, dispatch, customers, properties/sites, pools, equipment, water testing, chemicals, stock, quotes, invoices, reports, customer portal, and settings pages.
- Demo dashboard data, quick actions, alerts, and page lists from `src/lib/mock-data.ts`.
- First mock-data business workflow for Customers, Properties/Sites, and Pools, including linked list and detail pages.
- First mock-data Jobs workflow, including searchable job list, filters, detail pages, workflow timeline, technician actions, and recurring job examples.
- Mock-data Dispatch Calendar and Technician Today workflows, including route-order placeholders, daily run actions, unscheduled jobs, recurring jobs, and mobile technician job cards.
- Mock-data Water Testing and Chemical Dosing workflows, including full chemistry readings, BioGuard Australia product examples, dosing recommendation placeholders, mobile entry fields, and future LaMotte SpinTouch Bluetooth sync structure.
- Mock-data Reports workflow, including report register filters, service report previews, inspection report previews, and placeholders for future PDF generation and customer sending.
- Mock-data Quotes, Invoices, Payments, and Xero planning workflows, including registers, detail previews, payment history, and placeholders for future Xero/payment gateway integrations.
- Mock-data Customer Portal foundation, including a selected customer dashboard, upcoming jobs, service history, water test reports, report access, quote approval placeholders, invoice/payment placeholders, and messaging/service request placeholders. Real customer authentication and payment processing will come later.
- Mock-data Stock, Chemicals, and Van Inventory foundation, including BioGuard Australia product examples, chemical detail pages, van stock levels, low-stock examples, job usage history, and mock profitability placeholders on linked jobs and invoices.
- Mock-data Routing and Route Optimisation foundation, including daily technician route plans, stop order, travel/service estimates, route comparison placeholders, technician mobile route view, dispatch route links, and a future GraphHopper/provider planning boundary.
- Authentication and database foundation, including a practical Drizzle/PostgreSQL schema, Auth.js adapter tables, organisation/RBAC planning, route access helpers, environment placeholders, and migration documentation.
- First safe database-backed workflows for Customers, Properties/Sites, and Pools. These pages now read through feature data access functions with mock fallback while `CLEARWATER_DATA_SOURCE` remains `mock`.
- Add Customer saves customer billing/contact records to PostgreSQL when a database URL is configured.
- Add Property/Site saves service location records to PostgreSQL when a database URL is configured. Address search is prepared for future Google Places autocomplete, with manual entry available now.
- Add Pool saves pool profile records to PostgreSQL when a database URL is configured. Detailed pool environment, water source, construction, system, and service-note fields are safely stored in pool notes/metadata until dedicated columns are migrated later.
- Add Job saves service visit/work-order records to PostgreSQL when a database URL is configured. Jobs link to customers, properties/sites, and pools, with practical scheduling, checklist, recurrence placeholder, and repair metadata stored safely in notes where dedicated columns are not available yet.

The app UI currently uses mock data only. The database schema and Auth.js structure are prepared, but pages have not been migrated to database queries and real login is not enforced yet. Future work should migrate one workflow at a time from `src/lib/mock-data.ts` to typed database access.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Set `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL`.
   Optional integration keys can stay blank until those integrations are implemented.

4. Run the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Database

Generate migrations:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Open Drizzle Studio:

```bash
npm run db:studio
```

Seed the first ClearWater demo records:

```bash
npm run db:seed
```

Database setup steps:

1. Add `DATABASE_URL` to `.env.local`, or use Vercel Postgres variables such as `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, or `POSTGRES_URL_NON_POOLING`.
2. Keep `CLEARWATER_DATA_SOURCE="mock"` while reviewing the current UI.
3. Run `npm run db:check` to confirm a database URL is configured without printing it.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate`.
6. Run `npm run db:seed`.
7. Run `npm run db:verify` to print safe table counts.
8. Check `/api/health/database`.
9. Switch `CLEARWATER_DATA_SOURCE` to `database` only after the data access functions have real Drizzle queries and the seeded records have been reviewed.

The seed currently prepares organisation, users/roles, customers, sites, pools, and equipment records. It does not migrate jobs, water testing, reports, invoices, routing, or portal data.

Database-backed Add Customer:

- Open `/customers/new` from the Customers page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this first write workflow.
- The form saves customer contact, billing address, communication preference, internal notes, type, and status to PostgreSQL.
- Billing/customer address is stored separately from future service site/property addresses. Sites and pools are not created by this form.
- If no database URL is configured, the form fails safely with a friendly message.
- After saving, ClearWater redirects back to `/customers`; the visible list remains mock-backed until database reads are enabled in a later migration step.
- Use `npm run db:verify` to confirm the safe customer table count without exposing database credentials.

Database-backed Add Property/Site:

- Open `/properties/new` from the Properties page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- The form links a property/site to an existing customer. It loads database customers when available and falls back to mock customers if needed.
- Manual address entry works now. Google Places autocomplete is planned for a later phase.
- The current migrated table stores core fields such as customer, name, street address, suburb, gate code, access notes, coordinates, pet warnings, and technician notes.
- Future address fields such as state, postcode, country, tenant details, and status are safely stored in notes where first-class columns are not available yet.
- `/properties` and `/properties/[siteId]` read from PostgreSQL when possible and fall back to mock data if the database is unavailable.
- `/api/admin/database/properties/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.

Database-backed Add Pool:

- Open `/pools/new` from the Pools page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- The form links a pool to an existing property/site. It loads database properties/sites when available and falls back to mock sites if needed. The selector can be searched by property/site name, customer, street address, suburb, notes, phone, or email.
- The current migrated `pools` table stores core fields such as property/site link, pool name, type, surface, volume, sanitiser, environment, targets, and notes where those columns exist.
- Future pool profile fields such as shape, use type, water source, exposure, construction condition, equipment system details, recurring issues, and preferences are safely stored in notes/metadata where first-class columns are not available yet.
- Water chemistry targets are no longer captured on the pool profile. Future water testing will calculate and display guide ranges from pool type, indoor/outdoor context, sanitiser system, chlorinator/equipment settings, surface type, water source, and water conditions.
- Salt level requirements will come from the selected chlorinator/equipment profile where available in a later equipment integration step.
- `/pools` and `/pools/[poolId]` read from PostgreSQL when possible and fall back to mock data if the database is unavailable.
- `/api/admin/database/pools/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.

Database-backed Jobs workflow:

- Open `/jobs/new` from the Jobs page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- `/jobs` and `/jobs/[jobId]` attempt PostgreSQL reads when a database URL is configured and fall back to mock jobs if the database is unavailable.
- The Add Job form searches and links customer, property/site, and pool records. Selecting a customer filters properties/sites; selecting a property/site filters pools.
- The current migrated `jobs` table stores core fields such as customer, property/site, title, status, schedule, assigned user where valid, and notes where those columns exist.
- Recurring jobs are captured as notes/placeholders only. A full recurring job engine is planned later.
- Water testing is planned as the next workflow and will link to jobs and pools. Dosing logic, Xero, payments, AI, reports, and invoices remain out of scope for this step.
- `/api/admin/database/jobs/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.

Database health checks:

- Open `/settings/database` for a friendly setup/status page.
- Open `/api/health/database` for safe JSON diagnostics.
- The app also accepts Vercel-style `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, or `POSTGRES_URL_NON_POOLING` if `DATABASE_URL` is not set.
- The health check never prints the database URL or password.
- Drizzle migrations are generated into the existing `drizzle/` folder.
- The first current-schema migration is `drizzle/0000_curvy_marvel_apes.sql`.

One-time database setup route:

- Set `CLEARWATER_SETUP_KEY` to a long random secret in Vercel or `.env.local`.
- Keep `CLEARWATER_DATA_SOURCE="mock"`.
- Send a `POST` request to `/api/admin/database/setup`.
- Provide the key in the `x-clearwater-setup-key` header, or as `CLEARWATER_SETUP_KEY` / `setupKey` query parameter.
- The route runs prepared Drizzle migrations and the initial seed only when authorised.
- It returns migration status, seed status, table counts, and data source mode without revealing credentials.

Example:

```bash
curl -X POST "https://your-clearwater-domain.example/api/admin/database/setup" \
  -H "x-clearwater-setup-key: your-long-random-setup-key"
```

## Documentation

- `AGENTS.md`: Codex development guide.
- `docs/reference-repos.md`: reference repository rules.
- `docs/architecture.md`: system structure and boundaries.
- `docs/database-schema.md`: planned PostgreSQL/Drizzle tables and migration path.
- `docs/authentication-and-permissions.md`: Auth.js and RBAC planning.
- `docs/data-migration-plan.md`: safe mock-data to database migration plan.
- `docs/product-requirements.md`: product goals, users, modules, and scope.
- `docs/roadmap.md`: phased implementation plan.

## Reference Repositories

The following repositories are architectural references only:

- `vercel/nextjs-postgres-auth-starter`
- `jquense/react-big-calendar`
- `TanStack/table`
- `graphhopper/graphhopper`

Do not copy code blindly from these repositories.
