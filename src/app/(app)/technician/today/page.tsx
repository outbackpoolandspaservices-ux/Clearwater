import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCustomerById,
  getJobById,
  getPoolById,
  getRoutePlanForTechnician,
  getSiteById,
  jobs,
} from "@/lib/mock-data";

function statusTone(status: string) {
  if (status === "Completed") {
    return "success" as const;
  }

  if (["On The Way", "In Progress"].includes(status)) {
    return "warning" as const;
  }

  return "neutral" as const;
}

export default function TechnicianTodayPage() {
  const today = "2026-05-02";
  const technicianId = "tech-sam";
  const routePlan = getRoutePlanForTechnician(technicianId, today);
  const todayJobs = jobs
    .filter((job) => job.scheduledDate === today && job.technicianId === technicianId)
    .sort((a, b) => (a.scheduledTime > b.scheduledTime ? 1 : -1));

  return (
    <SectionPage
      title="Technician Today"
      description="Mobile-friendly run sheet for assigned jobs, access notes, pool context, and technician action placeholders."
    >
      {routePlan ? (
        <section className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Today&apos;s route order
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Starts from {routePlan.startingLocation}. Route data is mock only.
              </p>
            </div>
            <StatusBadge>{routePlan.optimisationStatus}</StatusBadge>
          </div>
          <div className="mt-5 grid gap-3">
            {routePlan.stops.map((stop) => {
              const job = getJobById(stop.jobId);
              const site = job ? getSiteById(job.siteId) : undefined;
              const customer = job ? getCustomerById(job.customerId) : undefined;

              return (
                <div
                  className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 sm:grid-cols-[48px_1fr_auto] sm:items-center"
                  key={stop.id}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {stop.stopOrder}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-950">
                      {job?.scheduledTime} | {customer?.name}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {site?.address}, {site?.suburb}
                    </p>
                    <p className="mt-1 text-slate-500">
                      Travel {stop.estimatedTravelTime} | Service{" "}
                      {stop.estimatedServiceDuration}
                    </p>
                  </div>
                  <button
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                    type="button"
                  >
                    Navigation
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        {todayJobs.map((job) => {
          const customer = getCustomerById(job.customerId);
          const site = getSiteById(job.siteId);
          const pool = getPoolById(job.poolId);

          return (
            <article
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
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
                    {site?.address}, {site?.suburb}
                  </p>
                  <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-amber-800">
                    {site?.accessWarning}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Pool</p>
                  <p className="mt-1 text-slate-950">
                    {pool?.name} · {pool?.volumeLitres.toLocaleString("en-AU")} L
                  </p>
                  <p className="mt-1 text-slate-600">{pool?.sanitiserType}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                  type="button"
                >
                  Navigation
                </button>
                <button
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                  type="button"
                >
                  Send On The Way
                </button>
                <button
                  className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                  type="button"
                >
                  Start Job
                </button>
                <button
                  className="rounded-md border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  type="button"
                >
                  Complete Job
                </button>
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
