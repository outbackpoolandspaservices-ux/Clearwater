# Data Migration Plan

ClearWater is starting the mock-data to database migration carefully.

## Current Step

Customers, Sites, and Pools now have a data access layer:

- `src/features/customers/data/customers.ts`
- `src/features/properties/data/sites.ts`
- `src/features/pools/data/pools.ts`

The app pages for customers, properties/sites, and pools call these functions instead of importing those records directly from `src/lib/mock-data.ts`.

The first database-backed feature is Add Customer:

- Route: `/customers/new`
- Scope: customer contact details, customer type, billing address, communication preference, internal notes, and active/inactive status.
- Save path: server action in `src/features/customers/actions.ts`
- Database target: `customers` table through Drizzle.
- Safety: the form fails safely if no database URL is configured and does not expose database errors to users.
- Boundary: this creates a billing/customer profile only. Service sites/properties, pools, jobs, portal access, and accounting records remain separate workflows.

The next database-backed feature is Add Property/Site:

- Route: `/properties/new`
- Scope: customer link, site/property name, manual address entry, access instructions, gate code, pet warning, tenant details, owner/agent details, internal notes, status, and coordinate placeholders.
- Save path: server action in `src/features/properties/actions.ts`
- Database target: the current migrated `properties` table, or `sites` if a future migration adds it.
- Safety: inserts only columns that exist in the current database table and stores future-only fields in notes where needed.
- Boundary: this creates the service location only. Pools, jobs, routing, invoices, reports, and integrations remain separate workflows.

The next database-backed feature is Add Pool:

- Route: `/pools/new`
- Scope: property/site link, pool identity, environment, water source, construction, sanitiser/system details, target chemistry, and service notes.
- Save path: server action in `src/features/pools/actions.ts`
- Database target: the current migrated `pools` table.
- Safety: inserts only columns that exist in the current database table and stores future-only pool profile fields in notes/metadata where needed.
- Boundary: this creates the pool profile only. Jobs, equipment migration, water testing migration, routing, invoices, reports, Xero, payments, and AI remain separate workflows.

## Current Behaviour

The UI still uses mock fallback data when a database URL is missing or a scoped database query fails.

`CLEARWATER_DATA_SOURCE` defaults to `mock`. Even when the schema exists, pages should keep working without a local PostgreSQL database.

Customer, property/site, and pool creation can save to PostgreSQL while `CLEARWATER_DATA_SOURCE` remains `mock`. Customers, Properties/Sites, and Pools now attempt scoped PostgreSQL reads when a database URL is configured and fall back to mock records if those reads fail.

## Database-Ready Shape

The data functions are async and are structured so future work can replace the database branch with Drizzle queries:

- `getCustomers()`
- `getCustomerById()`
- `getSites()`
- `getSiteById()`
- `getSitesForCustomer()`
- `getPools()`
- `getPoolById()`
- `getPoolsForSite()`

## Future Steps

1. Add `DATABASE_URL` to `.env.local`, or use Vercel Postgres variables such as `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, or `POSTGRES_URL_NON_POOLING`.
2. Keep `CLEARWATER_DATA_SOURCE="mock"`.
3. Run `npm run db:check` to confirm a database URL is configured without revealing it.
4. Generate the database migration with `npm run db:generate`.
5. Apply the migration with `npm run db:migrate`.
6. Seed the first real records with `npm run db:seed`.
7. Verify safe table counts with `npm run db:verify`.
8. Check `/api/health/database`.
9. Review database-created customers, properties, and pools with the protected count endpoints or a safe database admin tool.
10. Compare database results against mock data fields used by the UI.
11. Keep `CLEARWATER_DATA_SOURCE="mock"` until broader workflow reads are intentionally migrated.
12. Only after review, migrate the next workflow.

Drizzle is configured in `drizzle.config.ts` with:

- Schema path: `./src/db/schema.ts`
- Migrations output folder: `./drizzle`
- Supported database URL variables: `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, and `POSTGRES_URL_NON_POOLING`

The first current-schema migration is `drizzle/0000_curvy_marvel_apes.sql`. Older generated migrations were replaced because they described an earlier schema and caused interactive Drizzle conflicts.

## Seed Foundation

Seed files live in `src/db/seed`.

Current seed scope:

- Organisation: Outback Pool & Spa Services.
- Users and roles: owner, dispatcher, technicians, finance, and customer portal user.
- Customers: Alice Springs Apartments, Flynn Drive Residence, Desert Springs Resort, and Eastside Family Pool.
- Sites: Flynn Drive, Gillen Rental, Larapinta Townhouse, Desert Springs Resort, and Eastside Family Pool.
- Pools: family pool, rental plunge pool, commercial spa, and Eastside pool.
- Equipment: pumps, filters, chlorinator, and heater examples.

The seed runner exits safely with a clear message if `DATABASE_URL` is not configured.

`npm run db:verify` prints safe table counts for the initial migration scope without exposing sensitive data:

- `organisations`
- `users`
- `roles`
- `user_roles`
- `customers`
- `sites`
- `pools`
- `equipment`

## One-Time Setup Route

The route `/api/admin/database/setup` can run the prepared migration and seed workflow after deployment.

Safety rules:

- Requires `CLEARWATER_SETUP_KEY`.
- Accepts the key in the `x-clearwater-setup-key` header, or as a `CLEARWATER_SETUP_KEY` / `setupKey` query parameter.
- Returns `401` when the key is missing or wrong.
- Uses `POST` for the actual setup run.
- Does not reveal database credentials.
- Keeps `CLEARWATER_DATA_SOURCE` unchanged, so the UI can remain in mock mode.

Expected JSON summary includes:

- migration status
- seed status
- safe table counts
- data source mode

Recommended after use:

1. Confirm `/api/health/database` reports connected.
2. Confirm the setup response includes non-zero counts for seeded tables.
3. Rotate or remove `CLEARWATER_SETUP_KEY` after the one-time setup has succeeded.
4. Keep `CLEARWATER_DATA_SOURCE="mock"` until the database query branches are reviewed.

## Testing A Real Database Connection

Use these checks before switching any UI to database mode:

1. In Vercel, open the project dashboard.
2. Go to Settings, then Environment Variables.
3. Confirm one of these variables exists: `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, or `POSTGRES_URL_NON_POOLING`.
4. Keep `CLEARWATER_DATA_SOURCE="mock"`.
5. Deploy or run locally with the same environment variables.
6. Open `/api/health/database`.
7. Open `/settings/database` for the friendly status page.
8. Run `npm run db:check`.
9. Run `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` only when the database URL is configured.

The database health endpoint reports whether a connection succeeds, but it never reveals the database URL or password.

## Not Migrated Yet

These still use mock data directly and should stay that way for now:

- Jobs
- Visits
- Water testing
- Chemical dosing
- Quotes
- Invoices
- Payments
- Reports
- Customer portal
- Routing
- AI
