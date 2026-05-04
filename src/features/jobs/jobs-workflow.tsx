"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CustomerRecord } from "@/features/customers/data/customers";
import type { JobRecord } from "@/features/jobs/data/jobs";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";

const allValue = "all";
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

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function priorityTone(priority: string) {
  if (priority === "High") {
    return "danger" as const;
  }

  if (priority === "Urgent") {
    return "warning" as const;
  }

  return "neutral" as const;
}

function statusTone(status: string) {
  if (["Completed", "Paid"].includes(status)) {
    return "success" as const;
  }

  if (["Quote Required", "Ready to Schedule", "Access check"].includes(status)) {
    return "warning" as const;
  }

  return "neutral" as const;
}

export function JobsWorkflow({
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(allValue);
  const [technician, setTechnician] = useState(allValue);
  const [jobType, setJobType] = useState(allValue);
  const [priority, setPriority] = useState(allValue);

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const site = sites.find((item) => item.id === job.siteId);
      const pool = pools.find((item) => item.id === job.poolId);
      const assignedTechnician = technicians.find(
        (item) => item.id === job.technicianId,
      );
      const haystack = [
        job.jobNumber,
        job.jobType,
        job.title,
        job.customer,
        site?.name,
        site?.address,
        pool?.name,
        assignedTechnician?.name,
        job.status,
        job.priority,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!searchText || haystack.includes(searchText)) &&
        (status === allValue || job.status === status) &&
        (technician === allValue || job.technicianId === technician) &&
        (jobType === allValue || job.jobType === jobType) &&
        (priority === allValue || job.priority === priority)
      );
    });
  }, [jobType, jobs, pools, priority, search, sites, status, technician, technicians]);

  const statuses = unique(jobs.map((job) => job.status));
  const jobTypes = unique(jobs.map((job) => job.jobType));
  const priorities = unique(jobs.map((job) => job.priority));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_repeat(4,1fr)]">
            <input
              className="min-h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs, customers, sites, pools, or technicians"
              type="search"
              value={search}
            />
            <select
              className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option value={allValue}>All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              onChange={(event) => setTechnician(event.target.value)}
              value={technician}
            >
              <option value={allValue}>All technicians</option>
              {unique(jobs.map((job) => job.technicianId).filter(Boolean)).map((id) => {
                const assignedTechnician = technicians.find((item) => item.id === id);

                return (
                  <option key={id} value={id}>
                    {assignedTechnician?.name ?? id}
                  </option>
                );
              })}
            </select>
            <select
              className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              onChange={(event) => setJobType(event.target.value)}
              value={jobType}
            >
              <option value={allValue}>All job types</option>
              {jobTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              onChange={(event) => setPriority(event.target.value)}
              value={priority}
            >
              <option value={allValue}>All priorities</option>
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
            href="/jobs/new"
          >
            Create Job
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">Job queue</h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredJobs.length} matching job
            {filteredJobs.length === 1 ? "" : "s"}
          </p>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1160px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Job</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Site</th>
                  <th className="px-5 py-3 font-semibold">Pool</th>
                  <th className="px-5 py-3 font-semibold">Scheduled</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => {
                  const customer = customers.find(
                    (item) => item.id === job.customerId,
                  );
                  const site = sites.find((item) => item.id === job.siteId);
                  const pool = pools.find((item) => item.id === job.poolId);
                  const assignedTechnician = technicians.find(
                    (item) => item.id === job.technicianId,
                  );

                  return (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          className="font-semibold text-slate-950 hover:text-cyan-700"
                          href={`/jobs/${job.id}`}
                        >
                          {job.jobNumber}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {job.title}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {job.jobType}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {customer?.name ?? job.customer}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {site?.name ?? "No site"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {pool?.name ?? "No pool"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {job.scheduledDate}
                        <span className="block text-xs text-slate-500">
                          {job.scheduledTime}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {assignedTechnician?.name ?? "Unassigned"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={statusTone(job.status)}>
                          {job.status}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge tone={priorityTone(job.priority)}>
                          {job.priority}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              description="Adjust the search or filters to bring jobs back into view."
              title="No jobs match these filters"
            />
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Recurring jobs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Mock service schedules ready for the future recurrence workflow.
          </p>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {recurringJobs.map((recurringJob) => {
            const customer = customers.find(
              (item) => item.id === recurringJob.customerId,
            );
            const site = sites.find((item) => item.id === recurringJob.siteId);
            const pool = pools.find((item) => item.id === recurringJob.poolId);
            const assignedTechnician = technicians.find(
              (item) => item.id === recurringJob.technicianId,
            );

            return (
              <div
                key={recurringJob.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                      {recurringJob.frequency}
                    </p>
                    <h3 className="mt-2 font-semibold text-slate-950">
                      {customer?.name}
                    </h3>
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
                    <dd className="mt-1 text-slate-950">
                      {assignedTechnician?.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">
                      Next service
                    </dt>
                    <dd className="mt-1 text-slate-950">
                      {recurringJob.nextServiceDate}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-slate-500">Window</dt>
                    <dd className="mt-1 text-slate-950">
                      {recurringJob.window}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
