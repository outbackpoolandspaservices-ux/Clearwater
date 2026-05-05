# ClearWater

ClearWater is a professional pool service management system built for Outback Pool & Spa Services in Alice Springs, Australia.

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
      portal/
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

- Branded header for ClearWater, built for Outback Pool & Spa Services.
- Desktop sidebar navigation.
- Mobile collapsible menu and bottom navigation.
- Dashboard, jobs, dispatch, customers, properties/sites, pools, equipment, water testing, chemicals, stock, quotes, invoices, reports, customer portal, and settings pages.
- Dashboard drill-down navigation for jobs, unscheduled work, pending quotes, unpaid invoices, low stock, water chemistry alerts, technician workload, and quick actions.
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
- Add Water Test saves technician water chemistry readings to PostgreSQL when a database URL is configured. Tests link to pools and optional jobs, with guide ranges displayed during testing rather than stored as pool profile targets.
- Job Execution and Technician Today foundation reads jobs from PostgreSQL when available, links technicians from the run sheet to `/jobs/[jobId]/execute`, stores checklist/status/chemical-use notes safely on the current `jobs` table, and keeps stock deduction, photos/files, BioGuard dosing automation, and customer reports for later phases.
- Service Report foundation reads reports from PostgreSQL when available, supports `/reports/new/service?jobId=...`, stores draft service reports in the current `reports` table, and renders customer-facing report previews from linked job, customer, property/site, pool, and water-test data. PDF generation, automatic email sending, photos/files, and AI-generated wording are later phases.
- Reports database support is included in `drizzle/0002_add_reports_table.sql`. This migration safely creates the `reports` table and report enums when missing, with service-report fields for customer summary, work completed, follow-up, next service recommendation, internal notes, metadata, sent status, and timestamps.
- BioGuard Product Intelligence foundation is included in `drizzle/0003_bioguard_product_intelligence.sql`. `/chemicals` and `/chemicals/[chemicalId]` now read BioGuard/Dryden Aqua product records from PostgreSQL when available with mock fallback. Seed data includes core BioGuard categories such as sanitisers, oxidisers, algaecides, balancers, specialty, salt pools, Mineral Springs, spa/commercial planning categories, and AFM filter media. Recommendations remain technician-reviewed guidance only; exact dosing automation comes later.
- Chemical Recommendation foundation now appears on water test detail pages. It suggests product categories and possible BioGuard products from simple reading conditions, marks every suggestion as technician review-required, and can add selected products to linked job notes without dosing automation or stock deduction.
- Stock and Van Inventory database foundation is included in `drizzle/0004_stock_van_inventory.sql`. `/stock` reads van stock from PostgreSQL when available with mock fallback, `/stock/new` creates stock records and an initial stock movement, and seed data safely loads starter van stock for service technicians. Stock adjustment, transfer, used-on-job, write-off, supplier ordering, accounting, and automatic stock deduction remain later phases.
- Job Chemical Usage foundation is included in `drizzle/0005_job_chemical_usage.sql`. Job execution can record product usage from the chemical catalogue, optionally deduct matching van stock, write stock movement records, and show usage on job details and service report previews. Exact dosing automation and invoice preparation remain later phases.
- Quotes and Invoices database workflow is included in `drizzle/0006_quotes_invoices_workflow.sql`. `/quotes`, `/quotes/new`, `/quotes/[quoteId]`, `/invoices`, `/invoices/new`, and `/invoices/[invoiceId]` now read/write PostgreSQL where available with mock fallback. Xero sync, payment gateway collection, quote approval, and conversion actions remain placeholders.
- Customer Portal database workflow now reads from the same PostgreSQL-backed Customers, Properties/Sites, Pools, Jobs, Water Testing, Reports, Quotes, Invoices, and Payments data layers with mock fallback. It remains a safe demo portal without real authentication until the auth phase.
- Authentication and role permissions foundation now includes safe current-user helpers, route guard helpers, demo-role configuration, and documented auth enforcement controls. Global login enforcement remains off by default to avoid locking the MVP during Vercel review.
- Photos and Attachments foundation now supports job attachment metadata categories and `/jobs/[jobId]/attachments/new`. Actual file upload/storage remains a placeholder until a Vercel-compatible storage provider such as Vercel Blob is configured.

