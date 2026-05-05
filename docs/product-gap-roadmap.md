# Product Gap Roadmap

This roadmap tracks practical gaps before ClearWater is ready for real business operations. It is intentionally narrower than a general field-service platform.

## Near-Term MVP Gaps

- Replace temporary dashboard debug/foundation notes with admin-only diagnostics once workflows are stable.
- Improve job editing and scheduling so “Schedule placeholder” becomes a real edit/schedule action.
- Add recurring job creation and recurrence engine only after one-off jobs are stable.
- Add customer-level contact people without creating a confusing separate Contacts module.
- Deepen pool detail with water test history, job history, reports, chemical notes, and next service.
- Build out Equipment Register editing, equipment service history, recurring maintenance reminders, and customer portal warranty visibility.
- Add stock detail/adjustment screens and stock movement review.
- Add quote-to-job, quote-to-invoice, and completed-job-to-invoice conversion with review screens.

## Integration Gaps

- Xero invoice/customer/payment sync.
- Payment provider links and webhook status.
- SMS and email templates for booking, on-the-way, completion, quote, invoice, and reminders.
- Vercel Blob or another storage provider for photos, documents, reports, and equipment labels.
- Warranty evidence storage for installation photos, receipts, serial/model plate photos, warranty cards/manuals, and supplier claim packs.
- GraphHopper or provider adapter for route optimisation.
- LaMotte SpinTouch import/sync.
- Real PDF report generation.

## Product Intelligence Gaps

- Verified BioGuard dosing rules with Australian product catalogue references.
- Local Alice Springs context for hard water, dust, evaporation, UV, phosphates, debris, and commercial spa risk.
- Equipment-aware salt/chlorinator guidance.
- Manufacturer/supplier warranty lookup if available, without making automatic claim decisions.
- Technician-reviewed recommendation workflow before anything customer-facing.

## Access and Mobile Gaps

- Enforced authentication and role permissions.
- Customer portal login and customer-scoped access.
- Offline/mobile capture strategy for poor signal.
- Future app packaging for Apple App Store and Google Play.
- Serial number scanning for technician mobile capture.

## Deferred Complexity

- Full accounting system, payroll, HR, franchise management, warehouse-scale inventory, and autonomous AI decisions are out of MVP scope.

## Equipment Register Future Improvements

- Warranty reminder alerts before calculated expiry dates.
- Supplier warranty claim packs that gather equipment details, serial/model evidence, proof of purchase, installation notes, and service history.
- Upload receipts, photos, manuals, and warranty cards after storage is configured.
- Customer portal warranty display for relevant installed equipment.
- Quote/invoice equipment line items that can be promoted into Equipment Register after sale/installation.
