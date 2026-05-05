# ClearWater Workflow Map

ClearWater is organised around the real pool-service workflow for Outback Pool & Spa Services.

## Daily Office Flow

1. Dashboard shows today, unscheduled work, quotes, invoices, stock, water alerts, technician workload, and recent activity.
2. Dispatcher opens filtered Jobs or Dispatch from dashboard drill-downs.
3. Office creates or updates customer, property/site, pool, and job records.
4. Dispatch assigns jobs to a technician run and reviews unscheduled/follow-up work.
5. Completed work can flow into service reports, quotes, and invoices.

## Technician Flow

1. Technician opens Technician Today.
2. Technician opens job execution from a job card.
3. Job execution shows customer, property/site, pool, address, maps, job type, status, and priority.
4. Technician completes checklist, records water test, notes chemicals used, and marks follow-up/quote/parts needs.
5. Job detail and service report preview show the completed work context.

## Pool Data Flow

1. Customer stores billing and primary contact details.
2. Property/Site stores service address, access, gate, tenant/owner/agent, and maps context.
3. Pool stores pool profile, environment, construction, sanitiser/filter/cleaner context, and service notes.
4. Equipment Register stores equipment that has been sold, installed, serviced, replaced, or recorded for warranty/history purposes.
5. Equipment Register is separate from Stock: Stock is business/van inventory; Equipment Register is customer/property/pool-linked equipment history.
6. Equipment records link to customer, property/site, pool, optional job, quote, invoice, and future service report history.
7. Warranty status is calculated from installed date when available, otherwise purchase date, plus warranty period. Active shows green, expiring soon within 60 days shows amber/orange, expired shows red, and missing warranty details show grey.
8. Installation Photos / Warranty Evidence records the required checklist for before/after photos, serial/model plates, proof of purchase, warranty cards/manuals, installation notes, and future supplier warranty claim packs. Real storage upload is a later phase.
9. Water tests link to pools and jobs.

## Water Care Flow

1. Water test captures LaMotte-style fields and simple guide-range interpretation.
2. Recommendation foundation suggests product categories and possible BioGuard products for technician review.
3. Chemical usage can be recorded against job execution.
4. Stock deduction and invoice preparation remain controlled workflows, not automatic dosing decisions.

## Commercial Flow

1. Quote can link to customer, property/site, pool, and job.
2. Accepted quote can later become a job or invoice.
3. Completed job can later become an invoice draft.
4. Equipment items can later flow from quotes/invoices into Equipment Register after sale/installation review.
5. Xero, payment gateway, email, SMS, and PDF generation remain planned integrations.

## Customer Portal Flow

1. Customer sees upcoming work, recent service reports, water test history, quotes, invoices, and placeholders for request/message actions.
2. Portal remains a safe demo until customer login is added.
3. Future portal auth should expose only the signed-in customer’s records.
