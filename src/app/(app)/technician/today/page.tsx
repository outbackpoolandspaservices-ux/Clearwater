import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobsWithSource, type JobRecord } from "@/features/jobs/data/jobs";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

function statusTone(status: string) {
  if (status === "Completed") {
    return "success" as const;
  }

  if (["On The Way", "On the Way", "In Progress", "In progress"].includes(status)) {
    return "warning" as const;
  }

  return "neutral" as const;
}

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Darwin",
  }).format(new Date());
}

function sortByRunOrder(a: JobRecord, b: JobRecord) {
  if (a.routeOrder && b.routeOrder) {
    return a.routeOrder - b.routeOrder;
  }

  return a.scheduledTime > b.scheduledTime ? 1 : -1;
}

export default async function TechnicianTodayPage() {
  const [{ jobs }, customers, pools, sites] = await Promise.all([
    getJobsWithSource(),
    getCustomers(),
    getPools(),
    getSites(),
  ]);
  const today = todayIso();
  const scheduledToday = jobs.filter(
    (job) =>
      job.scheduledDate === today ||
      job.date === today ||
      job.scheduledDate === "Today",
  );
  const activeJobs = scheduledToday.length > 0 ? scheduledToday : jobs;
  const visibleJobs = activeJobs
    .filter((job) => job.status !== "Completed" || scheduledToday.length > 0)
    .sort(sortByRunOrder);

  return (
    <SectionPage
      title="Technician Today"
      description="Mobile-friendly run sheet for assigned jobs, access notes, pool context, navigation, and job execution."
    >
      <section className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Today&apos;s route order
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Showing scheduled work for {today}. Route order and travel times
              are placeholders until routing is connected.
            </p>
          </div>
          <StatusBadge>Field workflow</StatusBadge>
        </div>

        {visibleJobs.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {visibleJobs.map((job, index) => {
              const site = sites.find((item) => item.id === job.siteId);
              const customer = customers.find((item) => item.id === job.customerId);

              return (
                <div
                  className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 sm:grid-cols-[48px_1fr_auto] sm:items-center"
                  key={job.id}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {job.routeOrder ?? index + 1}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-950">
                      {job.scheduledTime} | {customer?.name ?? job.customer}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {site?.address ?? "Address not recorded"}
                      {site?.suburb ? `, ${site.suburb}` : ""}
                    </p>
                    <p className="mt-1 text-slate-500">
                      Service {job.estimatedDuration} | {job.jobType}
                    </p>
                  </div>
                  {site?.address ? (
                    <Link
                      className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${site.address}, ${site.suburb}`,
                      )}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Navigation
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              description="No assigned jobs are available from the current data source."
              title="No jobs for today"
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {visibleJobs.map((job) => {
          const customer = customers.find((item) => item.id === job.customerId);
          const site = sites.find((item) => item.id === job.siteId);
          const pool = pools.find((item) => item.id === job.poolId);
          const technician = technicians.find(
            (item) => item.id === job.technicianId,
          );

          return (
            <article
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              key={job.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cyan-700">
                    {job.scheduledTime}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    {job.jobNumber}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{job.jobType}</p>
                </div>
                <StatusBadge tone={statusTone(job.status)}>
                  {job.status}
                </StatusBadge>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-slate-500">Customer</p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {customer?.name ?? job.customer}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Site</p>
                  <p className="mt-1 text-slate-950">
                    {site?.address ?? "Address not recorded"}
                    {site?.suburb ? `, ${site.suburb}` : ""}
                  </p>
                  {site?.accessWarning ? (
                    <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-amber-800">
                      {site.accessWarning}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="font-medium text-slate-500">Pool</p>
                  <p className="mt-1 text-slate-950">
                    {pool?.name ?? "No pool linked"}
                    {pool?.volumeLitres
                      ? ` - ${pool.volumeLitres.toLocaleString("en-AU")} L`
                      : ""}
                  </p>
                  <p className="mt-1 text-slate-600">
                    {pool?.sanitiserType ?? "Sanitiser not recorded"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Technician</p>
                  <p className="mt-1 text-slate-950">
                    {technician?.name ?? "Unassigned"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {site?.address ? (
                  <Link
                    className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${site.address}, ${site.suburb}`,
                    )}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Navigation
                  </Link>
                ) : null}
                <Link
                  className="rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-cyan-700"
                  href={`/jobs/${job.id}/execute`}
                >
                  Start / Execute Job
                </Link>
                <Link
                  className="rounded-md border border-emerald-200 px-3 py-2 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  href={`/jobs/${job.id}/execute`}
                >
                  Complete Job
                </Link>
              </div>

              <Link
                className="mt-4 block text-center text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                href={`/jobs/${job.id}`}
              >
                Open job details
              </Link>
            </article>
          );
        })}
      </section>
    </SectionPage>
  );
}
