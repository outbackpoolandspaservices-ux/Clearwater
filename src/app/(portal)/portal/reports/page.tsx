import {
  PortalButton,
  PortalCard,
  PortalEmptyState,
  PortalShell,
  portalStatusTone,
} from "@/components/portal/portal-components";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPortalData } from "@/features/portal/portal-data";
import { getPoolById, getSiteById } from "@/lib/mock-data";

export default function PortalReportsPage() {
  const { customer, reports, waterTests } = getPortalData();

  return (
    <PortalShell
      title="Reports and Water Tests"
      description="View service reports, inspection reports, and recent water test summaries shared by Outback Pool & Spa Services."
      customerName={customer.name}
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <PortalCard title="Service and inspection reports" eyebrow="Documents">
          {reports.length ? (
            <div className="space-y-4">
              {reports.map((report) => {
                const site = getSiteById(report.siteId);
                const pool = getPoolById(report.poolId);

                return (
                  <div
                    key={report.id}
                    className="rounded border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {report.reportNumber} | {report.reportType}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {site?.name} | {pool?.name} | {report.reportDate}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge tone={portalStatusTone(report.status)}>
                          {report.status}
                        </StatusBadge>
                        <StatusBadge tone={portalStatusTone(report.sentStatus)}>
                          {report.sentStatus}
                        </StatusBadge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {report.customerSummary}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <PortalButton href={`/reports/${report.id}`}>
                        View Report
                      </PortalButton>
                      <PortalButton>Download PDF</PortalButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <PortalEmptyState message="No reports have been shared yet." />
          )}
        </PortalCard>

        <PortalCard title="Recent water tests" eyebrow="Pool health">
          {waterTests.length ? (
            <div className="space-y-3">
              {waterTests.map((test) => (
                <div
                  key={test.id}
                  className="rounded border border-slate-200 p-4 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">
                        {test.date} at {test.time}
                      </p>
                      <p className="text-slate-600">
                        FC {test.freeChlorine} | pH {test.ph}
                      </p>
                    </div>
                    <StatusBadge tone={portalStatusTone(test.alertStatus)}>
                      {test.alertStatus}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PortalEmptyState message="No water test results are available yet." />
          )}
        </PortalCard>
      </div>
    </PortalShell>
  );
}
