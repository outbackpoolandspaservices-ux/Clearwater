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
- Scope: property/site link, pool identity, searchable property/site selection, environment, water source, construction, sanitiser/system details, and service notes.
- Save path: server action in `src/features/pools/actions.ts`
- Database target: the current migrated `pools` table.
- Safety: inserts only columns that exist in the current database table and stores future-only pool profile fields in notes/metadata where needed.
- Chemistry boundary: Add Pool does not ask for target chemistry values. Future water testing should calculate/display guide ranges from pool type, indoor/outdoor context, sanitiser system, chlorinator/equipment settings, surface type, water source, and applicable salt/mineral/magnesium system details.
- Equipment boundary: salt level requirements should come from the selected chlorinator/equipment profile where available. The equipment integration for detailed chlorinator model/settings is planned later.

The next database-backed workflow is Jobs and Service Visits foundation:

- Routes: `/jobs`, `/jobs/[jobId]`, and `/jobs/new`
- Scope: job list/detail reads, Add Job form, customer/property/pool linking, scheduling fields, technician assignment placeholder, practical service checklist, repair fields, recurrence notes, and maps link on job detail.
- Save path: server action in `src/features/jobs/actions.ts`
- Database target: the current migrated `jobs` table.
- Safety: inserts only columns that exist in the current database table and stores future-only job workflow, checklist, recurrence, and repair fields in notes/metadata where needed.
- Boundary: this creates job/work-order records only. Water testing will come next and will link to jobs and pools. Invoices, reports, Xero, payments, routing, and AI remain separate workflows.

The next database-backed workflow is Water Testing foundation:

- Routes: `/water-testing`, `/water-testing/[testId]`, and `/water-testing/new`
- Scope: water test list/detail reads, Add Water Test form, customer/property/pool/job linking, standard chemistry fields, optional advanced fields, guide ranges, simple Low/OK/High/Not tested interpretation, and BioGuard recommendation preparation.
- Save path: server action in `src/features/water-testing/actions.ts`
- Database target: the current migrated `water_tests` table.
- Safety: inserts only columns that exist in the current database table and stores future-only advanced readings/product context in notes/metadata where needed.
- Chemistry boundary: guide ranges are displayed during water testing, not stored as pool profile targets.
- Product boundary: BioGuard Product Catalogue recommendations and dosing will be added later using catalogue data and pool context. This step does not hardcode incomplete dosing amounts.
- Integration boundary: LaMotte SpinTouch Bluetooth sync is prepared structurally only and is not connected yet.

The next database-backed workflow is Job Execution and Technician Today foundation:

- Routes: `/technician/today` and `/jobs/[jobId]/execute`
- Scope: technician run sheet, job execution context, maps link, practical service checklist, linked water test call-to-action, chemicals-used notes, technician/customer/internal notes, follow-up flags, and status updates.
- Save path: server action in `src/features/jobs/actions.ts`
- Database target: the current migrated `jobs` table.
- Safety: updates only columns that exist in the current `jobs` table. Checklist, chemical-use details, and future-only workflow fields are stored in existing note columns until first-class execution, stock movement, attachment, and report tables are connected.
- Boundary: this is a field execution foundation only. Stock deduction, BioGuard dosing automation, photo/file uploads, customer reports, Xero, payments, and AI remain separate workflows.

The next database-backed workflow is Service Report foundation:

- Routes: `/reports`, `/reports/[reportId]`, and `/reports/new/service?jobId=...`
- Scope: report list/detail reads, service report creation from a linked job, customer-facing preview layout, linked customer/property/pool/job/water-test context, simple water chemistry Low/OK/High interpretation, checklist summary from job notes, chemical-use notes from job execution, recommendations, follow-up, and placeholder PDF/sending actions.
- Save path: server action in `src/features/reports/actions.ts`
- Database target: the current migrated `reports` table.
- Migration: `drizzle/0002_add_reports_table.sql` safely creates the missing `reports` table and report enums without switching the app out of mock mode.
- Verification: `/api/admin/database/reports/count` and the protected setup route table counts can confirm the reports table after migration.
- Safety: inserts only columns that exist in the current `reports` table. Richer service report fields are stored in summary, findings, and recommendations until dedicated report sections, attachments, and delivery tables are connected.
- Boundary: this is a preview and draft workflow only. Real PDF generation, automatic email/SMS sending, photo/file rendering, customer portal delivery, and AI-generated wording remain separate phases.

