# ClearWater MVP QA And Issue Register

ClearWater is the pool service management app. Outback Pool & Spa Services is the business/provider using it in Alice Springs.

Use this register to track fixes needed before real business use. Keep `CLEARWATER_DATA_SOURCE="mock"` and `CLEARWATER_ENFORCE_AUTH="false"` until production readiness is explicitly planned.

## How To Use This Register

- When an issue is found, add it to the relevant priority section.
- Fill in Issue ID, page/workflow, description, priority, status, notes, date found, date fixed, and commit reference.
- Fix critical blockers and high priority issues before adding major new features.
- Keep placeholder/future integration items visible so they are not mistaken for completed production features.
- When an issue is fixed, update status, date fixed, and commit reference.

Status values:

- `Open`
- `In progress`
- `Blocked`
- `Fixed`
- `Deferred`

## Critical Blockers

| Issue ID | Page/workflow | Issue description | Priority | Status | Notes | Date found | Date fixed | Commit reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QA-C001 | Production readiness | No critical blockers currently recorded after the latest MVP streamlining pass. | Critical | Open | Add any login, save, migration, deployment, or data-loss blocker here immediately. | 2026-05-05 |  |  |

## High Priority Fixes

| Issue ID | Page/workflow | Issue description | Priority | Status | Notes | Date found | Date fixed | Commit reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QA-H001 | Authentication | Full authentication enforcement is not enabled. | High | Deferred | Keep `CLEARWATER_ENFORCE_AUTH=false` until provider, seeded users, sessions, and route guards are tested. | 2026-05-05 |  |  |
| QA-H002 | Role access | Role-based access testing is not complete. | High | Deferred | Owner/admin, dispatcher, technician, finance, and customer paths need testing before login enforcement. | 2026-05-05 |  |  |
| QA-H003 | Customer Portal | Customer portal login is not implemented. | High | Deferred | Portal is currently a safe preview/demo foundation. | 2026-05-05 |  |  |
| QA-H004 | Database-backed UI | Temporary data-source/debug lines should be polished or moved to admin/settings before real business use. | High | Open | Keep useful diagnostics in protected/admin areas only. | 2026-05-05 |  |  |
| QA-H005 | Mobile layout | Final mobile UI polish is still required across daily technician workflows. | High | Open | Test small screens for Jobs, Technician Today, Job Execution, Water Testing, and Portal. | 2026-05-05 |  |  |

## Medium Priority Improvements

| Issue ID | Page/workflow | Issue description | Priority | Status | Notes | Date found | Date fixed | Commit reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QA-M001 | Reports | Real PDF generation is not implemented. | Medium | Deferred | Report preview structure exists; PDF rendering/export is future work. | 2026-05-05 |  |  |
| QA-M002 | Reports / Communication | Real email sending is not implemented. | Medium | Deferred | Send/email buttons must remain labelled as placeholders. | 2026-05-05 |  |  |
| QA-M003 | Communication | SMS/on-the-way notifications are not implemented. | Medium | Deferred | Job status/action UI exists; SMS provider is future work. | 2026-05-05 |  |  |
| QA-M004 | Photos / Attachments | Vercel Blob or another storage provider is not connected for real photo/file uploads. | Medium | Deferred | Attachment metadata foundation exists. | 2026-05-05 |  |  |
| QA-M005 | Water Testing / Chemicals | Exact BioGuard dosing rules are not implemented. | Medium | Deferred | Current recommendations are review-required category/product guidance only. | 2026-05-05 |  |  |
| QA-M006 | Water Testing | LaMotte SpinTouch import/sync is not implemented. | Medium | Deferred | Manual entry and structure exist. | 2026-05-05 |  |  |
| QA-M007 | Routing | Routing provider integration is not implemented. | Medium | Deferred | Routing UI and provider boundary are foundation only. | 2026-05-05 |  |  |
| QA-M008 | Equipment Register | Real warranty evidence file upload, serial scanning, reminders, and supplier claim packs are not implemented. | Medium | Deferred | Equipment Register stores the record and checklist foundation; storage/reminders/claim packs are future phases. | 2026-05-05 |  |  |

## Low Priority Polish

