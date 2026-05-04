"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { CustomerRecord } from "@/features/customers/data/customers";
import type { JobRecord } from "@/features/jobs/data/jobs";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";
import {
  createServiceReportAction,
  type CreateServiceReportFormState,
} from "@/features/reports/actions";
import type { WaterTestRecord } from "@/features/water-testing/data/water-tests";

type TechnicianOption = {
  id: string;
  name: string;
  role: string;
};

const initialState: CreateServiceReportFormState = {};
const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

function Field({
  children,
  helpText,
  label,
}: {
  children: React.ReactNode;
  helpText?: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <div className="mt-2">{children}</div>
      {helpText ? (
        <p className="mt-1 text-sm leading-5 text-slate-500">{helpText}</p>
      ) : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm font-medium text-rose-700">{message}</p>;
}

export function ServiceReportForm({
  customer,
  job,
  pool,
  site,
  technician,
  waterTest,
}: {
  customer?: CustomerRecord;
  job: JobRecord;
  pool?: PoolRecord;
  site?: SiteRecord;
  technician?: TechnicianOption;
  waterTest?: WaterTestRecord;
}) {
  const [state, formAction, isPending] = useActionState(
    createServiceReportAction,
    initialState,
  );
  const defaultSummary = `Service completed for ${customer?.name ?? job.customer}. ${pool?.name ? `${pool.name} was serviced` : "The pool was serviced"} and job notes have been reviewed for customer reporting.`;
  const defaultWorkCompleted = [
    job.technicianId ? `Technician: ${technician?.name ?? job.technicianId}` : "",
    job.jobType ? `Job type: ${job.jobType}` : "",
    job.internalNotes ? `Execution and technician notes: ${job.internalNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  const defaultRecommendations =
    job.status === "Follow-up required"
      ? "Follow-up is required. Please review the next service recommendation."
      : "Continue routine pool care and review any technician recommendations.";

  return (
    <form action={formAction} className="space-y-6">
      <input name="customerId" type="hidden" value={job.customerId} />
      <input name="siteId" type="hidden" value={job.siteId} />
      <input name="poolId" type="hidden" value={job.poolId} />
      <input name="jobId" type="hidden" value={job.id} />
      <input name="waterTestId" type="hidden" value={waterTest?.id ?? ""} />

      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Source job context
        </h2>
        <div className="mt-5 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="font-medium text-slate-500">Job</p>
            <p className="mt-1 font-semibold text-slate-950">
              {job.jobNumber} - {job.title}
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-500">Customer</p>
            <p className="mt-1 font-semibold text-slate-950">
              {customer?.name ?? job.customer}
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-500">Property/site</p>
            <p className="mt-1 font-semibold text-slate-950">
              {site?.address ?? "No address recorded"}
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-500">Water test</p>
            <p className="mt-1 font-semibold text-slate-950">
              {waterTest ? `${waterTest.date} - ${waterTest.alertStatus}` : "No linked test"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Report content
        </h2>
        <div className="mt-5 grid gap-4">
          <Field label="Report status">
            <select
              className={inputClassName}
              defaultValue="draft"
              name="status"
            >
              <option value="draft">Draft</option>
              <option value="ready_to_send">Ready to send</option>
              <option value="sent">Sent</option>
              <option value="archived">Archived</option>
            </select>
            <FieldError message={state.fieldErrors?.status} />
          </Field>

          <Field
            helpText="This is the customer-friendly opening summary."
            label="Customer-facing summary"
          >
            <textarea
              className={`${inputClassName} min-h-28 py-3`}
              defaultValue={defaultSummary}
              name="customerSummary"
            />
            <FieldError message={state.fieldErrors?.customerSummary} />
          </Field>

          <Field label="Work completed">
            <textarea
              className={`${inputClassName} min-h-36 py-3`}
              defaultValue={defaultWorkCompleted}
              name="workCompleted"
            />
            <FieldError message={state.fieldErrors?.workCompleted} />
          </Field>

          <Field label="Recommendations">
            <textarea
              className={`${inputClassName} min-h-28 py-3`}
              defaultValue={defaultRecommendations}
              name="recommendations"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Follow-up required">
              <select
                className={inputClassName}
                defaultValue={job.status === "Follow-up required" ? "yes" : "no"}
                name="followUpRequired"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="Next service recommendation">
              <input
                className={inputClassName}
                defaultValue="Next service date to be confirmed."
                name="nextServiceRecommendation"
                type="text"
              />
            </Field>
          </div>

          <Field
            helpText="Internal notes are stored with report findings for now and should not be written as customer-facing wording."
            label="Internal notes"
          >
            <textarea
              className={`${inputClassName} min-h-24 py-3`}
              name="internalNotes"
              placeholder="Private office/admin notes..."
            />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Preview placeholders
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Download PDF Placeholder", "Send to Customer Placeholder", "Email Report Placeholder", "View Customer Portal Placeholder"].map(
            (action) => (
              <button
                className="rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-800"
                key={action}
                type="button"
              >
                {action}
              </button>
            ),
          )}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href={`/jobs/${job.id}`}
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving report..." : "Save Service Report"}
        </button>
      </div>
    </form>
  );
}
