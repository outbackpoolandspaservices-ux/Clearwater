import {
  PortalButton,
  PortalCard,
  PortalEmptyState,
  PortalShell,
  portalStatusTone,
} from "@/components/portal/portal-components";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPortalData } from "@/features/portal/portal-data";

export default function PortalJobsPage() {
  const { customer, jobs, sites, pools } = getPortalData();

  return (
    <PortalShell
      title="Your Jobs"
      description="Track upcoming pool service work and review recent job history in plain, customer-friendly language."
      customerName={customer.name}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <PortalButton variant="primary">Request a Service</PortalButton>
        <PortalButton>Send Message</PortalButton>
      </div>

      {jobs.length ? (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const site = sites.find((item) => item.id === job.siteId);
            const pool = pools.find((item) => item.id === job.poolId);

            return (
              <PortalCard key={job.id} title={job.jobType} eyebrow={job.jobNumber}>
                <div className="grid gap-4 text-sm md:grid-cols-[1.5fr_1fr]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={portalStatusTone(job.status)}>
                        {job.status}
                      </StatusBadge>
                      <StatusBadge>{job.priority} priority</StatusBadge>
                    </div>
                    <p className="font-semibold text-slate-950">
                      {job.scheduledDate} at {job.scheduledTime}
                    </p>
                    <p className="text-slate-600">
                      {site?.address}, {site?.suburb}
                    </p>
                    <p className="text-slate-600">
                      Pool: {pool?.name} | {pool?.surfaceType} |{" "}
                      {pool?.sanitiserType}
                    </p>
                    {site?.accessWarning ? (
                      <p className="rounded bg-amber-50 p-3 font-semibold text-amber-800">
                        Access note: {site.accessWarning}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <PortalButton href={`/jobs/${job.id}`}>View Job</PortalButton>
                    <PortalButton>Send Message</PortalButton>
                  </div>
                </div>
              </PortalCard>
            );
          })}
        </div>
      ) : (
        <PortalEmptyState message="No jobs are available in this customer portal preview." />
      )}
    </PortalShell>
  );
}
