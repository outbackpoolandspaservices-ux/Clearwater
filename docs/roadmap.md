# Roadmap

## Phase 1: Foundation

- Create Next.js, TypeScript, Tailwind, PostgreSQL, Drizzle, and Auth.js scaffold.
- Add staff app, auth, portal, API, feature, component, lib, db, mobile, and test folders.
- Add core database schema and first migrations.
- Document architecture, product requirements, reference repos, and Codex development rules.

## Phase 2: Auth, Roles, And Shell

- Add real Auth.js provider flow.
- Add owner, admin, dispatcher, technician, customer, and finance roles.
- Protect staff routes and portal routes.
- Add settings and user management foundations.

## Phase 3: Core CRM

- Implement customers, properties/sites, pools, and equipment CRUD.
- Support real estate agency, property manager, owner, and tenant relationships.
- Add photos and documents for customers, sites, pools, and equipment.
- Add reusable TanStack Table primitives.

## Phase 4: Jobs And Recurrence

- Implement job creation, job statuses, job detail pages, and job history.
- Add supported job types and workflow transitions.
- Add recurring job templates and future-visit generation.
- Prevent duplicate recurring jobs.

## Phase 5: Dispatch

- Add `react-big-calendar` dispatch board.
- Support day, week, month, technician, and location views.
- Add unscheduled queue, drag-and-drop scheduling, route order, status colours, and filters.
- Add travel-time placeholders through a routing adapter.

## Phase 6: Technician Mobile Workflow

- Build mobile-first technician job list and job detail workflow.
- Add on-the-way messaging with automatic timer start.
- Add checklist, notes, photos, water tests, chemicals, parts, recommendations, completion, and automatic timer stop.
- Design offline queue patterns for later implementation.

## Phase 7: Water Testing And Chemistry

- Add manual water test entry and pool history.
- Add BioGuard-first chemical product catalogue.
- Add dosing calculations, product alternatives, application methods, and safety warnings.
- Prepare for LaMotte SpinTouch sync.

## Phase 8: Reports

- Generate service reports and inspection reports.
- Add report PDFs with logo, header, footer, watermark, photos, water chemistry, equipment notes, findings, and recommendations.
- Expose relevant reports to the customer portal.

## Phase 9: Quotes, Invoices, And Payments

- Add quote line items, terms, expiry, customer approval, and conversion to job or invoice.
- Add invoice line items, payment status, unpaid tracking, payment links, and payment history.
- Add Xero sync status and accounting workflow.

## Phase 10: Stock And Profitability

- Add van stock, chemical stock, product stock, quantities, cost, selling price, low stock alerts, supplier, and brand.
- Automatically reduce stock from job usage.
- Add job profitability using labour time, travel time, chemical cost, parts cost, invoice value, and margin.

## Phase 11: Customer Portal And Communication

- Add secure portal login.
- Add service history, upcoming jobs, reports, photos, quotes, invoices, payments, requests, messages, and contact updates.
- Add SMS, email, in-app, and portal message templates and history.

## Phase 12: Routing, AI, And Native App Path

- Add route optimisation adapter, route score, route comparison, ETA, distance, and stop sequencing.
- Add AI-assisted recommendations, summaries, draft messages, quote drafts, schedule suggestions, and review-required next actions.
- Prepare mobile architecture for Apple App Store and Google Play availability.
