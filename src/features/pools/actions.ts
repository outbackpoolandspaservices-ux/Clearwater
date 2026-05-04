"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreatePoolFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

const statusValues = ["active", "inactive", "monitor"] as const;
const environmentValues = ["outdoor", "indoor"] as const;
const spaAttachedValues = ["no", "yes"] as const;

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
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

async function getDefaultOrganisationId(
  client: ReturnType<typeof createPostgresClient>,
) {
  if (!(await tableExists(client, "organisations"))) {
    return null;
  }

  const rows = await client<{ id: string }[]>`
    select id
    from organisations
    order by created_at asc nulls last, id asc
    limit 1
  `;

  return rows[0]?.id ?? null;
}

function parsePositiveInteger(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown pool save error.",
  };
}

function futureWaterTestingGuideContext({
  chlorinatorType,
  environment,
  poolType,
  sanitiserType,
  surfaceType,
  waterSource,
}: {
  chlorinatorType: string;
  environment: string;
  poolType: string;
  sanitiserType: string;
  surfaceType: string;
  waterSource: string;
}) {
  // TODO: Water testing should use this kind of pool context to calculate and
  // display guide ranges from pool type, indoor/outdoor exposure, sanitiser
  // system, chlorinator model/settings, surface, water source, and salt/mineral
  // or magnesium system details. Equipment integration will provide richer
  // chlorinator model/settings later.
  return [
    poolType ? `Guide context pool type: ${poolType}` : "",
    environment ? `Guide context environment: ${environment}` : "",
    sanitiserType ? `Guide context sanitiser system: ${sanitiserType}` : "",
    chlorinatorType ? `Guide context chlorinator: ${chlorinatorType}` : "",
    surfaceType ? `Guide context surface: ${surfaceType}` : "",
    waterSource ? `Guide context water source: ${waterSource}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function createPoolAction(
  _previousState: CreatePoolFormState,
  formData: FormData,
): Promise<CreatePoolFormState> {
  const name = getString(formData, "name");
  const siteId = getString(formData, "siteId");
  const poolType = getString(formData, "poolType");
  const volumeLitresValue = getString(formData, "volumeLitres");
  const poolShape = getString(formData, "poolShape");
  const poolUseType = getString(formData, "poolUseType");
  const covered = getString(formData, "covered");
  const shaded = getString(formData, "shaded");
  const exposureLevel = getString(formData, "exposureLevel");
  const leafDebrisLoad = getString(formData, "leafDebrisLoad");
  const dustExposure = getString(formData, "dustExposure");
  const surroundingSurface = getString(formData, "surroundingSurface");
  const waterSource = getString(formData, "waterSource");
  const hardWaterRisk = getString(formData, "hardWaterRisk");
  const sourceWaterNotes = getString(formData, "sourceWaterNotes");
  const surfaceType = getString(formData, "surfaceType");
  const poolAge = getString(formData, "poolAge");
  const recentResurfacing = getString(formData, "recentResurfacing");
  const copingCondition = getString(formData, "copingCondition");
  const skimmerCondition = getString(formData, "skimmerCondition");
  const shellStructureNotes = getString(formData, "shellStructureNotes");
  const sanitiserType = getString(formData, "sanitiserType");
  const chlorinatorType = getString(formData, "chlorinatorType");
  const filtrationType = getString(formData, "filtrationType");
  const pumpType = getString(formData, "pumpType");
  const heaterType = getString(formData, "heaterType");
  const spaAttached = getString(formData, "spaAttached");
  const automationSystem = getString(formData, "automationSystem");
  const cleanerType = getString(formData, "cleanerType");
  const environment = getString(formData, "environment");
  const normalChemicalBehaviour = getString(formData, "normalChemicalBehaviour");
  const recurringIssues = getString(formData, "recurringIssues");
  const accessSafetyNotes = getString(formData, "accessSafetyNotes");
  const technicianNotes = getString(formData, "technicianNotes");
  const customerPreferences = getString(formData, "customerPreferences");
  const internalNotes = getString(formData, "internalNotes");
  const status = getString(formData, "status");

  const fieldErrors: NonNullable<CreatePoolFormState["fieldErrors"]> = {};
  const volumeLitres = parsePositiveInteger(volumeLitresValue);

  if (!name) {
    fieldErrors.name = "Pool name is required.";
  }

  if (!siteId) {
    fieldErrors.siteId = "Choose the property/site this pool belongs to.";
  }

  if (volumeLitresValue && volumeLitres === null) {
    fieldErrors.volumeLitres = "Enter a whole number greater than 0.";
  }

  if (
    environment &&
    !environmentValues.includes(environment as (typeof environmentValues)[number])
  ) {
    fieldErrors.environment = "Select indoor or outdoor.";
  }

  if (
    spaAttached &&
    !spaAttachedValues.includes(spaAttached as (typeof spaAttachedValues)[number])
  ) {
    fieldErrors.spaAttached = "Select whether a spa is attached.";
  }

  if (!statusValues.includes(status as (typeof statusValues)[number])) {
    fieldErrors.status = "Select a valid status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError: "Pool creation is ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "pools"))) {
      return {
        formError:
          "The pools table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, "pools");
    const siteColumn = columns.has("site_id")
      ? "site_id"
      : columns.has("property_id")
        ? "property_id"
        : null;
    const nameColumn = columns.has("name")
      ? "name"
      : columns.has("label")
        ? "label"
        : null;

    if (!siteColumn || !nameColumn) {
      return {
        formError:
          "The pools table is missing required property/site or name columns. Please check the database setup.",
      };
    }

    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;

    if (columns.has("organisation_id") && !organisationId) {
      return {
        formError:
          "The pools table needs an organisation record before pools can be created. Please run the protected database setup route, then try again.",
      };
    }

    const guideContext = futureWaterTestingGuideContext({
      chlorinatorType,
      environment,
      poolType,
      sanitiserType,
      surfaceType,
      waterSource,
    });
    const futureFieldNotes = [
      poolShape ? `Pool shape: ${poolShape}` : "",
      poolUseType ? `Pool use type: ${poolUseType}` : "",
      covered ? `Covered: ${covered}` : "",
      shaded ? `Shaded: ${shaded}` : "",
      exposureLevel ? `Exposure level: ${exposureLevel}` : "",
      leafDebrisLoad ? `Leaf/debris load: ${leafDebrisLoad}` : "",
      dustExposure ? `Dust exposure: ${dustExposure}` : "",
      surroundingSurface ? `Surrounding surface: ${surroundingSurface}` : "",
      waterSource ? `Water source: ${waterSource}` : "",
      hardWaterRisk ? `Hard water risk: ${hardWaterRisk}` : "",
      sourceWaterNotes ? `Source water notes: ${sourceWaterNotes}` : "",
      poolAge ? `Approximate pool age: ${poolAge}` : "",
      recentResurfacing ? `Recent resurfacing: ${recentResurfacing}` : "",
      copingCondition ? `Coping condition: ${copingCondition}` : "",
      skimmerCondition ? `Skimmer condition: ${skimmerCondition}` : "",
      shellStructureNotes ? `Shell/structure notes: ${shellStructureNotes}` : "",
      chlorinatorType ? `Chlorinator type: ${chlorinatorType}` : "",
      filtrationType ? `Filtration type: ${filtrationType}` : "",
      pumpType ? `Pump type: ${pumpType}` : "",
      heaterType ? `Heater type: ${heaterType}` : "",
      spaAttached ? `Spa attached: ${spaAttached}` : "",
      automationSystem ? `Automation/controller system: ${automationSystem}` : "",
      cleanerType ? `Cleaner type: ${cleanerType}` : "",
      status ? `Status: ${status}` : "",
      guideContext,
      normalChemicalBehaviour
        ? `Normal chemical behaviour: ${normalChemicalBehaviour}`
        : "",
      recurringIssues ? `Recurring issues: ${recurringIssues}` : "",
      accessSafetyNotes ? `Access/safety notes: ${accessSafetyNotes}` : "",
      technicianNotes ? `Technician notes: ${technicianNotes}` : "",
      customerPreferences ? `Customer preferences: ${customerPreferences}` : "",
      internalNotes ? `Internal notes: ${internalNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const saltWater =
      sanitiserType.toLowerCase().includes("salt") ||
      chlorinatorType.toLowerCase().includes("salt");

    // TODO: promote detailed environment, construction, equipment and service
    // profile fields into first-class columns after this safe pool workflow is
    // proven in production.
    const candidateValues: Record<string, boolean | number | string | null> = {
      organisation_id: organisationId,
      [siteColumn]: siteId,
      [nameColumn]: name,
      pool_type: poolType || null,
      volume_litres: volumeLitres,
      surface: surfaceType || null,
      surface_type: surfaceType || null,
      sanitiser_type: sanitiserType || null,
      environment: environment || null,
      is_salt_water: saltWater,
      normal_chemical_behaviour: futureFieldNotes || null,
      notes: futureFieldNotes || null,
      service_notes: futureFieldNotes || null,
      heater_information: heaterType || null,
      spa_information: spaAttached || null,
      is_active: status !== "inactive",
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const values = insertColumns.map((column) => candidateValues[column]);
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into "pools" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})`,
      values,
    );
  } catch (error) {
    console.error("Pool creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        hasName: Boolean(name),
        hasSiteId: Boolean(siteId),
        hasVolume: Boolean(volumeLitresValue),
        sanitiserType,
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this pool. Please check the Vercel server logs for the safe pool save error summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/pools?created=pool");
}
