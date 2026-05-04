import Link from "next/link";

import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getCustomerById,
  getJobById,
  getRoutePlansForDate,
  getSiteById,
  getTechnicianById,
} from "@/lib/mock-data";

function routeTone(status: string) {
  if (status === "Sent to technician") return "success" as const;
  if (status === "Needs review" || status === "Ready to optimise") {
    return "warning" as const;
  }

  return "neutral" as const;
}

const routeActions = [
  "Optimise Route",
  "Reorder Stops",
  "Send Route to Technician",
  "Open in Maps",
];

export function RoutingWorkspace() {
  const routeDate = "2026-05-02";
  const plans = getRoutePlansForDate(routeDate);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {routeActions.map((action) => (
          <button
            className={[
              "min-h-11 rounded-md px-4 text-sm font-semibold shadow-sm transition",
              action === "Optimise Route"
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50",
            ].join(" ")}
            key={action}
            type="button"
          >
            {action}
          </button>
        ))}
      </section>

      <section className="grid gap-5">
        {plans.map((plan) => {
          const technician = getTechnicianById(plan.technicianId);

          return (
            <DetailCard
              key={plan.id}
              title={`${technician?.name ?? "Technician"} route`}
            >
              <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_1fr_220px]">
                <DetailList
                  items={[
                    { label: "Technician", value: technician?.name },
                    { label: "Route date", value: plan.routeDate },
                    { label: "Starting location", value: plan.startingLocation },
                    { label: "Total day duration", value: plan.totalDayDuration },
                  ]}
                />
                <DetailList
                  items={[
                    { label: "Current distance", value: plan.currentDistance },
                    {
                      label: "Current travel time",
                      value: plan.currentTravelTime,
                    },
                    {
                      label: "Optimised distance",
                      value: plan.optimisedDistance,
                    },
                    {
                      label: "Optimised travel time",
                      value: plan.optimisedTravelTime,
                    },
                  ]}
                />
                <div className="flex flex-col gap-2">
                  <StatusBadge tone={routeTone(plan.routeStatus)}>
                    {plan.routeStatus}
                  </StatusBadge>
                  <StatusBadge>{plan.optimisationStatus}</StatusBadge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Stop</th>
                      <th className="px-4 py-3 font-semibold">Job</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Suburb / site</th>
                      <th className="px-4 py-3 font-semibold">Travel</th>
                      <th className="px-4 py-3 font-semibold">Service</th>
                      <th className="px-4 py-3 font-semibold">Scheduled</th>
                      <th className="px-4 py-3 font-semibold">Maps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plan.stops.map((stop) => {
                      const job = getJobById(stop.jobId);
                      const site = job ? getSiteById(job.siteId) : undefined;
                      const customer = job
                        ? getCustomerById(job.customerId)
                        : undefined;

                      return (
                        <tr className="hover:bg-slate-50" key={stop.id}>
                          <td className="px-4 py-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                              {stop.stopOrder}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {job ? (
                              <Link
                                className="font-semibold text-slate-950 hover:text-cyan-700"
                                href={`/jobs/${job.id}`}
                              >
                                {job.jobNumber}
                              </Link>
                            ) : (
                              "Missing job"
                            )}
                            <p className="mt-1 text-xs text-slate-500">
                              {job?.jobType}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {customer?.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {site?.suburb} | {site?.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {stop.estimatedTravelTime}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {stop.estimatedServiceDuration}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {job?.scheduledTime}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                              type="button"
                            >
                              Open in Maps
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DetailCard>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <DetailCard title="Route comparison">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const technician = getTechnicianById(plan.technicianId);

              return (
                <div
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  key={plan.id}
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {technician?.name}
                  </p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div>
                      <dt className="text-slate-500">Current</dt>
                      <dd className="font-medium text-slate-950">
                        {plan.currentDistance} | {plan.currentTravelTime}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Optimised</dt>
                      <dd className="font-medium text-slate-950">
                        {plan.optimisedDistance} | {plan.optimisedTravelTime}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Saved</dt>
                      <dd className="font-medium text-cyan-700">
                        {plan.estimatedTimeSaved}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Fuel / travel</dt>
                      <dd className="font-medium text-slate-950">
                        {plan.estimatedFuelReduction}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </DetailCard>

        <DetailCard title="Routing Provider">
          <div className="space-y-3 text-sm leading-6 text-slate-700">
            <p>GraphHopper integration is planned for a later phase.</p>
            <p>
              Current route distance, time, stop order, and optimisation results
              are mock data only.
            </p>
            <p>
              Future route optimisation will use real addresses, coordinates,
              travel times, provider adapters, and technician constraints.
            </p>
          </div>
        </DetailCard>
      </section>
    </div>
  );
}
