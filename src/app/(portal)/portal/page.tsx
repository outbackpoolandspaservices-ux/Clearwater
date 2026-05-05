import {
  PortalButton,
  PortalCard,
  PortalEmptyState,
  PortalQuickActions,
  PortalShell,
  portalStatusTone,
} from "@/components/portal/portal-components";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPortalData } from "@/features/portal/portal-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function PortalPage() {
  const {
    customer,
    sites,
    pools,
    upcomingJobs,
    serviceHistory,
    waterTests,
    reports,
    quotesAwaitingApproval,
    unpaidInvoices,
  } = await getPortalData();
  const nextJob = upcomingJobs[0];
  const latestWaterTest = waterTests[0];

  return (
    <PortalShell
      title={`Welcome, ${customer.name}`}
      description="View your upcoming pool work, recent service records, water test results, quotes, invoices, and messages from Outback Pool & Spa Services."
      customerName={customer.name}
    >
      <div className="mb-5 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
        Customer portal login is planned. This MVP shows a safe demo customer
        view so Outback Pool & Spa Services can review the portal experience
        before authentication and payment links are switched on.
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PortalCard title={`${upcomingJobs.length}`} eyebrow="Upcoming jobs">
          <p className="text-sm text-slate-600">
            {nextJob
              ? `${nextJob.jobType} is scheduled for ${nextJob.scheduledDate} at ${nextJob.scheduledTime}.`
              : "No upcoming work is currently scheduled."}
          </p>
        </PortalCard>
        <PortalCard title={`${reports.length}`} eyebrow="Reports ready">
          <p className="text-sm text-slate-600">
            Service and inspection reports available in your portal.
          </p>
        </PortalCard>
        <PortalCard
          title={`${quotesAwaitingApproval.length}`}
          eyebrow="Quotes waiting"
        >
          <p className="text-sm text-slate-600">
            Review quote details and approve or decline when ready.
          </p>
        </PortalCard>
        <PortalCard title={`${unpaidInvoices.length}`} eyebrow="Invoices due">
          <p className="text-sm text-slate-600">
            Payment links are placeholders until the payment provider is added.
          </p>
        </PortalCard>
      </div>

      <div className="mt-5">
        <PortalCard title="Quick actions" eyebrow="How can we help?">
          <PortalQuickActions />
        </PortalCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <PortalCard
          title="Upcoming service"
          eyebrow="Next visit"
          action={<PortalButton href="/portal/jobs">View Jobs</PortalButton>}
        >
          {nextJob ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{nextJob.jobType}</p>
                <StatusBadge tone={portalStatusTone(nextJob.status)}>
                  {nextJob.status}
                </StatusBadge>
              </div>
              <p className="text-slate-600">
                {nextJob.scheduledDate} at {nextJob.scheduledTime}
              </p>
              <p className="text-slate-600">
                {sites[0]?.address}, {sites[0]?.suburb}
              </p>
              <p className="rounded bg-amber-50 p-3 font-semibold text-amber-800">
                Access note: {sites[0]?.accessWarning}
              </p>
            </div>
          ) : (
            <PortalEmptyState message="No upcoming jobs are scheduled yet." />
          )}
        </PortalCard>

        <PortalCard
          title="Latest water test"
          eyebrow={pools[0]?.name}
          action={<PortalButton href="/portal/reports">View Reports</PortalButton>}
        >
          {latestWaterTest ? (
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">
                  {latestWaterTest.date} at {latestWaterTest.time}
                </span>
                <StatusBadge tone={portalStatusTone(latestWaterTest.alertStatus)}>
                  {latestWaterTest.alertStatus}
                </StatusBadge>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-slate-500">Free chlorine</dt>
                  <dd className="font-bold text-slate-950">
                    {latestWaterTest.freeChlorine}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">pH</dt>
                  <dd className="font-bold text-slate-950">
                    {latestWaterTest.ph}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Salt</dt>
                  <dd className="font-bold text-slate-950">
                    {latestWaterTest.salt}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Phosphate</dt>
                  <dd className="font-bold text-slate-950">
                    {latestWaterTest.phosphate}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <PortalEmptyState message="No water tests are available yet." />
          )}
        </PortalCard>

        <PortalCard
          title="Account snapshot"
          eyebrow="Billing and approvals"
          action={<PortalButton href="/portal/invoices">View Invoices</PortalButton>}
        >
          <div className="space-y-3 text-sm">
            <p className="flex justify-between gap-4">
              <span className="text-slate-600">Outstanding balance</span>
              <span className="font-black text-slate-950">
                {customer.outstandingBalance}
              </span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-600">Open quotes</span>
              <span className="font-bold text-slate-950">
                {quotesAwaitingApproval.length}
              </span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-600">Service history</span>
              <span className="font-bold text-slate-950">
                {serviceHistory.length} completed
              </span>
            </p>
          </div>
        </PortalCard>
      </div>
    </PortalShell>
  );
}
