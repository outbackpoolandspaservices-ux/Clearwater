"use client";

import Link from "next/link";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useActionState, useMemo, useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import type { ChemicalProductRecord } from "@/features/chemicals/data/chemicals";
import type { CustomerRecord } from "@/features/customers/data/customers";
import {
  updateJobExecutionAction,
  type UpdateJobExecutionFormState,
} from "@/features/jobs/actions";
import type { JobRecord } from "@/features/jobs/data/jobs";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";
import type { StockRecord } from "@/features/stock/data/stock";

type TechnicianOption = {
  id: string;
  name: string;
  role: string;
};

const initialState: UpdateJobExecutionFormState = {};
const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

const checklistItems = [
  "Arrived on site",
  "Checked access/gate/pets",
  "Took before photos placeholder",
  "Checked pool condition",
  "Checked equipment running",
  "Tested water",
  "Empty skimmer basket",
  "Empty pump basket",
  "Brush pool",
  "Vacuum pool",
  "Scoop debris",
  "Clean waterline",
  "Check pump operation",
  "Check filter pressure",
  "Backwash/clean filter if needed",
  "Check chlorinator/sanitiser system",
  "Check heater if present",
  "Check cleaner/robot if present",
  "Add chemicals if needed",
  "Took after photos placeholder",
  "Customer updated if needed",
  "Site secured before leaving",
];

