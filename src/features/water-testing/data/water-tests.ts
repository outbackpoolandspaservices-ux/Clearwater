import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  getWaterTestById as getMockWaterTestById,
  waterTests as mockWaterTests,
} from "@/lib/mock-data";

export type WaterTestRecord = {
  alertStatus: string;
  alerts: string[];
  alkalinity: string;
  borates?: string;
  bromine?: string;
  calciumHardness: string;
  chemicalsAdded: string[];
  combinedChlorine?: string;
  copper?: string;
  customerId: string;
  cyanuricAcid: string;
  date: string;
  freeChlorine: string;
  hydrogenPeroxide?: string;
  id: string;
  iron?: string;
  jobId: string | null;
  magnesium?: string;
  nitrate?: string;
  notes: string;
  ozone?: string;
  ph: string;
  phosphate: string;
  poolId: string;
  recommendationIds: string[];
  salt: string;
  siteId: string;
  source: string;
  sulphate?: string;
  summary: string;
  technicianId: string;
  time: string;
  totalChlorine: string;
  tds?: string;
  waterTemperature: string;
};
export type WaterTestDataSource = "database" | "mock";
export type WaterTestsLoadResult = {
  count: number;
  source: WaterTestDataSource;
  waterTests: WaterTestRecord[];
};

type DatabaseWaterTestRow = {
  alert_status?: string | null;
  alkalinity?: number | null;
  borates?: number | null;
  calcium_hardness?: number | null;
  combined_chlorine?: number | null;
  copper?: number | null;
  cyanuric_acid?: number | null;
  free_chlorine?: number | null;
  id: string;
  iron?: number | null;
  job_id?: string | null;
  nitrates?: number | null;
  notes?: string | null;
  ph?: number | null;
  phosphate?: number | null;
  pool_id?: string | null;
  salt?: number | null;
  source?: string | null;
  tds?: number | null;
  tested_at?: Date | string | null;
  total_alkalinity?: number | null;
  total_chlorine?: number | null;
  water_temperature?: number | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown water test read error.",
  };
}

function logWaterTestSource(source: WaterTestDataSource, count: number) {
  console.info("ClearWater water tests data source", {
    count,
    source,
  });
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

function formatDate(value?: Date | string | null) {
  if (!value) {
    return "Not dated";
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value));
}