ClearWater still keeps `CLEARWATER_DATA_SOURCE="mock"` as the app-wide safety default. Migrated workflows attempt scoped PostgreSQL reads/writes when a database URL is configured and fall back to mock records safely. Real login is not enforced yet.

## MVP Status

Working database-backed workflows:

- Customers, Properties/Sites, Pools
- Jobs, Technician Today, Job Execution
- Water Testing with guide ranges
- Service Reports
- BioGuard product catalogue and review-required recommendations
- Stock, van inventory, job chemical usage, and optional stock deduction
- Quotes and Invoices with draft creation and line items
- Customer Portal demo views
- Attachment metadata for job photos/documents

Still placeholders or planned:

- Real authentication enforcement and customer login
- Real PDF generation and email/SMS sending
- Xero sync and payment gateway processing
- Real file upload/storage
- Full BioGuard dosing automation and stock/accounting reconciliation
- Routing provider connection and mobile/offline app packaging

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

The seed currently prepares organisation, users/roles, customers, sites, pools, equipment, BioGuard/Dryden Aqua product records, and starter van stock. Runtime workflows for jobs, water testing, reports, quotes, invoices, attachments, and chemical usage create their own database records as the app is used.

Database-backed Add Customer:

- Open `/customers/new` from the Customers page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this first write workflow.
- The form saves customer contact, billing address, communication preference, internal notes, type, and status to PostgreSQL.
- Billing/customer address is stored separately from future service site/property addresses. Sites and pools are not created by this form.
- If no database URL is configured, the form fails safely with a friendly message.
- After saving, ClearWater redirects back to `/customers`; the list attempts PostgreSQL reads when a database URL is configured and falls back to mock data if needed.
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
- `/technician/today` and `/jobs/[jobId]/execute` now provide a database-backed job execution foundation. Execution updates can change job status and save checklist, chemical-use notes, technician notes, customer notes, internal notes, and follow-up flags to existing job note columns.
- Chemicals used are notes only for now. Stock deduction, BioGuard dosing automation, photos/files, service reports, and customer notifications will come later.
- `/api/admin/database/jobs/status-summary` provides a protected safe count by job status using `CLEARWATER_SETUP_KEY`.

Database-backed Service Report workflow:

- Open `/reports/new/service?jobId=...` from a job detail page or job execution page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- `/reports` and `/reports/[reportId]` attempt PostgreSQL reads when a database URL is configured and fall back to mock reports if the database is unavailable.
- The current migrated `reports` table stores linked customer, site, pool, job, water test, report number, type, status, summary, findings, and recommendations.
- If the deployed database does not have `reports` yet, run `npm run db:migrate` or the protected database setup route after deploying this migration. `/api/admin/database/reports/count` should then return a real count instead of `reports: "missing"`.
- The protected database setup response now includes `reports` in table counts so the latest migration can be confirmed without exposing database credentials.
- Rich report details such as checklist summary, chemical-use notes, technician notes, and customer-facing notes are derived from linked job notes for now.
- PDF download, Send to Customer, Email Report, View Customer Portal, photo/file rendering, and AI-generated wording are placeholders only.
- `/api/admin/database/reports/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.

Database-backed BioGuard Product Intelligence:

- Open `/chemicals` to review the product register.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- `/chemicals` and `/chemicals/[chemicalId]` attempt PostgreSQL reads from `chemical_products` when a database URL is configured and fall back to mock product records if the database is unavailable.
- Initial BioGuard/Dryden Aqua product records seed idempotently through the protected setup route or `npm run db:seed`.
- Product fields include brand, category, subcategory, active/strength note, purpose, suitable conditions, application notes, safety notes, related water issues, compatible pool types, and internal notes.
- Product intelligence is guidance only. Full dosing calculations, customer-facing recommendations, stock deduction, and AI-assisted interpretation are later phases.
- `/api/admin/database/chemicals/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.

