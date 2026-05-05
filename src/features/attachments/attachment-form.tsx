"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createAttachmentAction,
  type CreateAttachmentFormState,
} from "@/features/attachments/actions";

const initialState: CreateAttachmentFormState = {};
const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

const attachmentKinds = [
  ["before_photo", "Before photo"],
  ["after_photo", "After photo"],
  ["equipment_photo", "Equipment photo"],
  ["damage_photo", "Issue / damage"],
  ["safety_issue_photo", "Safety concern"],
  ["water_condition_photo", "Water condition"],
  ["completed_work_photo", "Completed work"],
] as const;

export function AttachmentForm({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    createAttachmentAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input name="jobId" type="hidden" value={jobId} />
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Attachment metadata
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          File storage is not connected yet. This records the photo/category
          metadata so real uploads can attach to the same workflow later.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Category
            </span>
            <select className={`${inputClassName} mt-2`} defaultValue="" name="kind">
              <option value="">Choose category</option>
              {attachmentKinds.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {state.fieldErrors?.kind ? (
              <p className="mt-1 text-sm text-rose-700">
                {state.fieldErrors.kind}
              </p>
            ) : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Label</span>
            <input
              className={`${inputClassName} mt-2`}
              name="label"
              placeholder="Before photo - shallow end"
            />
            {state.fieldErrors?.label ? (
              <p className="mt-1 text-sm text-rose-700">
                {state.fieldErrors.label}
              </p>
            ) : null}
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-800">
              Content type placeholder
            </span>
            <input
              className={`${inputClassName} mt-2`}
              defaultValue="image/jpeg"
              name="contentType"
            />
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href={`/jobs/${jobId}`}
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving attachment..." : "Save Attachment Metadata"}
        </button>
      </div>
    </form>
  );
}
