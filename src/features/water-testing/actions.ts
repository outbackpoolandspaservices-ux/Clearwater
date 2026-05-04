"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  defaultGuideRanges,
  readingStatus,
} from "@/features/water-testing/guide-ranges";

export type CreateWaterTestFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

const numericFields = [
  "waterTemperature",
  "freeChlorine",
  "totalChlorine",
  "combinedChlorine",
  "ph",
  "totalAlkalinity",
  "calciumHardness",
  "cyanuricAcid",
  "salt",
  "phosphate",
  "tds",
  "copper",
  "iron",
  "borates",
  "magnesium",
  "nitrate",
  "sulphate",
  "ozone",
  "bromine",
  "biguanide",
  "hydrogenPeroxide",
] as const;

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function tableExists(
  client: ReturnType<typeof createPostgresClient>,
  tableName: string,
) {
  const result = await client<{ exists: boolean }[]>`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = ${tableName}
    )
  `;

  return result[0]?.exists ?? false;
}

async function getTableColumns(
  client: ReturnType<typeof createPostgresClient>,
  tableName: string,
) {
  const rows = await client<{ column_name: string }[]>`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
  `;

  return new Set(rows.map((row) => row.column_name));
}

function parseOptionalNumber(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function buildTestedAt(date: string, time: string) {
  if (!date) {
    return new Date();
  }

  return new Date(`${date}T${time || "08:00"}:00`);
}

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown water test save error.",
  };
}

function simpleAlerts(readings: Record<string, number | null>) {
  return [
    readings.freeChlorine !== null &&
    readingStatus(readings.freeChlorine, defaultGuideRanges.freeChlorine) !== "OK"
      ? `${readingStatus(readings.freeChlorine, defaultGuideRanges.freeChlorine)} free chlorine`
      : "",
    readings.ph !== null &&
    readingStatus(readings.ph, defaultGuideRanges.ph) !== "OK"
      ? `${readingStatus(readings.ph, defaultGuideRanges.ph)} pH`
      : "",
    readings.totalAlkalinity !== null &&
    readingStatus(readings.totalAlkalinity, defaultGuideRanges.totalAlkalinity) !==
      "OK"
      ? `${readingStatus(readings.totalAlkalinity, defaultGuideRanges.totalAlkalinity)} alkalinity`
      : "",
    readings.calciumHardness !== null &&
    readingStatus(readings.calciumHardness, defaultGuideRanges.calciumHardness) !==
      "OK"
      ? `${readingStatus(readings.calciumHardness, defaultGuideRanges.calciumHardness)} calcium hardness`
      : "",
    readings.cyanuricAcid !== null &&
    readingStatus(readings.cyanuricAcid, defaultGuideRanges.cyanuricAcid) !== "OK"
      ? `${readingStatus(readings.cyanuricAcid, defaultGuideRanges.cyanuricAcid)} cyanuric acid`
      : "",
    readings.phosphate !== null &&
    readingStatus(readings.phosphate, defaultGuideRanges.phosphate) !== "OK"
      ? `${readingStatus(readings.phosphate, defaultGuideRanges.phosphate)} phosphate`
      : "",
  ].filter(Boolean);
}

export async function createWaterTestAction(
  _previousState: CreateWaterTestFormState,
  formData: FormData,
): Promise<CreateWaterTestFormState> {
  const poolId = getString(formData, "poolId");
  const jobId = getString(formData, "jobId");
  const testDate = getString(formData, "testDate");
  const testTime = getString(formData, "testTime");
  const technicianId = getString(formData, "technicianId");
  const notes = getString(formData, "notes");
  const fieldErrors: NonNullable<CreateWaterTestFormState["fieldErrors"]> = {};
  const readings = Object.fromEntries(
    numericFields.map((field) => [field, parseOptionalNumber(getString(formData, field))]),
  ) as Record<(typeof numericFields)[number], number | null>;

  if (!poolId) {
    fieldErrors.poolId = "Choose a pool for this water test.";
  }

  for (const field of numericFields) {
    const raw = getString(formData, field);

    if (raw && readings[field] === null) {
      fieldErrors[field] = "Enter a valid number.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Water test entry is ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "water_tests"))) {
      return {
        formError:
          "The water_tests table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, "water_tests");

    if (!columns.has("pool_id")) {
      return {
        formError:
          "The water_tests table is missing the required pool column. Please check the database setup.",
      };
    }

    const alerts = simpleAlerts(readings);
    const futureFieldNotes = [
      technicianId ? `Technician placeholder: ${technicianId}` : "",
      readings.magnesium !== null ? `Magnesium: ${readings.magnesium}` : "",
      readings.sulphate !== null ? `Sulphate: ${readings.sulphate}` : "",
      readings.ozone !== null ? `Ozone: ${readings.ozone}` : "",
      readings.bromine !== null ? `Bromine: ${readings.bromine}` : "",
      readings.biguanide !== null ? `Biguanide: ${readings.biguanide}` : "",
      readings.hydrogenPeroxide !== null
        ? `Hydrogen peroxide: ${readings.hydrogenPeroxide}`
        : "",
      "BioGuard recommendations: planned from catalogue data and pool context; dosing not calculated yet.",
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const candidateValues: Record<string, Date | number | string | null> = {
      alert_status: alerts.length > 0 ? alerts[0] : "Balanced",
      alkalinity: readings.totalAlkalinity,
      borates: readings.borates,
      calcium_hardness: readings.calciumHardness,
      combined_chlorine: readings.combinedChlorine,
      copper: readings.copper,
      cyanuric_acid: readings.cyanuricAcid,
      free_chlorine: readings.freeChlorine,
      iron: readings.iron,
      job_id: jobId || null,
      nitrates: readings.nitrate,
      notes: futureFieldNotes || null,
      ph: readings.ph,
      phosphate: readings.phosphate,
      pool_id: poolId,
      salt: readings.salt,
      source: "manual",
      tds: readings.tds,
      tested_at: buildTestedAt(testDate, testTime),
      total_alkalinity: readings.totalAlkalinity,
      total_chlorine: readings.totalChlorine,
      water_temperature: readings.waterTemperature,
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const values = insertColumns.map((column) => candidateValues[column]);
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into "water_tests" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})`,
      values,
    );
  } catch (error) {
    console.error("Water test creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        hasJobId: Boolean(jobId),
        hasPoolId: Boolean(poolId),
        hasTechnicianId: Boolean(technicianId),
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this water test. Please check the Vercel server logs for the safe water test save error summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/water-testing?created=water-test");
}
