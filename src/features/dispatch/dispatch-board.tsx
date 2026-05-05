"use client";

import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import type { CustomerRecord } from "@/features/customers/data/customers";
import type { JobRecord } from "@/features/jobs/data/jobs";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";

const tabs = ["Today", "Week", "Unscheduled", "Recurring"] as const;
type DispatchTab = (typeof tabs)[number];
type TechnicianRecord = {
  id: string;
  name: string;
  role: string;
};
type RecurringJobRecord = {
  customerId: string;
  frequency: string;
  id: string;
  nextServiceDate: string;
  poolId: string;
  siteId: string;
  status: string;
  technicianId: string;
  window: string;
};

function statusTone(status: string) {
  if (["Completed", "Paid"].includes(status)) return "success" as const;
  if (["In Progress", "In progress", "On The Way", "Ready to Schedule"].includes(status)) {
    return "warning" as const;
  }

  return "neutral" as const;
}

function priorityTone(priority: string) {
  return priority === "High" || priority === "Urgent"
    ? ("danger" as const)
    : ("neutral" as const);
}

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Darwin",
  }).format(new Date());
}

function toIsoDate(value: string) {
  if (!value || value === "Unscheduled" || value === "Not dated") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Darwin",
  }).format(parsed);
}

function isTodayJob(job: JobRecord) {
  return job.date === "Today" || toIsoDate(job.scheduledDate) === todayIso();
}

function isUnscheduledJob(job: JobRecord) {
  return (
    job.date === "Unscheduled" ||
    job.scheduledDate === "Unscheduled" ||
    job.scheduledTime === "Unscheduled" ||
    ["Draft", "Ready", "Ready to Schedule"].includes(job.status)
  );
}

function JobCard({
  customers,
  job,
  pools,
  sites,
  technicians,
}: {
  customers: CustomerRecord[];
  job: JobRecord;
  pools: PoolRecord[];
  sites: SiteRecord[];
  technicians: TechnicianRecord[];
}) {
  const customer = customers.find((item) => item.id === job.customerId);
  const site = sites.find((item) => item.id === job.siteId);
  const pool = pools.find((item) => item.id === job.poolId);
  const technician = technicians.find((item) => item.id === job.technicianId);
  const mapsHref = site?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${site.address}, ${site.suburb}`,
      )}`
    : null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            className="text-sm font-semibold text-slate-950 hover:text-cyan-700"
            href={`/jobs/${job.id}`}
          >
            {job.jobNumber}
          </Link>
          <p className="mt-1 text-sm text-slate-600">{job.jobType}</p>
        </div>
        {job.routeOrder ? (
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
            #{job.routeOrder}
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="font-medium text-slate-950">
          {customer?.name ?? job.customer}
        </p>
        <p className="text-slate-600">
          {site?.suburb ?? "No suburb"} | {site?.name ?? "No site"}
        </p>
        <p className="text-slate-600">{pool?.name ?? "No pool linked"}</p>
        <p className="text-slate-600">
          {job.scheduledTime} | {job.estimatedDuration}
        </p>
        <p className="text-slate-600">{technician?.name ?? "Unassigned"}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge tone={statusTone(job.status)}>{job.status}</StatusBadge>
        <StatusBadge tone={priorityTone(job.priority)}>{job.priority}</StatusBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <Link
          className="rounded-md border border-cyan-200 px-2 py-1 text-cyan-700 hover:bg-cyan-50"
          href={`/jobs/${job.id}/execute`}
        >
          Execute
        </Link>
        <Link
          className="rounded-md border border-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50"
          href={`/jobs/${job.id}?action=schedule`}
        >
          Schedule placeholder
        </Link>
        {mapsHref ? (
          <Link
            className="rounded-md border border-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50"
            href={mapsHref}
            rel="noreferrer"
            target="_blank"
          >
            Open in Maps
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function DispatchBoard({
  customers,
  jobs,
  pools,
  recurringJobs,
  sites,
  technicians,
}: {
  customers: CustomerRecord[];
  jobs: JobRecord[];
  pools: PoolRecord[];
  recurringJobs: RecurringJobRecord[];
  sites: SiteRecord[];
  technicians: TechnicianRecord[];
}) {
  const [activeTab, setActiveTab] = useState<DispatchTab>("Today");
  const scheduledJobs = jobs.filter((job) => !isUnscheduledJob(job));
  const todayJobs = scheduledJobs.filter(isTodayJob);
  const visibleTodayJobs = todayJobs.length > 0 ? todayJobs : scheduledJobs.slice(0, 6);
  const unscheduledJobs = jobs.filter(isUnscheduledJob);
  const followUpJobs = jobs.filter((job) =>
    job.status.toLowerCase().includes("follow"),
  );
  const waitingJobs = jobs.filter((job) =>
    ["Waiting on parts", "Waiting on customer"].includes(job.status),
  );

  const cardProps = { customers, pools, sites, technicians };

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
              Optimise Route Placeholder
            </Link>
            <Link
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              href="/jobs/new"
            >
              Schedule Job
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm hover:bg-amber-100"
          href="/jobs?scheduled=false"
        >
          <p className="font-semibold text-amber-950">Unscheduled jobs</p>
          <p className="mt-2 text-2xl font-bold text-amber-950">
            {unscheduledJobs.length}
          </p>
        </Link>
        <Link
          className="rounded-lg border border-slate-200 bg-white p-4 text-sm hover:bg-cyan-50"
          href="/jobs?followUp=true"
        >
          <p className="font-semibold text-slate-950">Follow-up required</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">
            {followUpJobs.length}
          </p>
        </Link>
        <Link
          className="rounded-lg border border-slate-200 bg-white p-4 text-sm hover:bg-cyan-50"
          href="/jobs?status=waiting-on-customer"
        >
          <p className="font-semibold text-slate-950">
            Waiting on customer/parts
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-950">
            {waitingJobs.length}
          </p>
        </Link>
      </section>

      {activeTab === "Today" ? (
        <section className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_320px]">
          {technicians.map((technician) => {
            const technicianJobs = visibleTodayJobs
              .filter((job) => job.technicianId === technician.id)
              .sort((a, b) => (a.routeOrder ?? 99) - (b.routeOrder ?? 99));

            return (
              <div
                key={technician.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4">
                  <Link
                    className="font-semibold text-slate-950 hover:text-cyan-700"
                    href={`/jobs?technician=${encodeURIComponent(technician.id)}`}
                  >
                    {technician.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {technician.role} | {technicianJobs.length} jobs
                  </p>
                </div>
                <div className="space-y-3">
                  {technicianJobs.length > 0 ? (
                    technicianJobs.map((job) => (
                      <JobCard key={job.id} job={job} {...cardProps} />
                    ))
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
                <JobCard key={job.id} job={job} {...cardProps} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "Week" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {scheduledJobs.map((job) => (
            <JobCard key={job.id} job={job} {...cardProps} />
          ))}
        </section>
      ) : null}

      {activeTab === "Unscheduled" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {unscheduledJobs.map((job) => (
            <JobCard key={job.id} job={job} {...cardProps} />
          ))}
        </section>
      ) : null}

      {activeTab === "Recurring" ? (
        <section className="space-y-4">
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
            Recurring service automation is planned. Current version captures
            recurrence notes and patterns only.
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
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
                  key={recurringJob.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 hover:border-cyan-300 hover:bg-cyan-50"
                  href="/jobs?scheduled=false"
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
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
