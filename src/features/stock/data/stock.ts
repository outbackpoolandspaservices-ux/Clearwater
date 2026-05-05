import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import { vanStock as mockStock, stockUsage as mockStockUsage } from "@/lib/mock-data";

export type StockRecord = {
  id: string;
  lowStockThreshold: number;
  productId: string;
  quantityOnHand: number;
  sellingPrice: string;
  sellingPriceCents: number | null;
  stockStatus: string;
  supplier: string;
  technicianId: string;
  unit: string;
  unitCost: string;
  unitCostCents: number | null;
  vanName: string;
};
export type StockUsageRecord = (typeof mockStockUsage)[number];
export type StockDataSource = "database" | "mock";
export type StockLoadResult = {
  count: number;
  source: StockDataSource;
  stock: StockRecord[];
  usage: StockUsageRecord[];
};

type DatabaseStockRow = {
  id: string;
  location_name?: string | null;
  low_stock_threshold?: number | null;
  product_id?: string | null;
  quantity_on_hand?: number | null;
  selling_price_cents?: number | null;
  status?: string | null;
  supplier?: string | null;
  unit?: string | null;
  unit_cost_cents?: number | null;
  van_user_id?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function money(cents?: number | null) {
  if (cents === null || cents === undefined) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-AU", {
    currency: "AUD",
    style: "currency",
  }).format(cents / 100);
}

function stockStatus(quantity: number, threshold: number) {
  if (quantity <= threshold) return "Low stock";
  if (quantity <= threshold * 1.5) return "Watch";
  return "In stock";
}

function normaliseProductId(productId: string) {
  const aliases: Record<string, string> = {
    "cal-chlor-hypo": "cal-chlor-clc-700",
    "salt-pool-protector": "salt-pool-protector-ii",
    "stain-scale-remover": "salt-pool-stain-scale-control",
  };

  return aliases[productId] ?? productId;
}

function normaliseStockStatus(status: string | null | undefined, quantity: number, threshold: number) {
  if (status === "Low stock" || status === "Watch" || status === "In stock") {
    return status;
  }

  return stockStatus(quantity, threshold);
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown stock read error.",
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

function mapMockStock(): StockRecord[] {
  return mockStock.map((stock) => ({
    id: stock.id,
    productId: normaliseProductId(stock.productId),
    technicianId: stock.technicianId,
    vanName: stock.vanName,
    quantityOnHand: stock.quantityOnHand,
    unit: stock.unit,
    unitCost: stock.unitCost,
    sellingPrice: stock.sellingPrice,
    unitCostCents: null,
    sellingPriceCents: null,
    lowStockThreshold: stock.lowStockThreshold,
    stockStatus: stock.stockStatus,
    supplier: "Mock supplier",
  }));
}

function mapDatabaseStock(row: DatabaseStockRow): StockRecord {
  const quantity = row.quantity_on_hand ?? 0;
  const threshold = row.low_stock_threshold ?? 0;

  return {
    id: row.id,
    productId: normaliseProductId(row.product_id ?? ""),
    technicianId: row.van_user_id ?? "",
    vanName: row.location_name ?? "Service van",
    quantityOnHand: quantity,
    unit: row.unit ?? "unit",
    unitCost: money(row.unit_cost_cents),
    sellingPrice: money(row.selling_price_cents),
    unitCostCents: row.unit_cost_cents ?? null,
    sellingPriceCents: row.selling_price_cents ?? null,
    lowStockThreshold: threshold,
    stockStatus: normaliseStockStatus(row.status, quantity, threshold),
    supplier: row.supplier ?? "Not set",
  };
}

async function getStockFromDatabase(): Promise<StockRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "stock"))) {
      throw new Error("The stock table is not available.");
    }

    const columns = await getTableColumns(client, "stock");

    if (!columns.has("id") || !columns.has("product_id")) {
      throw new Error("The stock table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "product_id",
      "van_user_id",
      "location_name",
      "quantity_on_hand",
      "unit",
      "unit_cost_cents",
      "selling_price_cents",
      "low_stock_threshold",
      "supplier",
      "status",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseStockRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "stock"
       order by "location_name" asc, "product_id" asc`,
    );

    return rows.map(mapDatabaseStock);
  } finally {
    await client.end();
  }
}

export async function getStockWithSource(): Promise<StockLoadResult> {
  try {
    const stock = await getStockFromDatabase();

    console.info("ClearWater stock data source", {
      count: stock.length,
      source: "database",
    });

    return {
      count: stock.length,
      source: "database",
      stock,
      usage: mockStockUsage,
    };
  } catch (error) {
    console.error(
      "Falling back to mock stock after database read failed or no database URL was available",
      safeReadError(error),
    );
    const stock = mapMockStock();

    return {
      count: stock.length,
      source: "mock",
      stock,
      usage: mockStockUsage,
    };
  }
}
