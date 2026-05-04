# Data Migration Plan

ClearWater is starting the mock-data to database migration carefully.

## Current Step

Customers, Sites, and Pools now have a data access layer:

- `src/features/customers/data/customers.ts`
- `src/features/properties/data/sites.ts`
- `src/features/pools/data/pools.ts`

The app pages for customers, properties/sites, and pools call these functions instead of importing those records directly from `src/lib/mock-data.ts`.

## Current Behaviour

The UI still uses mock fallback data.

`CLEARWATER_DATA_SOURCE` defaults to `mock`. Even when the schema exists, pages should keep working without a local PostgreSQL database.

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
7. Check `/api/health/database`.
8. Implement Drizzle queries in the database branches of the data access files.
9. Compare database results against mock data fields used by the UI.
10. Switch `CLEARWATER_DATA_SOURCE` to `database` in a safe development environment.
11. Only after review, migrate the next workflow.

Drizzle is configured in `drizzle.config.ts` with:

- Schema path: `./src/db/schema.ts`
- Migrations output folder: `./drizzle`
- Supported database URL variables: `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, and `POSTGRES_URL_NON_POOLING`

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
