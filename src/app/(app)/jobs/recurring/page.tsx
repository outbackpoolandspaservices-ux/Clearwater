import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomers } from "@/features/customers/data/customers";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { recurringJobs, technicians } from "@/lib/mock-data";

export default async function RecurringJobsPage() {
  const [customers, pools, sites] = await Promise.all([
    getCustomers(),
    getPools(),
    getSites(),
  ]);

  return (
    <SectionPage
      title="Recurring Jobs"
      description="Foundation list for regular service patterns. Automation is planned; current version captures recurrence notes and next dates."
    >
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
        Recurring service automation is planned. Current version captures
        recurrence notes/patterns and keeps dispatchers aware of upcoming work.
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {recurringJobs.map((recurringJob) => {
          const customer = customers.find(
            (item) => item.id === recurringJob.customerId,
          );
          const site = sites.find((item) => item.id === recurringJob.siteId);
          const pool = pools.find((item) => item.id === recurringJob.poolId);
          const technician = technicians.find(
            (item) => item.id === recurringJob.technicianId,
          );

          return (
            <Link
              className="rounded-lg border border-slate-200 bg-white p-5 hover:border-cyan-300 hover:bg-cyan-50"
              href="/jobs?scheduled=false"
              key={recurringJob.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                    {recurringJob.frequency}
                  </p>
                  <h2 className="mt-2 font-semibold text-slate-950">
                    {customer?.name ?? "Customer not linked"}
                  </h2>
                </div>
                <StatusBadge>{recurringJob.status}</StatusBadge>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">Property/Site</dt>
                  <dd className="mt-1 text-slate-950">{site?.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Pool</dt>
                  <dd className="mt-1 text-slate-950">{pool?.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Job type</dt>
                  <dd className="mt-1 text-slate-950">Regular service</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Technician</dt>
                  <dd className="mt-1 text-slate-950">{technician?.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Next due</dt>
                  <dd className="mt-1 text-slate-950">
                    {recurringJob.nextServiceDate}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Window</dt>
                  <dd className="mt-1 text-slate-950">{recurringJob.window}</dd>
                </div>
              </dl>
            </Link>
          );
        })}
      </section>
    </SectionPage>
  );
}