| Issue ID | Page/workflow | Issue description | Priority | Status | Notes | Date found | Date fixed | Commit reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QA-L001 | Copy polish | Review all customer-facing wording for consistency with Outback Pool & Spa Services branding. | Low | Open | ClearWater remains app name; Outback Pool & Spa Services remains provider name. | 2026-05-05 |  |  |
| QA-L002 | Empty states | Review empty states after more real database records exist. | Low | Open | Some empty states are intentionally generic during MVP. | 2026-05-05 |  |  |
| QA-L003 | Dashboard | Dashboard summaries may need recalibration once real data volume grows. | Low | Open | Keep simple until operations data is reliable. | 2026-05-05 |  |  |

## Future Integrations

| Issue ID | Page/workflow | Issue description | Priority | Status | Notes | Date found | Date fixed | Commit reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QA-FI001 | Accounting | Xero integration is not implemented. | Future | Deferred | Keep Xero cards/buttons as planning placeholders. | 2026-05-05 |  |  |
| QA-FI002 | Payments | Payment gateway is not implemented. | Future | Deferred | Invoice payment links remain placeholders. | 2026-05-05 |  |  |
| QA-FI003 | Storage | Vercel Blob/storage provider setup is required for attachments. | Future | Deferred | Needs provider selection and environment variable setup. | 2026-05-05 |  |  |
| QA-FI004 | SMS/Email | SMS and email providers are not connected. | Future | Deferred | Needed for on-the-way, reminders, reports, quotes, and invoices. | 2026-05-05 |  |  |
| QA-FI005 | Maps/Routing | Real routing provider integration is not connected. | Future | Deferred | GraphHopper or another provider can be added behind the routing boundary. | 2026-05-05 |  |  |
| QA-FI006 | LaMotte | LaMotte SpinTouch sync/import is not connected. | Future | Deferred | Manual testing remains the MVP path. | 2026-05-05 |  |  |

## Deferred Features

| Issue ID | Page/workflow | Issue description | Priority | Status | Notes | Date found | Date fixed | Commit reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QA-D001 | Mobile/offline | Offline/mobile app packaging is deferred. | Deferred | Deferred | Future Apple App Store and Google Play packaging should wait until web workflows stabilize. | 2026-05-05 |  |  |
| QA-D002 | AI | Full AI automation is deferred. | Deferred | Deferred | AI should assist only after reliable data and review workflows exist. | 2026-05-05 |  |  |
| QA-D003 | Inventory | Full warehouse inventory is deferred. | Deferred | Deferred | MVP focuses on technician van stock. | 2026-05-05 |  |  |
| QA-D004 | Business reporting | Advanced reporting and analytics are deferred. | Deferred | Deferred | Build after operational records are dependable. | 2026-05-05 |  |  |

## MVP Testing Checklist

Use this checklist after each major deployment.

### Dashboard

- [ ] `/dashboard` loads.
- [ ] Daily job summary is readable.
- [ ] Quick actions point to the correct Add/Create routes.
- [ ] No old website or unrelated branding appears.

### Customers

- [ ] `/customers` loads.
- [ ] Customer list/search/filter works.
- [ ] `/customers/new` saves a customer when the database is configured.
- [ ] Customer detail pages load existing database and mock fallback records.
- [ ] Billing address is separate from service site address.

### Properties/Sites

- [ ] `/properties` loads.
- [ ] `/properties/new` links to an existing customer.
- [ ] Address/manual entry works.
- [ ] Access notes, gate code, pet warnings, tenant, owner, and agent details are understandable.
- [ ] Open in Maps appears where an address exists.

### Pools

- [ ] `/pools` loads.
- [ ] `/pools/new` links to a property/site.
- [ ] Property/site search works by customer, address, phone, email, and notes.
- [ ] Pool type and shape dropdowns are practical.
- [ ] Pool profile does not ask for fixed chemistry targets.
- [ ] Pool detail shows concise linked Equipment Register records where available.

### Equipment Register

