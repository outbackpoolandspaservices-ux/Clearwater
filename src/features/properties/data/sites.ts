import { createPostgresClient } from "@/db/connection";
import {
  getSiteById as getMockSiteById,
  getSitesForCustomer as getMockSitesForCustomer,
  sites as mockSites,
} from "@/lib/mock-data";

export type SiteRecord = (typeof mockSites)[number];
export type SiteDataSource = "database" | "mock";
export type SitesLoadResult = {
  count: number;
  sites: SiteRecord[];
  source: SiteDataSource;
};

type DatabaseSiteRow = {
  id: string;
  access_notes?: string | null;
  address?: string | null;
  address_line_1?: string | null;
  access_warning?: string | null;
  customer_id?: string | null;
  gate_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  name?: string | null;
  pet_warnings?: string | null;
  suburb?: string | null;
  tenant_details?: string | null;
  technician_notes?: string | null;
  owner_agent_details?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown property read error.",
  };
}

function logSiteSource(source: SiteDataSource, count: number) {
  console.info("ClearWater properties data source", {
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

async function getPoolIdsForSite(
  client: ReturnType<typeof createPostgresClient>,
  siteId: string,
) {
  try {
    if (!(await tableExists(client, "pools"))) {
      return [];
    }

    const columns = await getTableColumns(client, "pools");
    const siteColumn = columns.has("site_id")
      ? "site_id"
      : columns.has("property_id")
        ? "property_id"
        : null;

    if (!columns.has("id") || !siteColumn) {
      return [];
    }

    const rows = await client.unsafe(
      `select "id" from "pools" where ${quoteIdentifier(siteColumn)} = $1`,
      [siteId],
    );

    return rows.map((row) => String(row.id));
  } catch (error) {
    console.error("Property pool count lookup failed", safeReadError(error));

    return [];
  }
}

function mapDatabaseSite(site: DatabaseSiteRow, poolIds: string[]): SiteRecord {
  const notes = site.technician_notes ?? "";

  return {
    id: site.id,
    customerId: site.customer_id ?? "",
    name: site.name ?? site.address ?? "Unnamed property",
    address: site.address ?? site.address_line_1 ?? "Address not provided",
    suburb: site.suburb ?? "Alice Springs",
    ownerOrAgent: site.owner_agent_details ?? "Database customer",
    accessNotes: site.access_notes ?? "No access instructions recorded",
    accessWarning:
      site.access_warning ?? site.access_notes ?? "No access warning recorded",
    gateCode: site.gate_code ?? "No gate code",
    petWarning: site.pet_warnings ?? "No pet warning recorded",
    tenantDetails:
      site.tenant_details ?? (notes || "No tenant details recorded"),
    ownerAgentDetails:
      site.owner_agent_details ??
      (notes || "No owner or agent details recorded"),
    status: "Active",
    poolIds,
  };
}

async function getSitesFromDatabase(): Promise<SiteRecord[]> {
  const client = createPostgresClient();

  try {
    const tableName = (await tableExists(client, "sites")) ? "sites" : "properties";

    if (!(await tableExists(client, tableName))) {
      throw new Error("No properties or sites table is available.");
    }

    const columns = await getTableColumns(client, tableName);

    if (!columns.has("id") || !columns.has("customer_id")) {
      throw new Error("The properties table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "customer_id",
      "name",
      "address",
      "address_line_1",
      "suburb",
      "gate_code",
      "access_notes",
      "access_warning",
      "pet_warnings",
      "technician_notes",
      "tenant_details",
      "owner_agent_details",
      "latitude",
      "longitude",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseSiteRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from ${quoteIdentifier(tableName)}
       order by ${columns.has("name") ? '"name" asc' : '"id" asc'}`,
    );

    return Promise.all(
      rows.map(async (site) =>
        mapDatabaseSite(site, await getPoolIdsForSite(client, site.id)),
      ),
    );
  } finally {
    await client.end();
  }
}

async function getSiteFromDatabaseById(
  siteId: string,
): Promise<SiteRecord | undefined> {
  const client = createPostgresClient();

  try {
    const tableName = (await tableExists(client, "sites")) ? "sites" : "properties";

    if (!(await tableExists(client, tableName))) {
      throw new Error("No properties or sites table is available.");
    }

    const columns = await getTableColumns(client, tableName);

    if (!columns.has("id") || !columns.has("customer_id")) {
      throw new Error("The properties table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "customer_id",
      "name",
      "address",
      "address_line_1",
      "suburb",
      "gate_code",
      "access_notes",
      "access_warning",
      "pet_warnings",
      "technician_notes",
      "tenant_details",
      "owner_agent_details",
      "latitude",
      "longitude",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseSiteRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from ${quoteIdentifier(tableName)}
       where "id" = $1
       limit 1`,
      [siteId],
    );
    const site = rows[0];

    if (!site) {
      return undefined;
    }

    return mapDatabaseSite(site, await getPoolIdsForSite(client, site.id));
  } finally {
    await client.end();
  }
}

async function getSitesFromDatabaseForCustomer(
  customerId: string,
): Promise<SiteRecord[]> {
  const sites = await getSitesFromDatabase();

  return sites.filter((site) => site.customerId === customerId);
}

export async function getSitesWithSource(): Promise<SitesLoadResult> {
  try {
    const sites = await getSitesFromDatabase();

    logSiteSource("database", sites.length);

    return {
      count: sites.length,
      sites,
      source: "database",
    };
  } catch (error) {
    console.error(
      "Falling back to mock properties after database read failed or no database URL was available",
      safeReadError(error),
    );
    logSiteSource("mock", mockSites.length);

    return {
      count: mockSites.length,
      sites: mockSites,
      source: "mock",
    };
  }
}

export async function getSites() {
  const result = await getSitesWithSource();

  return result.sites;
}

export async function getSiteById(siteId: string) {
  try {
    const site = await getSiteFromDatabaseById(siteId);

    if (site) {
      console.info("ClearWater property detail data source", {
        siteId,
        source: "database",
      });

      return site;
    }

    console.info("ClearWater property detail data source", {
      siteId,
      source: "mock",
    });

    return getMockSiteById(siteId);
  } catch (error) {
    console.error(
      "Falling back to mock property after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater property detail data source", {
      siteId,
      source: "mock",
    });

    return getMockSiteById(siteId);
  }
}

export async function getSitesForCustomer(customerId: string) {
  try {
    return await getSitesFromDatabaseForCustomer(customerId);
  } catch (error) {
    console.error(
      "Falling back to mock customer properties after database read failed",
      safeReadError(error),
    );

    return getMockSitesForCustomer(customerId);
  }
}
