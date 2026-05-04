# Database Schema

ClearWater now has a Drizzle/PostgreSQL schema foundation in `src/db/schema.ts`.

The UI still uses `src/lib/mock-data.ts`. The schema is preparation for future real-data work and should be migrated into the app one workflow at a time.

## Current Scope

The schema includes practical first-pass tables for:

- `organisations`
- Auth.js tables: `users`, `accounts`, `sessions`, `verification_tokens`
- RBAC tables: `roles`, `permissions`, `user_roles`, `role_permissions`
- `customers`
- `sites`
- `pools`
- `equipment`
- `jobs`
- `visits`
- `recurring_jobs`
- `water_tests`
- `chemical_products`
- `stock`
- `stock_movements`
- `quotes`
- `quote_line_items`
- `invoices`
- `invoice_line_items`
- `payments`
- `reports`
- `attachments`
- `messages`
- `routes`
- `route_stops`
- `integrations`

## Design Notes

- `organisations` is the future multi-tenant boundary.
- Auth.js table names are preserved for the Drizzle adapter.
- `sites` represents properties/service locations.
- `visits` represents the actual technician visit for a job and stores timers and route order.
- `chemical_products`, `stock`, and `stock_movements` are ready for van stock and job usage.
- `routes` and `route_stops` are provider-neutral so GraphHopper or another provider can be added later.
- `integrations` stores provider connection planning records without connecting Xero, Stripe, SMS, email, GraphHopper, suppliers, or LaMotte yet.

## Migration Path

1. Keep mock UI working.
2. Generate migrations with `npm run db:generate`.
3. Apply migrations with `npm run db:migrate`.
4. Seed one organisation and a small demo dataset with `npm run db:seed`.
5. Move one workflow at a time from `src/lib/mock-data.ts` to typed database queries.
6. Add tests around each workflow before switching it fully to database data.

The first migration seam has been added for Customers, Sites, and Pools. See `docs/data-migration-plan.md`.

## Setup Safety

- `CLEARWATER_DATA_SOURCE` should stay set to `mock` until the database query branches are implemented and reviewed.
- `src/lib/mock-data.ts` remains the UI fallback.
- `src/db/connection.ts` provides helpers for optional and required database URLs.
- The seed script skips safely if `DATABASE_URL` is missing.
- The app checks `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, and `POSTGRES_URL_NON_POOLING` in that order.
- `drizzle.config.ts` uses the same database URL priority and writes migrations to `./drizzle`.
- `npm run db:check` prints whether a database URL is configured without revealing it.
- `npm run db:migrate` is wrapped by `src/db/run-migrate.ts` and skips safely if no database URL is configured.
- `npm run db:verify` prints safe table counts for the initial seed scope.
- `/api/health/database` can be used to test a real connection without exposing the URL.
- `/settings/database` provides a friendly setup checklist.

## Current Migration

The first current-schema migration is:

- `drizzle/0000_curvy_marvel_apes.sql`

It creates the ClearWater foundation tables while the UI remains in mock mode.

## Setup Route

`/api/admin/database/setup` is a protected operational route for running the prepared migration and seed workflow after deployment.

- It requires `CLEARWATER_SETUP_KEY`.
- It should be called with `POST`.
- It returns safe migration, seed, and table-count information.
- It does not switch `CLEARWATER_DATA_SOURCE` away from `mock`.
- Rotate or remove the setup key after successful setup.

Recommended first migrations:

- Customers, sites, and pools.
- Jobs and visits.
- Water tests and chemical products.
- Quotes, invoices, and payments.
- Reports and attachments.