- [ ] `/equipment` loads.
- [ ] `/equipment/new` loads.
- [ ] `/equipment/[equipmentId]` loads for an existing equipment record.
- [ ] Equipment Register appears under Pool Data, not only under Pools or Stock.
- [ ] Equipment list search works by customer, address, pool, brand, model, serial number, equipment type, and notes.
- [ ] Filters work for equipment type, brand, calculated warranty status, record type, and manual equipment status.
- [ ] Warranty status colours are clear: green active, amber/orange expiring soon, red expired, grey unknown.
- [ ] Add Equipment allows existing customer/property/pool selection and manual unlinked customer entry.
- [ ] Installation Photos / Warranty Evidence clearly says real storage upload is planned.

### Jobs

- [ ] `/jobs` loads.
- [ ] `/jobs/new` links customer, property/site, and pool.
- [ ] Job type, status, priority, schedule, technician, checklist, repair, and follow-up fields are clear.
- [ ] `/jobs/[jobId]` loads.
- [ ] Open in Maps works where address data exists.

### Technician Today

- [ ] `/technician/today` loads.
- [ ] Today's jobs are usable on mobile.
- [ ] Job cards show customer, site, access warnings, pool summary, scheduled time, and actions.
- [ ] Links to job details and execution pages work.

### Job Execution

- [ ] `/jobs/[jobId]/execute` loads.
- [ ] Checklist is practical for pool service.
- [ ] Status updates are clear.
- [ ] Add Water Test link preselects context where possible.
- [ ] Chemicals used can be recorded without claiming automatic dosing.
- [ ] Completion summary is understandable.

### Water Testing

- [ ] `/water-testing` loads.
- [ ] `/water-testing/new` links customer, property/site, pool, and optional job.
- [ ] Standard LaMotte-style fields are present.
- [ ] Advanced fields are optional/collapsed where applicable.
- [ ] Guide ranges are shown as guide ranges, not fixed pool targets.
- [ ] Product recommendations are clearly technician-reviewed.

### Reports

- [ ] `/reports` loads.
- [ ] `/reports/new/service?jobId=...` can create a report from a job.
- [ ] `/reports/[reportId]` displays ClearWater and Outback Pool & Spa Services branding correctly.
- [ ] Internal notes stay separate from customer-facing notes.
- [ ] PDF/email/send actions are labelled as placeholders.

### Chemicals / BioGuard Products

- [ ] `/chemicals` loads.
- [ ] Product filters work.
- [ ] Product detail pages load.
- [ ] BioGuard/Dryden Aqua product records include purpose, conditions, application notes, safety notes, and review-required context.
- [ ] No exact dosing is claimed.

### Stock / Van Inventory

- [ ] `/stock` loads.
- [ ] `/stock/new` creates a stock record when the database is configured.
- [ ] Van/technician, quantity, unit, cost, selling price, supplier, threshold, and status are clear.
- [ ] Stock movements are described as foundation/planned where appropriate.

### Quotes

- [ ] `/quotes` loads.
- [ ] `/quotes/new` creates a draft quote when the database is configured.
- [ ] Quote line item categories are practical.
- [ ] Send/convert actions are placeholders unless implemented.

### Invoices

- [ ] `/invoices` loads.
- [ ] `/invoices/new` creates a draft invoice when the database is configured.
- [ ] Payment status and Xero status are clear.
- [ ] Xero/payment actions are placeholders unless implemented.

### Customer Portal

- [ ] `/portal` loads.
- [ ] Portal jobs, reports, quotes, and invoices pages load.
- [ ] Portal wording is customer-friendly.
- [ ] Customer-facing provider name is Outback Pool & Spa Services.
- [ ] Login/payment/approval actions are clearly placeholders unless implemented.

### Settings / Database

- [ ] `/settings` loads.
- [ ] `/settings/database` loads.
- [ ] `/api/health/database` returns safe JSON.
- [ ] Protected setup/count endpoints require `CLEARWATER_SETUP_KEY`.
- [ ] No credentials or secrets are exposed.

### Mobile Layout

- [ ] Header and mobile menu work.
- [ ] Bottom navigation is not overloaded.
- [ ] Tables/cards remain readable on a phone.
- [ ] Technician Today and Job Execution are easy to use on a phone.
- [ ] Forms have usable tap targets and do not overflow.
