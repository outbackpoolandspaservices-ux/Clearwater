import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import { stockUsage as mockStockUsage } from "@/lib/mock-data";

export type JobChemicalUsageRecord = {
  cost: string;
  createdAt: string;
  id: string;
  jobId: string;
  notes: string;
  productId: string;
  productName: string;
  quantity: number;
  quantityUsed: string;
  reason: string;
  stockDeducted: boolean;
  stockId: string;
  unit: string;
};

type DatabaseChemicalUsageRow = {
  cost?: string | null;
  created_at?: Date | string | null;
  id: string;
  job_id?: string | null;
  notes?: string | null;
  product_id?: string | null;
  product_name?: string | null;
  quantity?: number | null;
  reason?: string | null;
  stock_deducted?: boolean | null;
  stock_id?: string | null;
  unit?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error
        ? error.message
        : "Unknown chemical usage read error.",
  };
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

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function mapDatabaseUsage(row: DatabaseChemicalUsageRow): JobChemicalUsageRecord {
  const quantity = row.quantity ?? 0;
  const unit = row.unit ?? "unit";

  return {
    cost: "Cost from stock is planned",
    createdAt: formatDate(row.created_at),
    id: row.id,
    jobId: row.job_id ?? "",
    notes: row.notes ?? "",
    productId: row.product_id ?? "",
    productName: row.product_name ?? "Chemical product",
    quantity,
    quantityUsed: `${quantity} ${unit}`,
    reason: row.reason ?? "",
    stockDeducted: row.stock_deducted ?? false,
    stockId: row.stock_id ?? "",
    unit,
  };
}

function normaliseMockProductId(productId: string) {
  const aliases: Record<string, string> = {
    "cal-chlor-hypo": "cal-chlor-clc-700",
    "salt-pool-protector": "salt-pool-protector-ii",
    "stain-scale-remover": "salt-pool-stain-scale-control",
  };

  return aliases[productId] ?? productId;
}

function parseQuantity(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));

  return Number.isFinite(parsed) ? parsed : 0;
}

function mapMockUsage(jobId: string): JobChemicalUsageRecord[] {
  return mockStockUsage
    .filter((usage) => usage.jobId === jobId)
    .map((usage) => {
      const productId = normaliseMockProductId(usage.productId);

      return {
        cost: usage.cost,
        createdAt: usage.usageDate,
        id: usage.id,
        jobId: usage.jobId,
        notes: "Mock stock usage example.",
        productId,
        productName: productId,
        quantity: parseQuantity(usage.quantityUsed),
        quantityUsed: usage.quantityUsed,
        reason: "Mock job usage",
        stockDeducted: false,
        stockId: "",
        unit: usage.quantityUsed.replace(/[0-9.\s]/g, "") || "unit",
      };
    });
}

async function getJobChemicalUsageFromDatabase(jobId: string) {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "job_chemical_usage"))) {
      throw new Error("The job chemical usage table is not available.");
    }

    const columns = await getTableColumns(client, "job_chemical_usage");

    if (!columns.has("id") || !columns.has("job_id")) {
      throw new Error("The job chemical usage table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "job_id",
      "stock_id",
      "product_id",
      "product_name",
      "quantity",
      "unit",
      "reason",
      "notes",
      "stock_deducted",
      "created_at",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseChemicalUsageRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "job_chemical_usage"
       where "job_id" = $1
       order by ${columns.has("created_at") ? '"created_at" desc' : '"id" desc'}`,
      [jobId],
    );

    return rows.map(mapDatabaseUsage);
  } finally {
    await client.end();
  }
}

export async function getJobChemicalUsage(jobId: string) {
  try {
    const usage = await getJobChemicalUsageFromDatabase(jobId);

    console.info("ClearWater job chemical usage data source", {
      count: usage.length,
      jobId,
      source: "database",
    });

    return usage;
  } catch (error) {
    console.error(
      "Falling back to mock job chemical usage after database read failed or no database URL was available",
      safeReadError(error),
    );

    const usage = mapMockUsage(jobId);

    console.info("ClearWater job chemical usage data source", {
      count: usage.length,
      jobId,
      source: "mock",
    });

    return usage;
  }
}
