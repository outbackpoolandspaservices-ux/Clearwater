import { SectionPage } from "@/components/app-shell/section-page";
import {
  dashboardStats,
  lowStockWarnings,
  quickActions,
  technicianWorkload,
  todayJobs,
  unscheduledJobs,
  waterChemistryAlerts,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <SectionPage
      title="Dashboard"
      description="A daily command centre for jobs, dispatch pressure, unpaid invoices, low stock, and water chemistry exceptions."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-cyan-700">{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Today&apos;s jobs
          </h2>
          <div className="mt-4 space-y-3">
            {todayJobs.map((job) => (
              <div
                key={`${job.time}-${job.customer}`}
                className="grid gap-2 rounded-md border border-slate-100 bg-slate-50 px-4 py-3 text-sm md:grid-cols-[90px_1fr_150px_120px]"
              >
                <p className="font-medium text-slate-500">{job.time}</p>
                <div>
                  <p className="font-semibold text-slate-950">{job.title}</p>
                  <p className="mt-1 text-slate-600">{job.customer}</p>
                </div>
                <p className="text-slate-600">{job.technician}</p>
                <p className="font-medium text-cyan-700">{job.status}</p>
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
              <button
                key={action}
                className="rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Unscheduled jobs
          </h2>
          <div className="mt-4 space-y-3">
            {unscheduledJobs.map((job) => (
              <p key={job} className="text-sm leading-6 text-slate-600">
                {job}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Low stock warnings
          </h2>
          <div className="mt-4 space-y-3">
            {lowStockWarnings.map((warning) => (
              <div key={warning.item} className="text-sm">
                <p className="font-medium text-slate-950">{warning.item}</p>
                <p className="mt-1 text-slate-600">
                  {warning.quantity} left, reorder at {warning.threshold}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Water chemistry alerts
          </h2>
          <div className="mt-4 space-y-3">
            {waterChemistryAlerts.map((alert) => (
              <div key={alert.pool} className="text-sm">
                <p className="font-medium text-slate-950">{alert.pool}</p>
                <p className="mt-1 text-slate-600">{alert.issue}</p>
                <p className="mt-1 text-cyan-700">{alert.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Technician workload
          </h2>
          <div className="mt-4 space-y-3">
            {technicianWorkload.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-950">{tech.name}</p>
                  <p className="mt-1 text-slate-600">{tech.jobs} jobs</p>
                </div>
                <p className="font-medium text-cyan-700">{tech.load}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionPage>
  );
}
