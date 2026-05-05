"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreateQuoteFormState = {
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

function cents(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? Math.round(parsed * 100) : null;
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
  if (!(await tableExists(client, "organisations"))) return null;

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
      error instanceof Error ? error.message : "Unknown quote save error.",
  };
}

export async function createQuoteAction(
  _previousState: CreateQuoteFormState,
  formData: FormData,
): Promise<CreateQuoteFormState> {
  const customerId = getString(formData, "customerId");
  const siteId = getString(formData, "siteId");
  const poolId = getString(formData, "poolId");
  const jobId = getString(formData, "jobId");
  const title = getString(formData, "title");
  const status = getString(formData, "status") || "draft";
  const validUntil = getString(formData, "validUntil");
  const itemType = getString(formData, "itemType") || "other";
  const description = getString(formData, "description");
  const quantity = Number(getString(formData, "quantity") || "1");
  const amountCents = cents(getString(formData, "amount"));
  const terms = getString(formData, "terms");
  const fieldErrors: NonNullable<CreateQuoteFormState["fieldErrors"]> = {};

  if (!customerId) fieldErrors.customerId = "Choose a customer.";
  if (!title) fieldErrors.title = "Enter a quote title.";
  if (!description) fieldErrors.description = "Enter a line item description.";
  if (!Number.isFinite(quantity) || quantity <= 0) {
    fieldErrors.quantity = "Enter a quantity greater than 0.";
  }
  if (amountCents === null) fieldErrors.amount = "Enter a line item amount.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!hasDatabaseUrl()) {
    return { formError: "Quote creation needs DATABASE_URL configured." };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "quotes"))) {
      return {
        formError:
          "The quotes table is not available yet. Please run database setup.",
      };
    }

    const columns = await getTableColumns(client, "quotes");
    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;
    const subtotalCents = amountCents ?? 0;
    const gstCents = Math.round(subtotalCents * 0.1);
    const totalCents = subtotalCents + gstCents;
    const candidateValues: Record<string, Date | number | string | null> = {
      organisation_id: organisationId,
      customer_id: customerId,
      site_id: siteId || null,
      pool_id: poolId || null,
      job_id: jobId || null,
      quote_number: `Q-${Date.now().toString().slice(-6)}`,
      title,
      status,
      approval_status: status === "sent" ? "Awaiting approval" : "Not sent",
      subtotal_cents: subtotalCents,
      gst_cents: gstCents,
      total_cents: totalCents,
      issued_at: new Date(),
      valid_until: validUntil || null,
      terms:
        terms ||
        "Quote is valid until the expiry date. Parts availability and site conditions may affect final scheduling.",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");
    const inserted = await client.unsafe<{ id: string }[]>(
      `insert into "quotes" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})
       returning "id"`,
      insertColumns.map((column) => candidateValues[column]),
    );

    if (await tableExists(client, "quote_line_items")) {
      const itemColumns = await getTableColumns(client, "quote_line_items");
      const itemValues: Record<string, number | string> = {
        quote_id: inserted[0]?.id,
        item_type: itemType,
        description,
        quantity,
        unit_price_cents: amountCents ?? 0,
        total_cents: amountCents ?? 0,
      };
      const lineColumns = Object.keys(itemValues).filter((column) =>
        itemColumns.has(column),
      );
      const linePlaceholders = lineColumns
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      await client.unsafe(
        `insert into "quote_line_items" (${lineColumns
          .map(quoteIdentifier)
          .join(", ")})
         values (${linePlaceholders})`,
        lineColumns.map((column) => itemValues[column]),
      );
    }
  } catch (error) {
    console.error("Quote creation failed", {
      ...safeErrorSummary(error),
      formFields: { customerId, jobId, siteId },
      error,
    });

    return {
      formError:
        "ClearWater could not save this quote. Please check the server logs for the safe summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/quotes?created=quote");
}
