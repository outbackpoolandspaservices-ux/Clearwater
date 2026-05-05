"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreateStockFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function numberValue(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function centsValue(value: string) {
  const parsed = numberValue(value);
  return parsed === null ? null : Math.round(parsed * 100);
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

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown stock save error.",
  };
}

export async function createStockAction(
  _previousState: CreateStockFormState,
  formData: FormData,
): Promise<CreateStockFormState> {
  const productId = getString(formData, "productId");
  const vanUserId = getString(formData, "vanUserId");
  const locationName = getString(formData, "locationName");
  const quantityOnHand = numberValue(getString(formData, "quantityOnHand"));
  const unit = getString(formData, "unit");
  const unitCostCents = centsValue(getString(formData, "unitCost"));
  const sellingPriceCents = centsValue(getString(formData, "sellingPrice"));
  const lowStockThreshold = numberValue(getString(formData, "lowStockThreshold"));
  const supplier = getString(formData, "supplier");
  const movementNote = getString(formData, "movementNote");
  const fieldErrors: NonNullable<CreateStockFormState["fieldErrors"]> = {};

  if (!productId) fieldErrors.productId = "Choose a product.";
  if (!locationName) fieldErrors.locationName = "Enter a van/location name.";
  if (quantityOnHand === null) fieldErrors.quantityOnHand = "Enter a quantity.";
  if (!unit) fieldErrors.unit = "Enter a unit.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError: "Stock creation is ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "stock"))) {
      return {
        formError:
          "The stock table is not available yet. Please run database setup and try again.",
      };
    }

    const columns = await getTableColumns(client, "stock");
    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;
    const candidateValues: Record<string, Date | number | string | null> = {
      organisation_id: organisationId,
      product_id: productId,
      van_user_id: vanUserId || null,
      location_name: locationName,
      quantity_on_hand: quantityOnHand,
      unit,
      unit_cost_cents: unitCostCents,
      selling_price_cents: sellingPriceCents,
      low_stock_threshold: lowStockThreshold ?? 0,
      supplier: supplier || null,
      status:
        quantityOnHand !== null &&
        lowStockThreshold !== null &&
        quantityOnHand <= lowStockThreshold
          ? "Low stock"
          : "Active",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");
    const values = insertColumns.map((column) => candidateValues[column]);

    const insertedRows = await client.unsafe<{ id: string }[]>(
      `insert into "stock" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})
       returning "id"`,
      values,
    );

    if (await tableExists(client, "stock_movements")) {
      const movementColumns = await getTableColumns(client, "stock_movements");
      const stockId = insertedRows[0]?.id ?? null;
      const movementValues: Record<string, Date | number | string | null> = {
        organisation_id: organisationId,
        stock_id: stockId,
        product_id: productId,
        movement_type: "receive",
        quantity: quantityOnHand,
        unit,
        note: movementNote || "Initial stock record created in ClearWater.",
        created_at: new Date(),
      };
      const usableMovementColumns = Object.keys(movementValues).filter((column) =>
        movementColumns.has(column),
      );
      const movementPlaceholders = usableMovementColumns
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      const movementParams = usableMovementColumns.map(
        (column) => movementValues[column],
      );

      await client.unsafe(
        `insert into "stock_movements" (${usableMovementColumns
          .map(quoteIdentifier)
          .join(", ")})
         values (${movementPlaceholders})`,
        movementParams,
      );
    }
  } catch (error) {
    console.error("Stock creation failed", {
      ...safeErrorSummary(error),
      formFields: { productId, vanUserId },
      error,
    });

    return {
      formError:
        "ClearWater could not save this stock record. Please check the server logs for the safe summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/stock?created=stock");
}
