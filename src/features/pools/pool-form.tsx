"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createPoolAction, type CreatePoolFormState } from "@/features/pools/actions";
import type { SiteRecord } from "@/features/properties/data/sites";

const initialState: CreatePoolFormState = {};

const inputClassName =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

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

function SelectField({
  children,
  defaultValue = "",
  label,
  name,
}: {
  children: React.ReactNode;
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <Field label={label}>
      <select className={inputClassName} defaultValue={defaultValue} name={name}>
        {children}
      </select>
    </Field>
  );
}

function TextAreaField({ label, name }: { label: string; name: string }) {
  return (
    <Field label={label}>
      <textarea className={`${inputClassName} min-h-24 py-3`} name={name} />
    </Field>
  );
}

export function PoolForm({ sites }: { sites: SiteRecord[] }) {
  const [state, formAction, isPending] = useActionState(
    createPoolAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {state.formError}
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Pool identity</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Link this pool to a service property. Detailed fields that are not yet
          first-class database columns are stored safely in pool notes.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Property/site">
              <select className={inputClassName} defaultValue="" name="siteId">
                <option value="">Choose a property/site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.address}, {site.suburb}
                  </option>
                ))}
              </select>
              <FieldError message={state.fieldErrors?.siteId} />
            </Field>
          </div>

          <Field label="Pool name">
            <input
              className={inputClassName}
              name="name"
              placeholder="Main family pool"
              type="text"
            />
            <FieldError message={state.fieldErrors?.name} />
          </Field>

          <Field label="Pool volume in litres">
            <input
              className={inputClassName}
              inputMode="numeric"
              name="volumeLitres"
              placeholder="52000"
              type="number"
            />
            <FieldError message={state.fieldErrors?.volumeLitres} />
          </Field>

          <Field label="Pool type">
            <input className={inputClassName} name="poolType" placeholder="In-ground" />
          </Field>

          <Field label="Pool shape">
            <input className={inputClassName} name="poolShape" placeholder="Rectangle" />
          </Field>

          <SelectField label="Pool use type" name="poolUseType">
            <option value="">Choose use type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="rental">Rental</option>
            <option value="holiday_accommodation">Holiday accommodation</option>
            <option value="body_corporate">Body corporate</option>
          </SelectField>

          <SelectField defaultValue="active" label="Status" name="status">
            <option value="active">Active</option>
            <option value="monitor">Monitor</option>
            <option value="inactive">Inactive</option>
          </SelectField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Environment and water source
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectField label="Indoor or outdoor" name="environment">
            <option value="">Choose environment</option>
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
          </SelectField>

          <SelectField label="Covered or uncovered" name="covered">
            <option value="">Choose cover</option>
            <option value="covered">Covered</option>
            <option value="uncovered">Uncovered</option>
          </SelectField>

          <SelectField label="Shaded" name="shaded">
            <option value="">Choose shade level</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="partial">Partial</option>
          </SelectField>

          <SelectField label="Exposure level" name="exposureLevel">
            <option value="">Choose exposure</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField label="Leaf/debris load" name="leafDebrisLoad">
            <option value="">Choose debris load</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField label="Dust exposure" name="dustExposure">
            <option value="">Choose dust exposure</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>

          <SelectField label="Surrounding surface" name="surroundingSurface">
            <option value="">Choose surface</option>
            <option value="concrete">Concrete</option>
            <option value="pavers">Pavers</option>
            <option value="lawn">Lawn</option>
            <option value="dirt">Dirt</option>
            <option value="decking">Decking</option>
            <option value="other">Other</option>
          </SelectField>

          <SelectField label="Water source" name="waterSource">
            <option value="">Choose water source</option>
            <option value="town_water">Town water</option>
            <option value="bore_water">Bore water</option>
            <option value="rainwater">Rainwater</option>
            <option value="trucked_water">Trucked water</option>
            <option value="mixed">Mixed</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <SelectField label="Hard water risk" name="hardWaterRisk">
            <option value="">Choose risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <div className="md:col-span-2">
            <TextAreaField label="Source water notes" name="sourceWaterNotes" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Construction and systems
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectField label="Surface type" name="surfaceType">
            <option value="">Choose surface</option>
            <option value="concrete">Concrete</option>
            <option value="pebblecrete">Pebblecrete</option>
            <option value="fibreglass">Fibreglass</option>
            <option value="vinyl">Vinyl</option>
            <option value="tiled">Tiled</option>
            <option value="painted">Painted</option>
            <option value="other">Other</option>
          </SelectField>

          <Field label="Approximate age of pool">
            <input className={inputClassName} name="poolAge" placeholder="10 years" />
          </Field>

          <SelectField label="Recent resurfacing" name="recentResurfacing">
            <option value="">Choose resurfacing status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <Field label="Coping condition">
            <input className={inputClassName} name="copingCondition" />
          </Field>

          <Field label="Skimmer condition">
            <input className={inputClassName} name="skimmerCondition" />
          </Field>

          <SelectField label="Sanitation type" name="sanitiserType">
            <option value="">Choose sanitation</option>
            <option value="salt">Salt</option>
            <option value="chlorine">Chlorine</option>
            <option value="mineral">Mineral</option>
            <option value="magnesium">Magnesium</option>
            <option value="ozone">Ozone</option>
            <option value="uv">UV</option>
            <option value="bromine">Bromine</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <Field label="Chlorinator type">
            <input className={inputClassName} name="chlorinatorType" />
          </Field>

          <SelectField label="Filtration type" name="filtrationType">
            <option value="">Choose filtration</option>
            <option value="cartridge">Cartridge</option>
            <option value="sand">Sand</option>
            <option value="glass_media">Glass media</option>
            <option value="de">DE</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <Field label="Pump type">
            <input className={inputClassName} name="pumpType" />
          </Field>

          <Field label="Heater type">
            <input className={inputClassName} name="heaterType" />
          </Field>

          <SelectField label="Spa attached" name="spaAttached">
            <option value="">Choose spa status</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>

          <Field label="Automation/controller system">
            <input className={inputClassName} name="automationSystem" />
          </Field>

          <SelectField label="Cleaner type" name="cleanerType">
            <option value="">Choose cleaner</option>
            <option value="robotic">Robotic</option>
            <option value="suction">Suction</option>
            <option value="pressure">Pressure</option>
            <option value="manual">Manual</option>
            <option value="in_floor">In-floor</option>
            <option value="none">None</option>
            <option value="unknown">Unknown</option>
          </SelectField>

          <div className="md:col-span-2">
            <TextAreaField label="Shell/structure notes" name="shellStructureNotes" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Target chemistry
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Salt level target">
            <input className={inputClassName} name="saltTarget" placeholder="4000 ppm" />
          </Field>

          <Field label="Free chlorine target">
            <input className={inputClassName} name="freeChlorineTarget" placeholder="2-4 ppm" />
          </Field>

          <Field label="pH target">
            <input className={inputClassName} name="phTarget" placeholder="7.4-7.6" />
          </Field>

          <Field label="Alkalinity target">
            <input className={inputClassName} name="alkalinityTarget" placeholder="80-120 ppm" />
          </Field>

          <Field label="Calcium hardness target">
            <input className={inputClassName} name="calciumHardnessTarget" placeholder="200-400 ppm" />
          </Field>

          <Field label="Cyanuric acid target">
            <input className={inputClassName} name="cyanuricAcidTarget" placeholder="30-50 ppm" />
          </Field>

          <Field label="Phosphate target">
            <input className={inputClassName} name="phosphateTarget" placeholder="Below 500 ppb" />
          </Field>

          <Field label="Temperature target if relevant">
            <input className={inputClassName} name="temperatureTarget" placeholder="28 C" />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Service notes</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextAreaField
            label="Normal chemical behaviour"
            name="normalChemicalBehaviour"
          />
          <TextAreaField label="Recurring issues" name="recurringIssues" />
          <TextAreaField
            label="Access/safety notes specific to the pool"
            name="accessSafetyNotes"
          />
          <TextAreaField label="Technician notes" name="technicianNotes" />
          <TextAreaField label="Customer preferences" name="customerPreferences" />
          <TextAreaField label="Internal notes" name="internalNotes" />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          href="/pools"
        >
          Cancel
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving pool..." : "Save Pool"}
        </button>
      </div>
    </form>
  );
}
