import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import { bioGuardProductSeeds } from "@/features/chemicals/data/bioguard-products";
import { bioGuardProducts as legacyMockProducts } from "@/lib/mock-data";

export type ChemicalProductRecord = {
  activeIngredient: string;
  applicationMethod: string;
  brand: string;
  category: string;
  compatiblePoolTypes: string[];
  dosingNotes: string;
  handlingNote: string;
  id: string;
  name: string;
  notes: string;
  productStrength: string;
  purpose: string;
  relatedWaterIssues: string[];
  safetyNotes: string;
  status: string;
  subcategory: string;
  suitablePoolConditions: string[];
  unitType: string;
};
export type ChemicalProductDataSource = "database" | "mock";
export type ChemicalProductsLoadResult = {
  count: number;
  products: ChemicalProductRecord[];
  source: ChemicalProductDataSource;
};

type DatabaseChemicalProductRow = {
  active_ingredient?: string | null;
  application_method?: string | null;
  brand?: string | null;
  category?: string | null;
  compatible_pool_types?: unknown;
  dosing_notes?: string | null;
  id: string;
  is_active?: boolean | null;
  name?: string | null;
  notes?: string | null;
  product_strength?: string | null;
  purpose?: string | null;
  related_water_issues?: unknown;
  safety_notes?: string | null;
  status?: string | null;
  subcategory?: string | null;
  suitable_pool_conditions?: unknown;
  unit_type?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown chemical product read error.",
  };
}

function arrayFromValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function mapSeedProduct(product: (typeof bioGuardProductSeeds)[number]) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    purpose: product.purpose,
    unitType: product.unitType,
    activeIngredient: product.activeIngredient,
    productStrength: product.activeIngredient,
    applicationMethod: product.applicationMethod,
    dosingNotes: "Guidance only. Exact dosing automation will be added later.",
    handlingNote: product.safetyNotes,
    safetyNotes: product.safetyNotes,
    relatedWaterIssues: product.relatedWaterIssues,
    suitablePoolConditions: product.suitablePoolConditions,
    compatiblePoolTypes: product.compatiblePoolTypes,
    notes: product.notes,
    status: product.status,
  };
}

const fallbackProducts: ChemicalProductRecord[] = [
  ...bioGuardProductSeeds.map(mapSeedProduct),
  ...legacyMockProducts
    .filter(
      (product) =>
        !bioGuardProductSeeds.some((seedProduct) => seedProduct.id === product.id),
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      subcategory: "Legacy mock product",
      purpose: product.purpose,
      unitType: product.unitType,
      activeIngredient: product.productStrength,
      productStrength: product.productStrength,
      applicationMethod: product.applicationMethod,
      dosingNotes: product.dosingNotes,
      handlingNote: product.handlingNote,
      safetyNotes: product.handlingNote,
      relatedWaterIssues: product.relatedWaterIssues,
      suitablePoolConditions: product.relatedWaterIssues,
      compatiblePoolTypes: ["Technician review required"],
      notes: "Legacy mock product retained for fallback compatibility.",
      status: product.status,
    })),
];

function logChemicalSource(source: ChemicalProductDataSource, count: number) {
  console.info("ClearWater chemical products data source", {
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

function mapDatabaseChemicalProduct(
  product: DatabaseChemicalProductRow,
): ChemicalProductRecord {
  const safetyNotes =
    product.safety_notes ??
    "Technician guidance only. Read the current label and SDS before use.";

  return {
    id: product.id,
    name: product.name ?? "Unnamed product",
    brand: product.brand ?? "BioGuard Australia",
    category: product.category ?? "Specialty",
    subcategory: product.subcategory ?? "Not categorised",
    purpose: product.purpose ?? "Purpose not recorded",
    unitType: product.unit_type ?? "unit",
    activeIngredient: product.active_ingredient ?? product.product_strength ?? "Not recorded",
    productStrength: product.product_strength ?? product.active_ingredient ?? "Not recorded",
    applicationMethod:
      product.application_method ?? "Follow current product label directions.",
    dosingNotes:
      product.dosing_notes ??
      "Guidance only. Exact dosing automation will be added later.",
    handlingNote: safetyNotes,
    safetyNotes,
    relatedWaterIssues: arrayFromValue(product.related_water_issues),
    suitablePoolConditions: arrayFromValue(product.suitable_pool_conditions),
    compatiblePoolTypes: arrayFromValue(product.compatible_pool_types),
    notes: product.notes ?? "No notes recorded.",
    status:
      product.status ?? (product.is_active === false ? "Inactive" : "Active"),
  };
}

async function getProductsFromDatabase(): Promise<ChemicalProductRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "chemical_products"))) {
      throw new Error("The chemical_products table is not available.");
    }

    const columns = await getTableColumns(client, "chemical_products");

    if (!columns.has("id") || !columns.has("name")) {
      throw new Error("The chemical_products table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "name",
      "brand",
      "category",
      "subcategory",
      "active_ingredient",
      "purpose",
      "unit_type",
      "product_strength",
      "application_method",
      "dosing_notes",
      "safety_notes",
      "related_water_issues",
      "suitable_pool_conditions",
      "compatible_pool_types",
      "notes",
      "status",
      "is_active",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseChemicalProductRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "chemical_products"
       order by "brand" asc, "category" asc, "name" asc`,
    );

    return rows.map(mapDatabaseChemicalProduct);
  } finally {
    await client.end();
  }
}

async function getProductFromDatabaseById(
  productId: string,
): Promise<ChemicalProductRecord | undefined> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "chemical_products"))) {
      throw new Error("The chemical_products table is not available.");
    }

    const columns = await getTableColumns(client, "chemical_products");

    if (!columns.has("id") || !columns.has("name")) {
      throw new Error("The chemical_products table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "name",
      "brand",
      "category",
      "subcategory",
      "active_ingredient",
      "purpose",
      "unit_type",
      "product_strength",
      "application_method",
      "dosing_notes",
      "safety_notes",
      "related_water_issues",
      "suitable_pool_conditions",
      "compatible_pool_types",
      "notes",
      "status",
      "is_active",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseChemicalProductRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "chemical_products"
       where "id" = $1
       limit 1`,
      [productId],
    );

    return rows[0] ? mapDatabaseChemicalProduct(rows[0]) : undefined;
  } finally {
    await client.end();
  }
}

export async function getChemicalProductsWithSource(): Promise<ChemicalProductsLoadResult> {
  try {
    const products = await getProductsFromDatabase();

    logChemicalSource("database", products.length);

    return {
      count: products.length,
      products,
      source: "database",
    };
  } catch (error) {
    console.error(
      "Falling back to mock BioGuard products after database read failed or no database URL was available",
      safeReadError(error),
    );
    logChemicalSource("mock", fallbackProducts.length);

    return {
      count: fallbackProducts.length,
      products: fallbackProducts,
      source: "mock",
    };
  }
}

export async function getChemicalProducts() {
  const result = await getChemicalProductsWithSource();

  return result.products;
}

export async function getChemicalProductById(productId: string) {
  try {
    const product = await getProductFromDatabaseById(productId);

    if (product) {
      console.info("ClearWater chemical product detail data source", {
        productId,
        source: "database",
      });

      return product;
    }

    console.info("ClearWater chemical product detail data source", {
      productId,
      source: "mock",
    });

    return fallbackProducts.find((product) => product.id === productId);
  } catch (error) {
    console.error(
      "Falling back to mock BioGuard product after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater chemical product detail data source", {
      productId,
      source: "mock",
    });

    return fallbackProducts.find((product) => product.id === productId);
  }
}
