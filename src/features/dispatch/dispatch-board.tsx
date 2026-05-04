"use client";

import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCustomerById,
  getPoolById,
  getSiteById,
  getTechnicianById,
  jobs,
  recurringJobs,
  technicians,
} from "@/lib/mock-data";

const tabs = ["Today", "Week", "Unscheduled", "Recurring"] as const;
type DispatchTab = (typeof tabs)[number];

function statusTone(status: string) {
  if (["Completed", "Paid"].includes(status)) {
    return "success" as const;
  }

  if (["In Progress", "On The Way", "Ready to Schedule"].includes(status)) {
    return "warning" as const;
  }

  return "neutral" as const;
}

function priorityTone(priority: string) {
  return priority === "High" ? ("danger" as const) : ("neutral" as const);
}

function JobCard({ job }: { job: (typeof jobs)[number] }) {
  const customer = getCustomerById(job.customerId);
  const site = getSiteById(job.siteId);
  const pool = getPoolById(job.poolId);
  const technician = getTechnicianById(job.technicianId);

  return (
    <Link
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300"
      href={`/jobs/${job.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {job.jobNumber}
          </p>
          <p className="mt-1 text-sm text-slate-600">{job.jobType}</p>
        </div>
        {job.routeOrder ? (
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
            #{job.routeOrder}
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="font-medium text-slate-950">{customer?.name ?? job.customer}</p>
        <p className="text-slate-600">
          {site?.suburb ?? "No suburb"} · {site?.name ?? "No site"}
        </p>
        <p className="text-slate-600">{pool?.name ?? "No pool linked"}</p>
        <p className="text-slate-600">
          {job.scheduledTime} · {job.estimatedDuration}
        </p>
        <p className="text-slate-600">{technician?.name ?? "Unassigned"}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge tone={statusTone(job.status)}>{job.status}</StatusBadge>
        <StatusBadge tone={priorityTone(job.priority)}>{job.priority}</StatusBadge>
      </div>
    </Link>
  );
}

export function DispatchBoard() {
  const [activeTab, setActiveTab] = useState<DispatchTab>("Today");
  const today = "2026-05-02";
  const scheduledJobs = jobs.filter((job) => job.scheduledDate !== "Unscheduled");
  const todayJobs = scheduledJobs.filter((job) => job.scheduledDate === today);
  const unscheduledJobs = jobs.filter(
    (job) => job.scheduledDate === "Unscheduled" || job.status === "Ready to Schedule",
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={[
                  "rounded-md px-3 py-2 text-sm font-semibold",
                  activeTab === tab
                    ? "bg-cyan-600 text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              href="/routing"
            >
              View Route
            </Link>
            <Link
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              href="/routing"
            >
              Optimise Route
            </Link>
            {["Schedule Job", "Send Daily Run"].map((action) => (
              <button
                key={action}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeTab === "Today" ? (
        <section className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_320px]">
          {technicians.map((technician) => {
            const technicianJobs = todayJobs
              .filter((job) => job.technicianId === technician.id)
              .sort((a, b) => (a.routeOrder ?? 99) - (b.routeOrder ?? 99));

            return (
              <div
                key={technician.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4">
                  <h2 className="font-semibold text-slate-950">
                    {technician.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{technician.role}</p>
                </div>
                <div className="space-y-3">
                  {technicianJobs.length > 0 ? (
                    technicianJobs.map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                      No jobs assigned today.
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h2 className="font-semibold text-slate-950">Unscheduled</h2>
            <p className="mt-1 text-sm text-slate-600">
              Jobs waiting for a calendar slot.
            </p>
            <div className="mt-4 space-y-3">
              {unscheduledJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "Week" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {scheduledJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      ) : null}

      {activeTab === "Unscheduled" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {unscheduledJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      ) : null}

      {activeTab === "Recurring" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {recurringJobs.map((recurringJob) => {
            const customer = getCustomerById(recurringJob.customerId);
            const site = getSiteById(recurringJob.siteId);
            const pool = getPoolById(recurringJob.poolId);
            const technician = getTechnicianById(recurringJob.technicianId);

            return (
              <div
                key={recurringJob.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                      {recurringJob.frequency}
                    </p>
                    <h2 className="mt-2 font-semibold text-slate-950">
                      {customer?.name}
                    </h2>
                  </div>
                  <StatusBadge tone={statusTone(recurringJob.status)}>
                    {recurringJob.status}
                  </StatusBadge>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-slate-500">Site</dt>
                    <dd className="mt-1 text-slate-950">{site?.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Pool</dt>
                    <dd className="mt-1 text-slate-950">{pool?.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Technician</dt>
                    <dd className="mt-1 text-slate-950">{technician?.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Next service</dt>
                    <dd className="mt-1 text-slate-950">
                      {recurringJob.nextServiceDate}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
