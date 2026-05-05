import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobsWithSource } from "@/features/jobs/data/jobs";
import { getWaterTestsWithSource } from "@/features/water-testing/data/water-tests";
import { recurringJobs, technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

function countBy(values: string[]) {
  return Array.from(
    values.reduce((map, value) => {
      map.set(value, (map.get(value) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  );
}

export default async function DashboardAnalyticsPage() {
  const [customers, jobsResult, waterTestsResult] = await Promise.all([
    getCustomers(),
    getJobsWithSource(),
    getWaterTestsWithSource(),
  ]);

  const completedJobs = jobsResult.jobs.filter(
    (job) => job.status === "Completed",
  );
  const followUps = jobsResult.jobs.filter((job) =>
    job.status.toLowerCase().includes("follow"),
  );
  const jobsByStatus = countBy(jobsResult.jobs.map((job) => job.status));
  const jobsByTechnician = countBy(
    jobsResult.jobs.map(
      (job) =>
        technicians.find((technician) => technician.id === job.technicianId)
          ?.name ?? "Unassigned",
    ),
  );
  const jobsByType = countBy(jobsResult.jobs.map((job) => job.jobType));

  return (
    <SectionPage
      title="Dashboard Analytics"
      description="Operational insight foundation for jobs, customers, water tests, technician workload, and follow-up pressure."
    >
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-md border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
          href="/dashboard"
        >
          Back to Dashboard
        </Link>
        <Link
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href="/dashboard/finance"
        >
          Finance View
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            href: "/jobs?status=completed",
            label: "Completed jobs this month",
            value: completedJobs.length,
          },
          {
            href: "/customers",
            label: "Active customers",
            value: customers.length,
          },
          {
            href: "/water-testing",
            label: "Water tests completed",
            value: waterTestsResult.waterTests.length,
          },
          {
            href: "/jobs?followUp=true",
            label: "Follow-ups required",
            value: followUps.length,
          },
        ].map((metric) => (
          <Link
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
            href={metric.href}
            key={metric.label}
          >
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {metric.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { rows: jobsByStatus, title: "Jobs by status", query: "status" },
          {
            rows: jobsByTechnician,
            title: "Jobs by technician",
            query: "technician",
          },
          { rows: jobsByType, title: "Jobs by type", query: "type" },
        ].map((panel) => (
          <div
            className="rounded-lg border border-slate-200 bg-white p-5"
            key={panel.title}
          >
            <h2 className="text-base font-semibold text-slate-950">
              {panel.title}
            </h2>
            <div className="mt-4 space-y-3">
              {panel.rows.map(([label, count]) => (
                <Link
                  className="flex items-center justify-between gap-4 rounded-md p-2 text-sm hover:bg-cyan-50"
                  href={`/jobs?${panel.query}=${encodeURIComponent(label)}`}
                  key={label}
                >
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="font-semibold text-cyan-700">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-950">
          Recurring jobs due
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Foundation only. Recurring service automation is planned; the MVP
          currently captures recurrence notes and patterns.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {recurringJobs.map((job) => (
            <Link
              className="rounded-md border border-slate-200 p-4 text-sm hover:border-cyan-300 hover:bg-cyan-50"
              href="/jobs?scheduled=false"
              key={job.id}
            >
              <p className="font-semibold text-slate-950">{job.frequency}</p>
              <p className="mt-1 text-slate-600">
                Next service: {job.nextServiceDate}
              </p>
              <p className="mt-1 text-cyan-700">{job.status}</p>
            </Link>
          ))}
        </div>
      </section>
    </SectionPage>
  );
}
