# Product Requirements

## Product Vision

ClearWater is a professional pool service management system for Outback Pool & Spa Services in Alice Springs, Australia.

The long-term goal is to combine pool-specific depth from products like PoolTrackr with stronger field-service workflows inspired by ServiceM8, Skimmer, Pool Brain, Jobber, and Housecall Pro. ClearWater should become a complete pool service operating system, not a simple job list.

## Product Goals

- Include the core features expected from pool service software.
- Improve customer self-service, mobile workflows, reporting, route planning, and integrations.
- Support pool-specific water testing, chemical dosing, service history, equipment tracking, and inspection reports.
- Support technicians working in areas with poor internet.
- Include a customer portal for history, quotes, invoices, payments, reports, and requests.
- Integrate with Xero, maps, payments, SMS, email, and eventually LaMotte SpinTouch.
- Leave room for Apple App Store and Google Play availability.
- Be clean, scalable, and suitable for step-by-step Codex development.
- Be designed for possible future sale to other pool service businesses.

## Users

### Business Owner / Admin

Manages the full system: dashboard, customers, sites, pools, jobs, scheduling, technicians, quotes, invoices, payments, stock, reports, users, permissions, integrations, customer portal access, and business performance.

### Office Admin / Dispatcher

Manages daily operations: job creation, scheduling, technician assignment, customer messages, notes, customer records, recurring services, quotes, invoices, completed work review, and technician progress.

### Technician

Uses ClearWater mostly on mobile to view assigned jobs, navigate, send "on the way" messages, automatically start job time, complete checklists, enter or sync water tests, record chemicals and parts, upload photos, add notes and recommendations, and complete jobs with automatic timer stop.

### Customer

Uses the portal to view service history, upcoming work, reports, photos, water test results, quotes, invoices, payment history, requests, messages, and contact details.

### Finance / Bookkeeper

Manages invoices, payments, unpaid invoices, Xero sync status, invoice issues, exports, reports, and profitability.

## Core Modules

- Dashboard: jobs, invoice risk, quote pipeline, stock alerts, route efficiency, monthly revenue, technician performance, chemistry alerts, customer follow-ups, and AI suggestions.
- Customer Management: customer contacts, billing details, real estate/property manager/owner/tenant relationships, communication preferences, notes, portal access, and multiple sites per customer.
- Sites And Pool Profiles: service locations, one or more pools/spas/water bodies, pool volume, type, surface, sanitiser, indoor/outdoor, heaters, access instructions, warnings, target ranges, and technician notes.
- Equipment: pumps, filters, chlorinators, heaters, cleaners, dosing systems, valves, plumbing notes, photos, warranties, condition, repair history, and replacement recommendations.
- Jobs And Workflow: enquiry to quote, approval, schedule, dispatch, on-the-way, timed technician workflow, water test, chemicals, photos, report, invoice, payment, closure, and saved service history.
- Recurring Jobs: weekly, fortnightly, monthly, seasonal, custom, preferred day, technician, time window, duplicate prevention, and future-visit updates.
- Scheduling And Calendar: day/week/month, technician view, location view, drag-and-drop, unscheduled queue, recurring jobs, assignments, duration, travel time, status colours, route order, and filters.
- Technician Mobile Workflow: mobile-first job execution with offline-ready design, checklists, notes, photos, water testing, LaMotte SpinTouch future sync, chemicals, parts, and reports.
- Water Testing: manual and future SpinTouch entry for free chlorine, total chlorine, combined chlorine, pH, alkalinity, calcium hardness, cyanuric acid, salt, phosphate, TDS, temperature, copper, iron, borates, nitrates, and future advanced fields.
- Chemical Dosing: BioGuard Australia first, with room for Pool Pro and generic products, dosing rules, product strength, target ranges, readings, recommended dose, application methods, safety notes, alternatives, and warnings.
- Chemical Product Intelligence: cloudy water, algae risk, phosphates, calcium hardness, CYA, chlorine, pH, alkalinity, staining, scaling, salt system issues, and recurring balance problems.
- Reports: professional service reports and inspection reports with customer details, site details, technician, times, water results, chemicals, work completed, photos, equipment, notes, recommendations, next service date, logo, footer, watermark, and PDF download.
- Quotes: quote items, labour, parts, chemicals, photos, notes, terms, expiry, online approval, status tracking, conversion to jobs, and conversion to invoices.
- Invoices And Payments: invoice items, labour, chemicals, products, parts, payment links, payment history, unpaid invoice tracking, Xero sync status, and automatic invoice creation from completed jobs later.
- Stock And Product Management: van stock first, chemical/product stock, quantity, cost, selling price, low stock, automatic reduction from jobs, category, supplier, brand, and profitability.
- Photos, Documents And Files: before/after photos, equipment, damage, green pool, water condition, safety issues, repair evidence, approvals, customer documents, warranties, manuals, quotes, invoices, and reports.
- Communication: SMS, email, in-app, portal messages, reminders, confirmations, on-the-way, completed, quote, invoice, overdue, follow-up, due reminders, editable templates, and communication history.
- Maps, Routing And Travel: addresses, navigation links, travel time, distance, best job order, optimisation, route score, comparison, and provider adapter.
- Offline And Mobile: offline jobs, checklists, notes, water tests, photos, chemicals, queued uploads, and sync when internet returns.
- AI And Intelligence: chemistry interpretation, recommendations, unusual reading alerts, repeated issue detection, predictive maintenance, report drafting, quote drafting, messages, schedule suggestions, route suggestions, upsell suggestions, checklist guidance, and next actions.

## Job Statuses

ClearWater supports these job statuses: New, Quote Required, Quoted, Quote Sent, Quote Approved, Quote Declined, Ready to Schedule, Scheduled, On the Way, In Progress, Completed, Report Sent, Invoiced, Paid, Cancelled, On Hold, and Follow-Up Required.

## MVP Scope

- Authenticated staff workspace.
- Dashboard and navigation shell.
- Customer, site/property, pool, equipment, job, recurring job, water test, chemical, stock, quote, invoice, and document foundations.
- Dispatch calendar foundation.
- Customer portal route foundation.
- API route placeholders for core modules and integrations.
- Documentation for architecture, reference repos, roadmap, and Codex development.

## Later Scope

- Production CRUD workflows.
- Offline-first technician mobile implementation.
- Real customer portal authentication and payments.
- LaMotte SpinTouch sync.
- Xero, maps, payments, SMS, email, supplier, and report-generation integrations.
- AI recommendations with human review.
- Native app store distribution.

## Non-Goals For The Scaffold

- Finished production workflows.
- Real payment processing.
- Real route optimisation.
- Native mobile app implementation.
- Copying code blindly from reference repositories.