function formatTime(value?: Date | string | null) {
  if (!value) {
    return "Not timed";
  }

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function reading(value?: number | null, unit = "") {
  if (value === null || value === undefined) {
    return "Not tested";
  }

  return unit ? `${value} ${unit}` : String(value);
}

function alertList(row: DatabaseWaterTestRow) {
  const alerts: string[] = [];

  if (row.free_chlorine !== null && row.free_chlorine !== undefined) {
    if (row.free_chlorine < 2) alerts.push("low chlorine");
    if (row.free_chlorine > 4) alerts.push("high chlorine");
  }

  if (row.ph !== null && row.ph !== undefined) {
    if (row.ph < 7.2) alerts.push("low pH");
    if (row.ph > 7.6) alerts.push("high pH");
  }

  if (row.phosphate !== null && row.phosphate !== undefined && row.phosphate > 500) {
    alerts.push("high phosphate");
  }

  if (
    row.calcium_hardness !== null &&
    row.calcium_hardness !== undefined &&
    row.calcium_hardness > 400
  ) {
    alerts.push("high calcium hardness");
  }

  const alkalinity = row.total_alkalinity ?? row.alkalinity;
  if (alkalinity !== null && alkalinity !== undefined) {
    if (alkalinity < 80) alerts.push("low alkalinity");
    if (alkalinity > 120) alerts.push("high alkalinity");
  }

  if (
    row.cyanuric_acid !== null &&
    row.cyanuric_acid !== undefined &&
    row.cyanuric_acid > 50
  ) {
    alerts.push("high cyanuric acid");
  }

  return alerts;
}

function mapDatabaseWaterTest(row: DatabaseWaterTestRow): WaterTestRecord {
  const alerts = alertList(row);
  const alertStatus = row.alert_status ?? (alerts.length > 0 ? alerts[0] : "Balanced");

  return {
    id: row.id,
    customerId: "",
    siteId: "",
    poolId: row.pool_id ?? "",
    jobId: row.job_id ?? null,
    technicianId: "",
    date: formatDate(row.tested_at),
    time: formatTime(row.tested_at),
    freeChlorine: reading(row.free_chlorine, "ppm"),
    totalChlorine: reading(row.total_chlorine, "ppm"),
    combinedChlorine: reading(row.combined_chlorine, "ppm"),
    ph: reading(row.ph),
    alkalinity: reading(row.total_alkalinity ?? row.alkalinity, "ppm"),
    calciumHardness: reading(row.calcium_hardness, "ppm"),
    cyanuricAcid: reading(row.cyanuric_acid, "ppm"),
    salt: reading(row.salt, "ppm"),
    phosphate: reading(row.phosphate, "ppb"),
    waterTemperature: reading(row.water_temperature, "C"),
    tds: reading(row.tds, "ppm"),
    copper: reading(row.copper, "ppm"),
    iron: reading(row.iron, "ppm"),
    borates: reading(row.borates, "ppm"),
    nitrate: reading(row.nitrates, "ppm"),
    summary: alertStatus,
    alertStatus,
    alerts,
    source: row.source ?? "Manual entry",
    notes: row.notes ?? "No notes recorded.",
    chemicalsAdded: [],
    recommendationIds: [],
  };
}

async function getWaterTestsFromDatabase(): Promise<WaterTestRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "water_tests"))) {
      throw new Error("The water_tests table is not available.");
    }

    const columns = await getTableColumns(client, "water_tests");

    if (!columns.has("id") || !columns.has("pool_id")) {
      throw new Error("The water_tests table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "job_id",
      "pool_id",
      "free_chlorine",
      "total_chlorine",
      "combined_chlorine",
      "ph",
      "alkalinity",
      "total_alkalinity",
      "calcium_hardness",
      "cyanuric_acid",
      "salt",
      "phosphate",
      "tds",
      "water_temperature",
      "copper",
      "iron",
      "borates",
      "nitrates",
      "source",
      "alert_status",
      "notes",
      "tested_at",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseWaterTestRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "water_tests"
       order by ${columns.has("tested_at") ? '"tested_at" desc' : '"id" desc'}`,
    );

    return rows.map(mapDatabaseWaterTest);
  } finally {
    await client.end();
  }
}

async function getWaterTestFromDatabaseById(
  testId: string,
): Promise<WaterTestRecord | undefined> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "water_tests"))) {
      throw new Error("The water_tests table is not available.");
    }

    const columns = await getTableColumns(client, "water_tests");

    if (!columns.has("id") || !columns.has("pool_id")) {
      throw new Error("The water_tests table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "job_id",
      "pool_id",
      "free_chlorine",
      "total_chlorine",
      "combined_chlorine",
      "ph",
      "alkalinity",
      "total_alkalinity",
      "calcium_hardness",
      "cyanuric_acid",
      "salt",
      "phosphate",
      "tds",
      "water_temperature",
      "copper",
      "iron",
      "borates",
      "nitrates",
      "source",
      "alert_status",
      "notes",
      "tested_at",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseWaterTestRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "water_tests"
       where "id" = $1
       limit 1`,
      [testId],
    );

    return rows[0] ? mapDatabaseWaterTest(rows[0]) : undefined;
  } finally {
    await client.end();
  }
}

export async function getWaterTestsWithSource(): Promise<WaterTestsLoadResult> {
  try {
    const waterTests = await getWaterTestsFromDatabase();

    logWaterTestSource("database", waterTests.length);

    return {
      count: waterTests.length,
      source: "database",
      waterTests,
    };
  } catch (error) {
    console.error(
      "Falling back to mock water tests after database read failed or no database URL was available",
      safeReadError(error),
    );
    logWaterTestSource("mock", mockWaterTests.length);

    return {
      count: mockWaterTests.length,
      source: "mock",
      waterTests: mockWaterTests,
    };
  }
}

export async function getWaterTests(): Promise<WaterTestRecord[]> {
  const result = await getWaterTestsWithSource();

  return result.waterTests;
}

export async function getWaterTestById(
  testId: string,
): Promise<WaterTestRecord | undefined> {
  try {
    const waterTest = await getWaterTestFromDatabaseById(testId);

    if (waterTest) {
      console.info("ClearWater water test detail data source", {
        source: "database",
        testId,
      });

      return waterTest;
    }

    console.info("ClearWater water test detail data source", {
      source: "mock",
      testId,
    });

    return getMockWaterTestById(testId) as WaterTestRecord | undefined;
  } catch (error) {
    console.error(
      "Falling back to mock water test after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater water test detail data source", {
      source: "mock",
      testId,
    });

    return getMockWaterTestById(testId) as WaterTestRecord | undefined;
  }
}
