import {
  getPoolById as getMockPoolById,
  getPoolsForSite as getMockPoolsForSite,
  pools as mockPools,
} from "@/lib/mock-data";
import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type PoolRecord = (typeof mockPools)[number];
export type PoolDataSource = "database" | "mock";
export type PoolsLoadResult = {
  count: number;
  pools: PoolRecord[];
  source: PoolDataSource;
};

type DatabasePoolRow = {
  id: string;
  property_id?: string | null;
  site_id?: string | null;
  label?: string | null;
  name?: string | null;
  pool_type?: string | null;
  surface?: string | null;
  surface_type?: string | null;
  volume_litres?: number | null;
  is_salt_water?: boolean | null;
  sanitiser_type?: string | null;
  environment?: string | null;
  target_ranges?: unknown;
  normal_chemical_behaviour?: string | null;
  notes?: string | null;
  service_notes?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown pool read error.",
  };
}

function logPoolSource(source: PoolDataSource, count: number) {
  console.info("ClearWater pools data source", {
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

function textFromTargetRanges(value: unknown) {
  if (!value) {
    return "Targets not recorded";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, target]) => `${key}: ${String(target)}`)
      .join(", ");
  }

  return "Targets not recorded";
}

function mapDatabasePool(pool: DatabasePoolRow): PoolRecord {
  const isSaltWater =
    pool.is_salt_water ??
    pool.sanitiser_type?.toLowerCase().includes("salt") ??
    false;
  const name = pool.name ?? pool.label ?? "Unnamed pool";
  const notes = pool.service_notes ?? pool.notes ?? pool.normal_chemical_behaviour;

  return {
    id: pool.id,
    siteId: pool.site_id ?? pool.property_id ?? "",
    name,
    location: "Database property",
    volumeLitres: pool.volume_litres ?? 0,
    poolType: pool.pool_type ?? "Not recorded",
    surfaceType: pool.surface_type ?? pool.surface ?? "Not recorded",
    sanitiserType:
      pool.sanitiser_type ?? (isSaltWater ? "Salt chlorinator" : "Not recorded"),
    lastTestDate: "No tests yet",
    alertStatus: "Balanced",
    targetRanges: textFromTargetRanges(pool.target_ranges),
    serviceNotes: notes ?? "No service notes recorded",
    equipmentIds: [],
    waterTestIds: [],
  };
}

async function getPoolsFromDatabase(): Promise<PoolRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "pools"))) {
      throw new Error("The pools table is not available.");
    }

    const columns = await getTableColumns(client, "pools");

    if (!columns.has("id")) {
      throw new Error("The pools table is missing an id column.");
    }

    const readableColumns = [
      "id",
      "property_id",
      "site_id",
      "label",
      "name",
      "pool_type",
      "surface",
      "surface_type",
      "volume_litres",
      "is_salt_water",
      "sanitiser_type",
      "environment",
      "target_ranges",
      "normal_chemical_behaviour",
      "notes",
      "service_notes",
    ].filter((column) => columns.has(column));

    const orderColumn = columns.has("name")
      ? "name"
      : columns.has("label")
        ? "label"
        : "id";

    const rows = await client.unsafe<DatabasePoolRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "pools"
       order by ${quoteIdentifier(orderColumn)} asc`,
    );

    return rows.map(mapDatabasePool);
  } finally {
    await client.end();
  }
}

async function getPoolFromDatabaseById(
  poolId: string,
): Promise<PoolRecord | undefined> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "pools"))) {
      throw new Error("The pools table is not available.");
    }

    const columns = await getTableColumns(client, "pools");

    if (!columns.has("id")) {
      throw new Error("The pools table is missing an id column.");
    }

    const readableColumns = [
      "id",
      "property_id",
      "site_id",
      "label",
      "name",
      "pool_type",
      "surface",
      "surface_type",
      "volume_litres",
      "is_salt_water",
      "sanitiser_type",
      "environment",
      "target_ranges",
      "normal_chemical_behaviour",
      "notes",
      "service_notes",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabasePoolRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "pools"
       where "id" = $1
       limit 1`,
      [poolId],
    );

    return rows[0] ? mapDatabasePool(rows[0]) : undefined;
  } finally {
    await client.end();
  }
}

async function getPoolsFromDatabaseForSite(
  siteId: string,
): Promise<PoolRecord[]> {
  const pools = await getPoolsFromDatabase();

  return pools.filter((pool) => pool.siteId === siteId);
}

export async function getPoolsWithSource(): Promise<PoolsLoadResult> {
  try {
    const pools = await getPoolsFromDatabase();

    logPoolSource("database", pools.length);

    return {
      count: pools.length,
      pools,
      source: "database",
    };
  } catch (error) {
    console.error(
      "Falling back to mock pools after database read failed or no database URL was available",
      safeReadError(error),
    );
    logPoolSource("mock", mockPools.length);

    return {
      count: mockPools.length,
      pools: mockPools,
      source: "mock",
    };
  }
}

export async function getPools() {
  const result = await getPoolsWithSource();

  return result.pools;
}

export async function getPoolById(poolId: string) {
  try {
    const pool = await getPoolFromDatabaseById(poolId);

    if (pool) {
      console.info("ClearWater pool detail data source", {
        poolId,
        source: "database",
      });

      return pool;
    }

    console.info("ClearWater pool detail data source", {
      poolId,
      source: "mock",
    });

    return getMockPoolById(poolId);
  } catch (error) {
    console.error(
      "Falling back to mock pool after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater pool detail data source", {
      poolId,
      source: "mock",
    });

    return getMockPoolById(poolId);
  }
}

export async function getPoolsForSite(siteId: string) {
  try {
    return await getPoolsFromDatabaseForSite(siteId);
  } catch (error) {
    console.error(
      "Falling back to mock property pools after database read failed",
      safeReadError(error),
    );

    return getMockPoolsForSite(siteId);
  }
}