The next database-backed workflow is BioGuard Product Intelligence foundation:

- Routes: `/chemicals` and `/chemicals/[chemicalId]`
- Scope: BioGuard/Dryden Aqua product register, product detail pages, category/subcategory fields, active/strength notes, purpose, suitable pool conditions, application notes, safety notes, related water issues, compatible pool/sanitiser types, and guidance notes.
- Data source: `src/features/chemicals/data/chemicals.ts` reads PostgreSQL from `chemical_products` when available and falls back to seeded/mock product records.
- Migration: `drizzle/0003_bioguard_product_intelligence.sql` safely creates or expands `chemical_products`.
- Seed: BioGuard product records seed idempotently from `src/features/chemicals/data/bioguard-products.ts`.
- Boundary: this is product intelligence only. Exact dosing automation, stock deduction, automatic customer-facing advice, and AI interpretation remain later phases.

The next workflow is Chemical Recommendations foundation:

- Route: `/water-testing/[testId]`
- Scope: simple non-AI product category suggestions based on water test guide-range status, possible BioGuard products from the product intelligence catalogue, technician review-required wording, and optional adding of selected products to linked job notes.
- Save path: server action in `src/features/water-testing/recommendation-actions.ts`
- Database target: current `jobs` note columns only.
- Safety: no exact dosing calculation, no stock deduction, and no automatic customer-facing advice.

The next database-backed workflow is Stock and Van Inventory foundation:

- Routes: `/stock` and `/stock/new`
- Scope: van/product stock register, technician/van assignment, quantity on hand, units, unit cost, selling price, low-stock threshold, supplier, status, and initial movement note.
- Data source: `src/features/stock/data/stock.ts` reads PostgreSQL from `stock` when available and falls back to mock van stock.
- Save path: server action in `src/features/stock/actions.ts`
- Migration: `drizzle/0004_stock_van_inventory.sql` safely creates or expands `stock` and `stock_movements`.
- Seed: starter van stock records seed idempotently from the existing ClearWater mock stock examples.
- Boundary: movement tables are prepared for add, adjust, used on job, transfer, reorder, and write-off workflows. Automatic stock deduction, job chemical usage records, supplier ordering, accounting, Xero, and payment integration remain later phases.

## Current Behaviour

The UI still uses mock fallback data when a database URL is missing or a scoped database query fails.

`CLEARWATER_DATA_SOURCE` defaults to `mock`. Even when the schema exists, pages should keep working without a local PostgreSQL database.

Customer, property/site, pool, job, water test creation, job execution updates, service report creation, BioGuard product seed data, and stock creation can save to PostgreSQL while `CLEARWATER_DATA_SOURCE` remains `mock`. Customers, Properties/Sites, Pools, Jobs, Water Testing, Technician Today, Reports, Chemicals, and Stock now attempt scoped PostgreSQL reads when a database URL is configured and fall back to mock records if those reads fail.

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
- `getJobs()`
- `getJobById()`
- `getWaterTests()`
- `getWaterTestById()`
- `getReports()`
- `getReportById()`
- `getChemicalProducts()`
- `getChemicalProductById()`
- `getStockWithSource()`

## Future Steps

1. Add `DATABASE_URL` to `.env.local`, or use Vercel Postgres variables such as `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, or `POSTGRES_URL_NON_POOLING`.
2. Keep `CLEARWATER_DATA_SOURCE="mock"`.
3. Run `npm run db:check` to confirm a database URL is configured without revealing it.
4. Generate the database migration with `npm run db:generate`.
5. Apply the migration with `npm run db:migrate`.
6. Seed the first real records with `npm run db:seed`.
7. Verify safe table counts with `npm run db:verify`.
8. Check `/api/health/database`.
9. Review database-created customers, properties, pools, jobs, and water tests with the protected count endpoints or a safe database admin tool.
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

- Dispatch
- Visits
- Chemical dosing
- Quotes
- Invoices
- Payments
- Reports
- Customer portal
- Routing
- AI
