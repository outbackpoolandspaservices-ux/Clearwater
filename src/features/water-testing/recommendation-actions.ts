"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type AddRecommendedProductsState = {
  formError?: string;
};

function getString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getStrings(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
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

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown recommendation note error.",
  };
}

export async function addRecommendedProductsToJobAction(
  _previousState: AddRecommendedProductsState,
  formData: FormData,
): Promise<AddRecommendedProductsState> {
  const jobId = getString(formData, "jobId");
  const testId = getString(formData, "testId");
  const selectedProducts = getStrings(formData, "selectedProducts");

  if (!jobId) {
    return { formError: "A linked job is required before products can be noted." };
  }

  if (selectedProducts.length === 0) {
    return { formError: "Select at least one product to add to job notes." };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Product recommendations are ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "jobs"))) {
      return {
        formError:
          "The jobs table is not available yet. Please run database setup and try again.",
      };
    }

    const columns = await getTableColumns(client, "jobs");
    const noteColumn = columns.has("internal_notes")
      ? "internal_notes"
      : columns.has("service_notes")
        ? "service_notes"
        : columns.has("technician_notes")
          ? "technician_notes"
          : null;

    if (!noteColumn) {
      return {
        formError:
          "The jobs table does not have a note column available for recommendation notes.",
      };
    }

    const rows = await client.unsafe<Record<string, string | null>[]>(
      `select ${quoteIdentifier(noteColumn)} as notes
       from "jobs"
       where "id" = $1
       limit 1`,
      [jobId],
    );
    const existingNotes = rows[0]?.notes ?? "";
    const recommendationNote = [
      "Chemical recommendation review note",
      testId ? `Water test: ${testId}` : "",
      `Selected products: ${selectedProducts.join(", ")}`,
      "Technician review required before dosing, stock deduction, or customer-facing advice.",
    ]
      .filter(Boolean)
      .join("\n");
    const nextNotes = [existingNotes, recommendationNote]
      .filter(Boolean)
      .join("\n\n");
    const updates: Record<string, Date | string> = {
      [noteColumn]: nextNotes,
    };

    if (columns.has("updated_at")) {
      updates.updated_at = new Date();
    }

    const updateColumns = Object.keys(updates);
    const setClause = updateColumns
      .map((column, index) => `${quoteIdentifier(column)} = $${index + 1}`)
      .join(", ");
    const values = updateColumns.map((column) => updates[column]);

    await client.unsafe(
      `update "jobs"
       set ${setClause}
       where "id" = $${values.length + 1}`,
      [...values, jobId],
    );
  } catch (error) {
    console.error("Adding recommended products to job notes failed", {
      ...safeErrorSummary(error),
      formFields: {
        jobId,
        selectedProductCount: selectedProducts.length,
        testId,
      },
      error,
    });

    return {
      formError:
        "ClearWater could not add these products to the job notes. Please check the server logs for the safe summary.",
    };
  } finally {
    await client.end();
  }

  redirect(`/jobs/${jobId}/execute`);
}
