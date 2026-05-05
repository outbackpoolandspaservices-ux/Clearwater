import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getChemicalProducts } from "@/features/chemicals/data/chemicals";
import { getInvoicesWithSource } from "@/features/invoices/data/invoices";
import { getJobsWithSource, type JobRecord } from "@/features/jobs/data/jobs";
import { getQuotesWithSource } from "@/features/quotes/data/quotes";
import { getStockWithSource } from "@/features/stock/data/stock";
import { getWaterTestsWithSource } from "@/features/water-testing/data/water-tests";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

const quickActions = [
  { href: "/jobs/new", label: "Create Job" },
  { href: "/customers/new", label: "Add Customer" },
  { href: "/properties/new", label: "Add Property/Site" },
  { href: "/pools/new", label: "Add Pool" },
  { href: "/water-testing/new", label: "Add Water Test" },
  { href: "/quotes/new", label: "Create Quote" },
  { href: "/invoices/new", label: "Create Invoice" },
  { href: "/stock/new", label: "Add Stock" },
];

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Darwin",
  }).format(new Date());
}

function toIsoDate(value: string) {
  if (!value || value === "Unscheduled" || value === "Not dated") {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

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

function statusSlug(status: string) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export default async function DashboardPage() {
  const [jobsResult, quotesResult, invoicesResult, stockResult, products, testsResult] =
    await Promise.all([
      getJobsWithSource(),
      getQuotesWithSource(),
      getInvoicesWithSource(),
      getStockWithSource(),
      getChemicalProducts(),
      getWaterTestsWithSource(),
    ]);

  const todayJobs = jobsResult.jobs.filter(isTodayJob);
  const visibleTodayJobs =
    todayJobs.length > 0
      ? todayJobs.slice(0, 5)
      : jobsResult.jobs.filter((job) => !isUnscheduledJob(job)).slice(0, 5);
  const unscheduledJobs = jobsResult.jobs.filter(isUnscheduledJob);
  const pendingQuotes = quotesResult.quotes.filter((quote) =>
    ["Draft", "Sent", "Pending", "Awaiting approval"].includes(quote.status),
  );
  const unpaidInvoices = invoicesResult.invoices.filter((invoice) =>
    ["Unpaid", "Overdue", "Part paid", "Partially paid"].includes(
      invoice.paymentStatus,
    ),
  );
  const lowStock = stockResult.stock.filter(
    (stock) => stock.stockStatus === "Low stock",
  );
  const waterAlerts = testsResult.waterTests.filter(
    (test) =>
      test.alerts.length > 0 ||
      !["Balanced", "OK", "Ok"].includes(test.alertStatus),
  );

  const workload = technicians.map((technician) => {
    const assignedJobs = jobsResult.jobs.filter(
      (job) => job.technicianId === technician.id,
    );

    return {
      ...technician,
      jobs: assignedJobs.length,
      load:
        assignedJobs.length >= 5
          ? "Full"
          : assignedJobs.length >= 3
            ? "Steady"
            : "Available",
    };
  });

  const completedToday = todayJobs.filter(
    (job) => job.status === "Completed",
  ).length;
  const inProgressToday = todayJobs.filter((job) =>
    ["In Progress", "In progress"].includes(job.status),
  ).length;
  const recentActivity = [
    ...jobsResult.jobs.slice(0, 3).map((job) => ({
      href: `/jobs/${job.id}`,
      label: `${job.jobNumber}: ${job.title}`,
      meta: `Job ${job.status.toLowerCase()} for ${job.customer}`,
    })),
    ...testsResult.waterTests.slice(0, 2).map((test) => ({
      href: `/water-testing/${test.id}`,
      label: test.summary || "Water test recorded",
      meta: `${test.date} water chemistry review`,
    })),
    ...quotesResult.quotes.slice(0, 2).map((quote) => ({
      href: `/quotes/${quote.id}`,
      label: `${quote.number}: ${quote.title}`,
      meta: `Quote ${quote.status.toLowerCase()}`,
    })),
  ].slice(0, 6);

  return (
    <SectionPage
      title="Dashboard"
      description="A clickable command centre for jobs, dispatch pressure, unpaid invoices, low stock, and water chemistry exceptions."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50">
          <Link className="block" href="/jobs?date=today">
            <p className="text-sm font-medium text-slate-500">
              Today&apos;s jobs
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {todayJobs.length}
            </p>
            <p className="mt-2 text-sm text-cyan-700">
              Open today&apos;s scheduled work
            </p>
          </Link>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <Link
              className="rounded-full bg-white px-2 py-1 text-slate-600 hover:text-cyan-800"
              href="/jobs?date=today&status=completed"
            >
              {completedToday} completed
            </Link>
            <Link
              className="rounded-full bg-white px-2 py-1 text-slate-600 hover:text-cyan-800"
              href="/jobs?date=today&status=in-progress"
            >
              {inProgressToday} in progress
            </Link>
          </div>
        </div>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/jobs?scheduled=false"
        >
          <p className="text-sm font-medium text-slate-500">Unscheduled jobs</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {unscheduledJobs.length}
          </p>
          <p className="mt-2 text-sm text-cyan-700">Needs dispatch review</p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/quotes?status=pending"
        >
          <p className="text-sm font-medium text-slate-500">Pending quotes</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {pendingQuotes.length}
          </p>
          <p className="mt-2 text-sm text-cyan-700">
            Draft or sent quotes awaiting approval
          </p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/invoices?status=unpaid"
        >
          <p className="text-sm font-medium text-slate-500">Unpaid invoices</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {unpaidInvoices.length}
          </p>
          <p className="mt-2 text-sm text-cyan-700">
            Unpaid, part paid, or overdue
          </p>
        </Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Today&apos;s jobs
            </h2>
            <Link
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              href="/jobs?date=today"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {visibleTodayJobs.map((job) => (
              <div
                key={job.id}
                className="grid gap-2 rounded-md border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition hover:border-cyan-200 hover:bg-cyan-50 md:grid-cols-[90px_1fr_150px_170px]"
              >
                <p className="font-medium text-slate-500">
                  {job.scheduledTime}
                </p>
                <Link className="block" href={`/jobs/${job.id}`}>
                  <p className="font-semibold text-slate-950 hover:text-cyan-700">
                    {job.title}
                  </p>
                  <p className="mt-1 text-slate-600">{job.customer}</p>
                </Link>
                <Link
                  className="text-slate-600 hover:text-cyan-700"
                  href={`/jobs?technician=${encodeURIComponent(job.technicianId)}`}
                >
                  {technicians.find((tech) => tech.id === job.technicianId)
                    ?.name ?? "Unassigned"}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                    href={`/jobs?status=${encodeURIComponent(statusSlug(job.status))}`}
                  >
                    {job.status}
                  </Link>
                  <Link
                    className="rounded-md border border-cyan-200 px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-white"
                    href={`/jobs/${job.id}/execute`}
                  >
                    Execute
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Quick actions
          </h2>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                className="rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
                href={action.href}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/dashboard/analytics"
        >
          <p className="text-sm font-medium text-slate-500">
            Business analytics
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-950">
            Jobs, customers, water tests
          </p>
          <p className="mt-2 text-sm text-cyan-700">
            Review operational trends and follow-ups
          </p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:bg-cyan-50"
          href="/dashboard/finance"
        >
          <p className="text-sm font-medium text-slate-500">Finance view</p>
          <p className="mt-3 text-xl font-semibold text-slate-950">
            Quotes, invoices, revenue placeholders
          </p>
          <p className="mt-2 text-sm text-cyan-700">
            Xero and payments remain planned
          </p>
        </Link>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Recent activity
          </h2>
          <div className="mt-4 space-y-3">
            {recentActivity.map((activity) => (
              <Link
                className="block rounded-md p-2 text-sm transition hover:bg-cyan-50"
                href={activity.href}
                key={`${activity.href}-${activity.label}`}
              >
                <p className="font-medium text-slate-950">{activity.label}</p>
                <p className="mt-1 text-slate-600">{activity.meta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Unscheduled jobs
            </h2>
            <Link
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              href="/jobs?scheduled=false"
            >
              Review
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {unscheduledJobs.slice(0, 4).map((job) => (
              <div key={job.id} className="text-sm leading-6">
                <Link
                  className="font-medium text-slate-950 hover:text-cyan-700"
                  href={`/jobs/${job.id}`}
                >
                  {job.jobNumber}: {job.title}
                </Link>
                <Link
                  className="mt-1 block text-cyan-700 hover:text-cyan-900"
                  href={`/jobs/${job.id}?action=schedule`}
                >
                  Schedule placeholder
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Low stock warnings
            </h2>
            <Link
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              href="/stock?filter=low"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {lowStock.slice(0, 4).map((warning) => {
              const product = products.find(
                (item) => item.id === warning.productId,
              );
              const name = product?.name ?? warning.productId;

              return (
                <Link
                  key={warning.id}
                  className="block rounded-md p-2 text-sm transition hover:bg-cyan-50"
                  href={`/stock?filter=low&search=${encodeURIComponent(name)}`}
                >
                  <p className="font-medium text-slate-950">{name}</p>
                  <p className="mt-1 text-slate-600">
                    {warning.quantityOnHand} {warning.unit} left, reorder at{" "}
                    {warning.lowStockThreshold} {warning.unit}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Water chemistry alerts
            </h2>
            <Link
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              href="/water-testing?status=alert"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {waterAlerts.slice(0, 4).map((alert) => (
              <Link
                key={alert.id}
                className="block rounded-md p-2 text-sm transition hover:bg-cyan-50"
                href={
                  alert.id
                    ? `/water-testing/${alert.id}`
                    : alert.jobId
                      ? `/jobs/${alert.jobId}`
                      : `/water-testing?status=alert&alert=${encodeURIComponent(
                          alert.alertStatus,
                        )}`
                }
              >
                <p className="font-medium text-slate-950">
                  {alert.summary || alert.alertStatus}
                </p>
                <p className="mt-1 text-slate-600">
                  {alert.alerts.length > 0
                    ? alert.alerts.join(", ")
                    : alert.alertStatus}
                </p>
                <p className="mt-1 text-cyan-700">Review water test</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Technician workload
          </h2>
          <div className="mt-4 space-y-3">
            {workload.map((tech) => (
              <Link
                key={tech.id}
                className="flex items-center justify-between gap-4 rounded-md p-2 text-sm transition hover:bg-cyan-50"
                href={`/jobs?technician=${encodeURIComponent(tech.id)}`}
              >
                <div>
                  <p className="font-medium text-slate-950">{tech.name}</p>
                  <p className="mt-1 text-slate-600">{tech.jobs} jobs</p>
                </div>
                <p className="font-medium text-cyan-700">{tech.load}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SectionPage>
  );
}