function Field({
  children,
  helpText,
  label,
}: {
  children: ReactNode;
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

function yesNoText(value: boolean) {
  return value ? "Yes" : "No";
}

export function JobExecutionForm({
  customer,
  job,
  pool,
  products,
  site,
  stockRecords,
  technician,
  waterTestCount,
}: {
  customer?: CustomerRecord;
  job: JobRecord;
  pool?: PoolRecord;
  products: ChemicalProductRecord[];
  site?: SiteRecord;
  stockRecords: StockRecord[];
  technician?: TechnicianOption;
  waterTestCount: number;
}) {
  const [state, formAction, isPending] = useActionState(
    updateJobExecutionAction,
    initialState,
  );
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [status, setStatus] = useState(
    job.status === "Completed" ? "completed" : "in_progress",
  );
  const [chemicalProductId, setChemicalProductId] = useState("");
  const [chemicalQuantity, setChemicalQuantity] = useState("");
  const [chemicalReason, setChemicalReason] = useState("");
  const [deductStock, setDeductStock] = useState(false);
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [quoteRequired, setQuoteRequired] = useState(false);
  const [partsRequired, setPartsRequired] = useState(false);
  const [customerApprovalRequired, setCustomerApprovalRequired] =
    useState(false);
  const waterTestRecorded = waterTestCount > 0;
  const chemicalsNoted = Boolean(
    chemicalProductId || chemicalQuantity || chemicalReason,
  );
  const selectedProduct = products.find(
    (product) => product.id === chemicalProductId,
  );
  const matchingStock = chemicalProductId
    ? stockRecords.filter((stock) => stock.productId === chemicalProductId)
    : stockRecords;
  const waterTestHref = useMemo(() => {
    const params = new URLSearchParams({
      jobId: job.id,
      customerId: job.customerId,
      propertyId: job.siteId,
      poolId: job.poolId,
    });

    return `/water-testing/new?${params.toString()}`;
  }, [job.customerId, job.id, job.poolId, job.siteId]);

  function toggleChecklistItem(item: string) {
    setCheckedItems((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }
  const followUpFlags: [string, string, boolean, Dispatch<SetStateAction<boolean>>][] = [
    ["followUpRequired", "Follow-up required", followUpRequired, setFollowUpRequired],
    ["quoteRequired", "Quote required", quoteRequired, setQuoteRequired],
    ["partsRequired", "Parts required", partsRequired, setPartsRequired],
    [
      "customerApprovalRequired",
      "Customer approval required",
      customerApprovalRequired,
      setCustomerApprovalRequired,
    ],
  ];

  return (
    <form action={formAction} className="space-y-6">
      <input name="jobId" type="hidden" value={job.id} />
      <input name="checklistTotal" type="hidden" value={checklistItems.length} />
      <input
        name="waterTestRecorded"
        type="hidden"
        value={waterTestRecorded ? "yes" : "no"}
      />

      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Job context
          </h2>
          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-slate-500">Customer</p>
              <p className="mt-1 font-semibold text-slate-950">
                {customer?.name ?? job.customer}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Property/site</p>
              <p className="mt-1 font-semibold text-slate-950">
                {site?.name ?? "No site linked"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Pool</p>
              <p className="mt-1 font-semibold text-slate-950">
                {pool?.name ?? "No pool linked"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Technician</p>
              <p className="mt-1 font-semibold text-slate-950">
                {technician?.name ?? "Unassigned"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Scheduled</p>
              <p className="mt-1 text-slate-950">
                {job.scheduledDate} at {job.scheduledTime}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Priority</p>
              <p className="mt-1 text-slate-950">{job.priority}</p>
            </div>
          </div>
          {site?.address ? (
            <Link
              className="mt-5 inline-flex min-h-10 items-center rounded-md border border-cyan-200 px-4 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${site.address}, ${site.suburb}`,
              )}`}
              rel="noreferrer"
              target="_blank"
            >
              Open in Maps
            </Link>
          ) : null}
        </div>

        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge>{job.status}</StatusBadge>
            <StatusBadge>{job.jobType}</StatusBadge>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            Execution status
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Update job status and save technician notes from the field. Photos,
            stock deduction, and service reports will connect later.
          </p>
          <div className="mt-4">
            <Field label="New status">
              <select
                className={inputClassName}
                name="status"
                onChange={(event) => setStatus(event.target.value)}
                value={status}
              >
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="follow_up_required">Follow-up required</option>
                <option value="waiting_on_parts">Waiting on parts</option>
                <option value="waiting_on_customer">Waiting on customer</option>
              </select>
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Service workflow checklist
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Tick off practical service steps as the work is completed.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {checklistItems.map((item) => (
            <label
              className="flex min-h-12 items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700"
              key={item}
            >
              <input
                checked={checkedItems.includes(item)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                name="checklist"
                onChange={() => toggleChecklistItem(item)}
                type="checkbox"
                value={item}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Water test
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Water tests stay in the water testing workflow and can be linked
            back to this job.
          </p>
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-950">
              Recorded water tests: {waterTestCount}
            </p>
            <p className="mt-1 text-slate-600">
              Water test recorded: {yesNoText(waterTestRecorded)}
            </p>
          </div>
          {!waterTestRecorded ? (
            <Link
              className="mt-4 inline-flex min-h-10 items-center rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
              href={waterTestHref}
            >
              Add Water Test
            </Link>
          ) : null}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Chemicals used
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Select from the product catalogue, record quantity used, and
            optionally deduct from van stock. Dosing automation comes later.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Product/chemical">
              <select
                className={inputClassName}
                name="chemicalProductId"
                onChange={(event) => setChemicalProductId(event.target.value)}
                value={chemicalProductId}
              >
                <option value="">Choose or type manually</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </option>
                ))}
              </select>
              <input
                name="chemicalProductNameFromCatalogue"
                type="hidden"
                value={selectedProduct?.name ?? ""}
              />
            </Field>
            <Field label="Manual product name">
              <input
                className={inputClassName}
                name="chemicalProductName"
                placeholder="Use if product is not listed"
                type="text"
              />
            </Field>
            <Field label="Quantity">
              <input
                className={inputClassName}
                inputMode="decimal"
                name="chemicalQuantity"
                onChange={(event) => setChemicalQuantity(event.target.value)}
                placeholder="e.g. 2"
                type="text"
                value={chemicalQuantity}
              />
            </Field>
            <Field label="Unit">
              <select className={inputClassName} defaultValue="" name="chemicalUnit">
                <option value="">Choose unit</option>
                <option value="L">L</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="tablet">tablet</option>
                <option value="bag">bag</option>
                <option value="unit">unit</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                <input
                  checked={deductStock}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  name="deductStock"
                  onChange={(event) => setDeductStock(event.target.checked)}
                  type="checkbox"
                  value="yes"
                />
                <span>
                  Deduct from van stock if a matching stock record is selected
                </span>
              </label>
            </div>
            {deductStock ? (
              <div className="sm:col-span-2">
                <Field
                  helpText="ClearWater subtracts the entered quantity without unit conversion. Use matching units for now."
                  label="Stock record"
                >
                  <select className={inputClassName} defaultValue="" name="stockId">
                    <option value="">Record usage only, no stock deduction</option>
                    {matchingStock.map((stock) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.vanName} - {stock.quantityOnHand} {stock.unit} on hand
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <Field label="Reason">
                <input
                  className={inputClassName}
                  name="chemicalReason"
                  onChange={(event) => setChemicalReason(event.target.value)}
                  placeholder="e.g. low chlorine, pH adjustment"
                  type="text"
                  value={chemicalReason}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Chemical notes">
                <textarea
                  className={`${inputClassName} min-h-24 py-3`}
                  name="chemicalNotes"
                />
              </Field>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Job notes</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <Field label="Technician notes">
            <textarea
              className={`${inputClassName} min-h-28 py-3`}
              name="technicianNotes"
              placeholder="Work completed, observations, readings context..."
            />
          </Field>
          <Field label="Customer-facing notes">
            <textarea
              className={`${inputClassName} min-h-28 py-3`}
              name="customerNotes"
              placeholder="Friendly notes suitable for the customer..."
            />
          </Field>
          <Field label="Internal notes">
            <textarea
              className={`${inputClassName} min-h-28 py-3`}
              name="internalNotes"
              placeholder="Private team notes, risks, admin follow-up..."
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {followUpFlags.map(([name, label, checked, setChecked]) => (
            <label
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
              key={name}
            >
              <input
                checked={checked}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                name={name}
                onChange={(event) => setChecked(event.target.checked)}
                type="checkbox"
                value="yes"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Completion summary
        </h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-5">
          <p>
            <span className="font-semibold">Checklist:</span>{" "}
            {checkedItems.length}/{checklistItems.length}
          </p>
          <p>
            <span className="font-semibold">Water test:</span>{" "}
            {yesNoText(waterTestRecorded)}
          </p>
          <p>
            <span className="font-semibold">Chemicals noted:</span>{" "}
            {yesNoText(chemicalsNoted)}
          </p>
          <p>
            <span className="font-semibold">Follow-up:</span>{" "}
            {yesNoText(followUpRequired)}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {status.replaceAll("_", " ")}
          </p>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href={`/jobs/${job.id}`}
        >
          Cancel
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-200 px-4 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
          href={`/reports/new/service?jobId=${encodeURIComponent(job.id)}`}
        >
          Create Service Report
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving job update..." : "Save Job Update"}
        </button>
      </div>
    </form>
  );
}
