import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type AttachmentRecord = {
  category: string;
  contentType: string;
  createdAt: string;
  id: string;
  jobId: string;
  label: string;
  storageKey: string;
};

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

function formatDate(value?: Date | string | null) {
  if (!value) return "Not dated";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

type DatabaseAttachmentRow = {
  content_type?: string | null;
  created_at?: Date | string | null;
  id: string;
  job_id?: string | null;
  kind?: string | null;
  label?: string | null;
  storage_key?: string | null;
};

function mapAttachment(row: DatabaseAttachmentRow): AttachmentRecord {
  return {
    category: row.kind?.replaceAll("_", " ") ?? "attachment",
    contentType: row.content_type ?? "metadata placeholder",
    createdAt: formatDate(row.created_at),
    id: row.id,
    jobId: row.job_id ?? "",
    label: row.label ?? "Attachment",
    storageKey: row.storage_key ?? "",
  };
}

export async function getAttachmentsForJob(jobId: string) {
  if (!hasDatabaseUrl()) return [];

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "attachments"))) return [];

    const columns = await getTableColumns(client, "attachments");

    if (!columns.has("id") || !columns.has("job_id")) return [];

    const readableColumns = [
      "id",
      "job_id",
      "kind",
      "label",
      "storage_key",
      "content_type",
      "created_at",
    ].filter((column) => columns.has(column));
    const rows = await client.unsafe<DatabaseAttachmentRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "attachments"
       where "job_id" = $1
       order by ${columns.has("created_at") ? '"created_at" desc' : '"id" desc'}`,
      [jobId],
    );

    return rows.map(mapAttachment);
  } catch (error) {
    console.error("Attachment read failed; returning empty attachment list", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Unknown attachment read error.",
    });

    return [];
  } finally {
    await client.end();
  }
}
