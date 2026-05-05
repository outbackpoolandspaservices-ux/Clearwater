"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreateAttachmentFormState = {
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

export async function createAttachmentAction(
  _previousState: CreateAttachmentFormState,
  formData: FormData,
): Promise<CreateAttachmentFormState> {
  const jobId = getString(formData, "jobId");
  const kind = getString(formData, "kind");
  const label = getString(formData, "label");
  const contentType = getString(formData, "contentType") || "image/jpeg";
  const fieldErrors: NonNullable<CreateAttachmentFormState["fieldErrors"]> = {};

  if (!jobId) fieldErrors.jobId = "Job ID is missing.";
  if (!kind) fieldErrors.kind = "Choose an attachment category.";
  if (!label) fieldErrors.label = "Enter a short label.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!hasDatabaseUrl()) {
    return { formError: "Attachment metadata needs DATABASE_URL configured." };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "attachments"))) {
      return {
        formError:
          "The attachments table is not available yet. Please run database setup.",
      };
    }

    const columns = await getTableColumns(client, "attachments");
    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;
    const values: Record<string, Date | string | null> = {
      organisation_id: organisationId,
      job_id: jobId,
      kind,
      label,
      storage_key: `pending-upload/${jobId}/${Date.now()}`,
      content_type: contentType,
      created_at: new Date(),
    };
    const insertColumns = Object.keys(values).filter((column) =>
      columns.has(column),
    );
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into "attachments" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})`,
      insertColumns.map((column) => values[column]),
    );
  } catch (error) {
    console.error("Attachment metadata save failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Unknown attachment save error.",
      error,
    });

    return {
      formError:
        "ClearWater could not save this attachment metadata. Please check server logs.",
    };
  } finally {
    await client.end();
  }

  redirect(`/jobs/${jobId}`);
}
