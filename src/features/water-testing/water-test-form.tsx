"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import type { CustomerRecord } from "@/features/customers/data/customers";
import type { JobRecord } from "@/features/jobs/data/jobs";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { SiteRecord } from "@/features/properties/data/sites";
import {
  createWaterTestAction,
  type CreateWaterTestFormState,
} from "@/features/water-testing/actions";
import {
  bioGuardRecommendationCategories,
  getGuideRangesForPool,
} from "@/features/water-testing/guide-ranges";

type TechnicianOption = {
  id: string;
  name: string;
  role: string;
};

const initialState: CreateWaterTestFormState = {};
const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

const standardFields = [
  ["waterTemperature", "Water temperature", "C"],
  ["freeChlorine", "Free Chlorine", "ppm"],
  ["totalChlorine", "Total Chlorine", "ppm"],
  ["combinedChlorine", "Combined Chlorine", "ppm"],
  ["ph", "pH", ""],
  ["totalAlkalinity", "Total Alkalinity", "ppm"],
  ["calciumHardness", "Calcium Hardness", "ppm"],
  ["cyanuricAcid", "Cyanuric Acid / Stabiliser", "ppm"],
  ["salt", "Salt", "ppm"],
  ["phosphate", "Phosphate", "ppb"],
  ["tds", "TDS", "ppm"],
] as const;

const advancedFields = [
  ["copper", "Copper", "ppm"],
  ["iron", "Iron", "ppm"],
  ["borates", "Borates", "ppm"],
  ["magnesium", "Magnesium", "ppm"],
  ["nitrate", "Nitrate", "ppm"],
  ["sulphate", "Sulphate", "ppm"],
  ["ozone", "Ozone", "ppm"],
  ["bromine", "Bromine", "ppm"],
  ["biguanide", "Biguanide", "ppm"],
  ["hydrogenPeroxide", "Hydrogen Peroxide", "ppm"],
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm font-medium text-rose-700">{message}</p>;
}

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

function ReadingField({
  field,
  label,
  state,
  unit,
}: {
  field: string;
  label: string;
  state: CreateWaterTestFormState;
  unit: string;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <input
          className={`${inputClassName} ${unit ? "pr-14" : ""}`}
          inputMode="decimal"
          name={field}
          placeholder="Not tested"
          type="text"
        />
        {unit ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
            {unit}
          </span>
        ) : null}
      </div>
      <FieldError message={state.fieldErrors?.[field]} />
    </Field>
  );
}

