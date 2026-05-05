# ClearWater Product Strategy Review

ClearWater is the pool service management app. Outback Pool & Spa Services is the pool service business using it in Alice Springs.

Use `ClearWater` for the software/app name throughout the interface. Use `Outback Pool & Spa Services` for customer-facing provider wording in portals, reports, quotes, invoices, and service documents.

## PoolTrackr Reference Learnings

PoolTrackr screenshots reinforced that pool-service software needs pool-specific operational depth: customers/contacts, pools, products, water testing, recurring jobs, technician scheduling, analytics, finance summaries, and dense searchable lists. ClearWater keeps those useful concepts but improves the workflow connection between them.

ClearWater should be better by making dashboard cards, table rows, alerts, workload items, and action buttons lead to the exact filtered list or detail page. Jobs should not stop at a list; they should lead into dispatch, maps, technician execution, water testing, chemical usage, reports, quotes, and invoices. Customer, property/site, and pool relationships should stay obvious because one agency or owner may manage multiple addresses and pools.

Deferred features remain deliberate: Xero, payments, SMS/email, real PDF, file storage, offline/mobile packaging, route provider integration, full BioGuard dosing automation, and enforced authentication should wait until the core data and workflow paths are reliable.

## MVP Position

ClearWater should combine pool-specific depth from PoolTrackr-style systems with the most useful field-service workflow patterns from ServiceM8, Jobber, Skimmer, Pool Brain, and Housecall Pro.

The MVP should stay practical for a pool service business:

- Customers can have multiple properties/sites.
- Properties/sites hold address, access, gate, pet, tenant, owner, and agent context.
- Pools hold pool profile and service context without storing fixed water chemistry targets.
- Jobs link customer, property/site, pool, technician, schedule, checklist, status, notes, and follow-up context.
- Technician Today and Job Execution support mobile field work.
- Water Testing captures LaMotte-style readings and shows guide ranges.
- Chemical recommendations are review-required product/category suggestions, not exact dosing automation.
- Reports are customer-facing service and inspection previews for Outback Pool & Spa Services.
- Chemicals and Stock focus on BioGuard/Dryden Aqua product intelligence and van inventory, not warehouse management.
- Quotes and invoices stay simple until Xero and payments are connected.
- Customer Portal remains a demo/self-service foundation until authentication is enforced.

## PoolTrackr-Style Strengths To Keep

- Customer records and multi-site relationships.
- Pool profiles and equipment planning.
- Service jobs and recurring-service placeholders.
- Technician workflow and checklist completion.
- Water testing and chemical usage.
- Service report previews.
- Quote and invoice foundations.
- Customer portal visibility.
- Stock and chemical product records.
- Dispatch, routing, and daily run visibility.

## Limitations ClearWater Should Improve

- Better customer self-service through a clear portal.
- Better job execution through checklist/status/action flows.
- Better property/site search using customer, address, phone, email, and notes.
- Better technician mobile experience with a daily run and Open in Maps.
- Better BioGuard product intelligence for Alice Springs conditions such as hard water, dust, high UV, evaporation, debris, and phosphate load.
- Better stock and chemical usage tracking through van inventory and job usage records.
- Better report structure before PDF/email automation.
- Better integration readiness through adapter boundaries and protected setup endpoints.

## Relevant Field-Service Patterns To Include

- Dispatch board and technician daily run.
- Job status workflow.
- On-the-way, start, complete, and follow-up placeholders.
- Checklist-based completion.
- Customer communication placeholders.
- Quote-to-job-to-invoice planning.
- Customer portal.
- Open in Maps.
- Internal notes separate from customer-facing notes.
- Attachments/photos metadata foundation.
- Simple profitability and stock usage foundations.
- Dashboard summaries.

## Defer Until The Data Is Stable

- Full accounting system.
- Real Xero sync.
- Real payment gateway.
- SMS/email delivery.
- Real PDF generation.
- Full AI automation or automatic chemical decisions.
- Full warehouse inventory.
- HR/payroll.
- Franchise or multi-branch complexity.
- Full offline/mobile app packaging.

## Current Database-Backed Priority

These workflows should continue to use PostgreSQL when `DATABASE_URL` exists, with mock fallback:

1. Customers.
2. Properties/Sites.
3. Pools.
4. Jobs.
5. Water Tests.
6. Reports.
7. Chemicals/BioGuard product foundation.
8. Stock.
9. Job chemical usage.
10. Quotes.
11. Invoices.
12. Attachments foundation.

Keep `CLEARWATER_DATA_SOURCE="mock"` and `CLEARWATER_ENFORCE_AUTH="false"` until a later explicit production-readiness phase.

## UX Rules

- Daily workflows must be easy to reach: Dashboard, Jobs, Technician Today, Water Testing, Customers, Properties/Sites, Pools.
- Planned modules must be labelled as planned or placeholder.
- Customer-facing copy should mention Outback Pool & Spa Services, Alice Springs.
- Avoid developer wording in user-facing screens.
- Avoid claiming exact BioGuard dosing, AI decisions, real PDF sending, real payments, or real Xero sync before those integrations exist.
