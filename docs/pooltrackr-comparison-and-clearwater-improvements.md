# PoolTrackr Comparison and ClearWater Improvements

This document records product learnings from PoolTrackr screenshots supplied as reference material. ClearWater must not copy PoolTrackr branding, layout, code, or visual design. The purpose is to keep useful pool-service workflow patterns while building a clearer, more connected system for Outback Pool & Spa Services.

## Features Observed

- Overview dashboard with active customers, active pools, water tests, setup shortcuts, knowledge base links, and support ticket prompts.
- Expandable setup and operations sidebar with jobs, quotes, invoicing, contacts, pools, products, campaigns, notifications, equipment, data management, water testing, dosage groups, custom fields, and tags.
- Analytics dashboard with completed jobs, new customers, water tests, charting, date ranges, and store-location filters.
- Finance dashboard with revenue, invoice count, average invoice value, sales chart, product/staff/customer breakdowns, and CSV export concepts.
- Calendar day view with technician lanes, time slots, coloured job blocks, unassigned jobs, day/week/month/at-a-glance controls, map view, and filters.
- Jobs list with search, status filter, date range, contact, pool, technician, job type, notes, recurrence status, and action icons.
- Recurrence list with job type, contact, pool type, pool surface, sanitiser, filter, recurrence pattern, next date, end date, and actions.
- Contacts list with sync status, balance, address, active state, and actions.
- Pools list with address, pool type, filter type, linked contacts, active state, and actions.

## What PoolTrackr Does Well

- It treats pools, water testing, products, recurring jobs, and equipment as first-class pool-business concepts.
- It gives office users dense tables for high-volume operational scanning.
- It recognises that pool servicing needs recurrence, job scheduling, water tests, and product/chemical context.
- It separates analytics and finance views from the daily overview.
- It shows a useful calendar lane model for technician scheduling.

## Likely Limitations From a Pool Service Business Perspective

- Some overview cards and list actions can feel disconnected unless they drill into the exact job, pool, contact, report, or invoice.
- Dense list screens can hide the next best action for technicians and dispatchers.
- Contact, address, pool, and job relationships need to be obvious because one customer can manage many sites and pools.
- Product and chemical intelligence needs technician review, local context, and stock usage links rather than generic product lists.
- Customer self-service should go beyond support and payments; it should expose service history, water tests, reports, quotes, invoices, and service requests.
- Calendar and route views are most useful when unscheduled jobs, follow-ups, waiting states, and route order are visible together.

## ClearWater Improvements

| Area | Keep From Reference | ClearWater Improvement |
| --- | --- | --- |
| Overview | Key operational counts and setup actions | Clickable command centre with drill-downs to filtered jobs, quotes, invoices, stock, and water alerts. |
| Jobs | Search, status, date, technician, pool context | Connected job detail, execution workflow, checklist, report/quote actions, follow-up and unscheduled filters. |
| Dispatch | Technician lanes and unassigned jobs | Cleaner day board with job cards, execute links, maps links, follow-up pressure, waiting states, and route placeholders. |
| Recurrence | Pattern and next-date visibility | Foundation label until automation is real; recurrence notes are captured without pretending full engine support. |
| Customers | Contact and balance visibility | Keep Customers as the main entity, with future contacts under customer records instead of a duplicate Contacts module. |
| Pools | Address, type, filter, linked contact | Show linked customer, property/site, surface, sanitiser, last water test, next job, and status. |
| Products | Product catalogue | BioGuard/Dryden Aqua product intelligence with category, purpose, water issue, application notes, safety notes, and technician review. |
| Analytics | Operational counts and charts | Practical MVP metrics first: jobs by status, technician, type, follow-ups, recurring due, and water tests. |
| Finance | Revenue and invoice summaries | Quote/invoice foundation with Xero and payments clearly marked planned. |
| Portal | Customer/support access | Customer-friendly portal showing upcoming jobs, reports, water tests, quotes, invoices, service request, and login planned notice. |

## ClearWater Design Principles

- Guided workflow over static screens.
- Fewer dead cards and more clickable drill-downs.
- Technician-first daily workflow for mobile use.
- Clear customer, property/site, and pool relationships.
- Job execution over simple job listing.
- Water testing connected to job, pool, report, and chemical guidance.
- Chemical usage connected to BioGuard products, van stock, reports, and later invoices.
- Quotes and invoices connected to job and customer context.
- Customer portal connected to service history, reports, quotes, invoices, and water test history.
- Future integrations should be visible as planned placeholders, not fake-active features.

## Deferred Deliberately

- Full Xero, payments, SMS/email, real PDF generation, real file storage, offline/mobile packaging, GraphHopper connection, full BioGuard dosing automation, and enforced authentication.