export function WaterTestForm({
  customers,
  initialCustomerId = "",
  initialJobId = "",
  initialPoolId = "",
  initialSiteId = "",
  jobs,
  pools,
  sites,
  technicians,
}: {
  customers: CustomerRecord[];
  initialCustomerId?: string;
  initialJobId?: string;
  initialPoolId?: string;
  initialSiteId?: string;
  jobs: JobRecord[];
  pools: PoolRecord[];
  sites: SiteRecord[];
  technicians: TechnicianOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    createWaterTestAction,
    initialState,
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] =
    useState(initialCustomerId);
  const [selectedSiteId, setSelectedSiteId] = useState(initialSiteId);
  const [selectedPoolId, setSelectedPoolId] = useState(initialPoolId);
  const selectedPool = pools.find((pool) => pool.id === selectedPoolId);
  const guideRanges = getGuideRangesForPool(selectedPool);
  const filteredSites = selectedCustomerId
    ? sites.filter((site) => site.customerId === selectedCustomerId)
    : sites;
  const filteredPools = selectedSiteId
    ? pools.filter((pool) => pool.siteId === selectedSiteId)
    : pools;
  const filteredJobs = selectedPoolId
    ? jobs.filter((job) => job.poolId === selectedPoolId)
    : selectedSiteId
      ? jobs.filter((job) => job.siteId === selectedSiteId)
      : jobs;
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pools.filter((pool) => {
      const site = sites.find((item) => item.id === pool.siteId);
      const customer = customers.find((item) => item.id === site?.customerId);
      const haystack = [
        customer?.name,
        customer?.phone,
        customer?.email,
        site?.name,
        site?.address,
        site?.suburb,
        pool.name,
        pool.sanitiserType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !query || haystack.includes(query);
    });
  }, [customers, pools, search, sites]);

  function choosePool(pool: PoolRecord) {
    const site = sites.find((item) => item.id === pool.siteId);

    setSelectedPoolId(pool.id);
    setSelectedSiteId(pool.siteId);
    setSelectedCustomerId(site?.customerId ?? "");
    setSearch(`${pool.name} - ${site?.address ?? ""} ${site?.suburb ?? ""}`.trim());
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Link water test
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Search by customer, property address, pool name, phone, or email.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Search customer, property, pool, phone, or email">
              <input
                className={inputClassName}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Flynn, Gillen, 0400, spa..."
                type="search"
                value={search}
              />
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50">
                {searchResults.length > 0 ? (
                  <div className="max-h-56 overflow-y-auto p-2">
                    {searchResults.slice(0, 8).map((pool) => {
                      const site = sites.find((item) => item.id === pool.siteId);
                      const customer = customers.find(
                        (item) => item.id === site?.customerId,
                      );

                      return (
                        <button
                          className={`block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-white hover:shadow-sm ${
                            selectedPoolId === pool.id
                              ? "bg-white text-cyan-800 shadow-sm"
                              : "text-slate-700"
                          }`}
                          key={pool.id}
                          onClick={() => choosePool(pool)}
                          type="button"
                        >
                          <span className="block font-semibold text-slate-950">
                            {pool.name}
                          </span>
                          <span className="mt-1 block text-slate-600">
                            {site?.address}, {site?.suburb}
                          </span>
                          <span className="mt-1 block text-slate-500">
                            {customer?.name ?? "Unknown customer"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-3 py-3 text-sm text-slate-500">
                    No matching customers, properties, or pools found
                  </p>
                )}
              </div>
            </Field>
          </div>

          <Field label="Customer">
            <select
              className={inputClassName}
              name="customerId"
              onChange={(event) => {
                setSelectedCustomerId(event.target.value);
                setSelectedSiteId("");
                setSelectedPoolId("");
              }}
              value={selectedCustomerId}
            >
              <option value="">Choose a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Property/site">
            <select
              className={inputClassName}
              name="siteId"
              onChange={(event) => {
                setSelectedSiteId(event.target.value);
                setSelectedPoolId("");
              }}
              value={selectedSiteId}
            >
              <option value="">Choose a property/site</option>
              {filteredSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} - {site.address}, {site.suburb}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pool">
            <select
              className={inputClassName}
              name="poolId"
              onChange={(event) => setSelectedPoolId(event.target.value)}
              value={selectedPoolId}
            >
              <option value="">Choose a pool</option>
              {filteredPools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.poolId} />
          </Field>

          <Field label="Optional linked job/service visit">
            <select
              className={inputClassName}
              defaultValue={initialJobId}
              name="jobId"
            >
              <option value="">No linked job</option>
              {filteredJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.jobNumber} - {job.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Test details and guide ranges
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Guide ranges are shown during water testing and are not stored as pool
          profile targets.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Test date">
            <input className={inputClassName} name="testDate" type="date" />
          </Field>
          <Field label="Test time">
            <input className={inputClassName} name="testTime" type="time" />
          </Field>
          <Field label="Technician">
            <select className={inputClassName} defaultValue="" name="technicianId">
              <option value="">Choose technician</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} - {technician.role}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 rounded-md border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          <p className="font-semibold">Guide range foundation</p>
          <p>
            Current ranges are practical defaults only. Future logic will use pool
            type, indoor/outdoor context, sanitiser system, chlorinator
            model/settings, surface type, water source, salt/mineral/magnesium
            system, and BioGuard catalogue data.
          </p>
          {selectedPool?.sanitiserType?.toLowerCase().includes("salt") ? (
            <p className="mt-2">
              Salt guide should be based on chlorinator manufacturer requirement.
              TODO: connect detailed Equipment/chlorinator profiles.
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.values(guideRanges).map((guide) => (
            <div
              className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
              key={guide.label}
            >
              <p className="font-semibold text-slate-950">{guide.label}</p>
              <p className="mt-1 text-slate-600">
                {guide.low ?? 0}
                {guide.high !== undefined ? ` - ${guide.high}` : "+"}{" "}
                {guide.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Standard readings
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {standardFields.map(([field, label, unit]) => (
            <ReadingField
              field={field}
              key={field}
              label={label}
              state={state}
              unit={unit}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <button
          className="text-left text-lg font-semibold text-slate-950"
          onClick={() => setShowAdvanced((value) => !value)}
          type="button"
        >
          Optional / advanced readings {showAdvanced ? "-" : "+"}
        </button>

        {showAdvanced ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {advancedFields.map(([field, label, unit]) => (
              <ReadingField
                field={field}
                key={field}
                label={label}
                state={state}
                unit={unit}
              />
            ))}
            <div className="md:col-span-2 xl:col-span-3">
              <Field label="Notes">
                <textarea
                  className={`${inputClassName} min-h-28 py-3`}
                  name="notes"
                />
              </Field>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          BioGuard product intelligence preparation
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Product recommendations will later use the uploaded BioGuard Product
          Catalogue 2026, pool context, and technician review. No dosing amounts
          are calculated here yet.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {bioGuardRecommendationCategories.map((category) => (
            <span
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/water-testing"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving water test..." : "Save Water Test"}
        </button>
      </div>
    </form>
  );
}