Chemical Recommendation foundation:

- Open a water test detail page such as `/water-testing/[testId]`.
- Simple rules suggest review-required product categories for low chlorine, high combined chlorine, pH, alkalinity, calcium hardness, high CYA, phosphate, algae notes, and salt pool scale risk.
- Recommendations show possible BioGuard products from the product intelligence catalogue.
- Linked jobs can receive selected products as technician notes. This does not calculate doses, deduct stock, or create customer-facing advice automatically.

Database-backed Stock and Van Inventory workflow:

- Open `/stock` to review van inventory.
- Open `/stock/new` to add a product stock record to a technician van or service location.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- `/stock` attempts PostgreSQL reads from the `stock` table when a database URL is configured and falls back to mock stock records if the database is unavailable.
- The protected setup route and `npm run db:seed` can seed starter BioGuard van stock idempotently.
- `/api/admin/database/stock/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.
- Stock movements are prepared for received, adjustment, transfer, used-on-job, reorder, and write-off workflows. Job stock deduction and accounting integration are later phases.

Job Chemical Usage and Stock Deduction foundation:

- Open `/jobs/[jobId]/execute` to record chemicals/products used during a job.
- Product selection uses the BioGuard/product register when available and still allows manual product names.
- Technicians can enter quantity, unit, reason, and notes.
- If a matching stock record is selected, ClearWater deducts the entered quantity from van stock and writes a `stock_movements` row. Unit conversion is not automated yet, so technicians should use matching units.
- `/jobs/[jobId]` and `/reports/[reportId]` show linked chemical usage with mock fallback.
- `/api/admin/database/job-chemical-usage/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.
- Stock deduction is a foundation only. Exact BioGuard dosing, invoice line item preparation, supplier reordering, and accounting integration are later phases.

Database-backed Quotes and Invoices workflow:

- Open `/quotes` and `/invoices` to review database-backed registers with mock fallback.
- Use `/quotes/new` and `/invoices/new` to create draft records with a first line item.
- Quote line items and invoice line items support labour, parts, chemicals, callout, equipment, and other categories.
- Quote statuses include Draft, Sent, Accepted, Declined, Expired, and Converted to invoice.
- Invoice payment statuses currently track Unpaid, Part paid, Paid, and Overdue style labels while real payment collection remains a placeholder.
- `/api/admin/database/quotes/count` and `/api/admin/database/invoices/count` provide protected safe count checks using `CLEARWATER_SETUP_KEY`.
- Xero sync and payment gateway integration remain planning cards/placeholders only.

Customer Portal database workflow:

- Open `/portal`, `/portal/jobs`, `/portal/reports`, `/portal/quotes`, and `/portal/invoices`.
- The portal uses the first available database customer when the original mock portal customer is not present, then filters linked sites, pools, jobs, water tests, reports, quotes, invoices, and payments for that customer.
- Placeholder customer actions remain: request service, send message, approve/decline quote, pay invoice, and download PDF.
- Real customer login, portal permissions, quote approval, payment processing, and message sending are later phases.

Authentication and role permissions foundation:

- Auth.js remains wired through `src/auth.ts`, `src/lib/auth/config.ts`, and `/api/auth/[...nextauth]`.
- `src/lib/auth/current-user.ts` and `src/lib/auth/guards.ts` provide safe session/demo user helpers for future route protection.
- Keep `CLEARWATER_ENFORCE_AUTH="false"` until a real provider and seeded users are tested.
- Use `CLEARWATER_DEMO_ROLE` to test owner/admin/dispatcher/technician/finance/customer permission behaviour without locking yourself out.

Photos and attachments foundation:

- Open a job detail page and choose Add Photo / Attachment Metadata.
- Categories include before, after, equipment, issue/damage, safety concern, water condition, and completed work.
- Metadata saves to the existing `attachments` table when available. The storage key is marked as a pending upload placeholder.
- `/api/admin/database/attachments/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.
- Set `BLOB_READ_WRITE_TOKEN` later when real Vercel Blob uploads are implemented.

Database-backed Water Testing workflow:

- Open `/water-testing/new` from the Water Testing page.
- Keep `CLEARWATER_DATA_SOURCE="mock"` while testing this workflow.
- `/water-testing` and `/water-testing/[testId]` attempt PostgreSQL reads when a database URL is configured and fall back to mock tests if the database is unavailable.
- The Add Water Test form links to customer, property/site, pool, and an optional job/service visit. Search supports customer name, property address, pool name, phone, and email.
- Standard SpinTouch-style fields include chlorine, pH, alkalinity, calcium hardness, CYA/stabiliser, salt, phosphate, TDS, and water temperature. Advanced optional values are stored in notes where columns are not available yet.
- Guide ranges are shown during testing and are not stored as pool profile targets.
- BioGuard Product Catalogue recommendations and dosing are planned later. Current product-intelligence work is only a category placeholder and TODO structure.
- `/api/admin/database/water-tests/count` provides a protected safe count check using `CLEARWATER_SETUP_KEY`.

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

## Vercel Post-Deployment Checklist

Run the protected setup route after each deployment that includes new migrations:

```powershell
Invoke-RestMethod -Method POST "https://clearwater-six.vercel.app/api/admin/database/setup" -Headers @{"x-clearwater-setup-key"="YOUR_SETUP_KEY"}
```

Then run protected count checks with the same `x-clearwater-setup-key` header:

- `/api/admin/database/chemicals/count`
- `/api/admin/database/stock/count`
- `/api/admin/database/job-chemical-usage/count`
- `/api/admin/database/quotes/count`
- `/api/admin/database/invoices/count`
- `/api/admin/database/attachments/count`
- `/api/admin/database/reports/count`
- `/api/admin/database/customers/count`
- `/api/admin/database/properties/count`
- `/api/admin/database/pools/count`
- `/api/admin/database/water-tests/count`

Browser smoke-test these routes:

- `/dashboard`
- `/customers`
- `/customers/new`
- `/properties`
- `/properties/new`
- `/pools`
- `/pools/new`
- `/jobs`
- `/jobs/new`
- `/technician/today`
- `/water-testing`
- `/water-testing/new`
- `/reports`
- `/chemicals`
- `/stock`
- `/stock/new`
- `/quotes`
- `/quotes/new`
- `/invoices`
- `/invoices/new`
- `/portal`
- `/settings/database`
- `/api/health/database`

Workflow smoke tests:

- Add customer.
- Add property/site.
- Add pool.
- Add job.
- Execute job.
- Add water test.
- Generate service report.
- Add stock.
- Add chemical usage.
- Create quote.
- Create invoice.
- Check portal display.

Safety notes:

- Keep `CLEARWATER_DATA_SOURCE="mock"` while the scoped database-backed workflows continue to mature.
- Keep `CLEARWATER_ENFORCE_AUTH="false"` until login and role access are fully tested.
- Xero, payments, SMS/email sending, real PDF generation, storage uploads, and offline mobile packaging remain future phases.

## Documentation

- `AGENTS.md`: Codex development guide.
- `docs/reference-repos.md`: reference repository rules.
- `docs/architecture.md`: system structure and boundaries.
- `docs/database-schema.md`: planned PostgreSQL/Drizzle tables and migration path.
- `docs/authentication-and-permissions.md`: Auth.js and RBAC planning.
- `docs/data-migration-plan.md`: safe mock-data to database migration plan.
- `docs/mvp-qa-issue-register.md`: MVP QA checklist and remaining issue register before real business use.
- `docs/product-strategy-review.md`: MVP product strategy, UX boundaries, and planned/deferred scope.
- `docs/product-requirements.md`: product goals, users, modules, and scope.
- `docs/roadmap.md`: phased implementation plan.

## Reference Repositories

The following repositories are architectural references only:

- `vercel/nextjs-postgres-auth-starter`
- `jquense/react-big-calendar`
- `TanStack/table`
- `graphhopper/graphhopper`

Do not copy code blindly from these repositories.
