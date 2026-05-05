"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreateServiceReportFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

const reportStatusToDatabase: Record<string, string> = {
  archived: "archived",
  draft: "draft",
  ready_to_send: "ready",
  sent: "sent",
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
      error instanceof Error ? error.message : "Unknown service report error.",
  };
}

export async function createServiceReportAction(
  _previousState: CreateServiceReportFormState,
  formData: FormData,
): Promise<CreateServiceReportFormState> {
  const customerId = getString(formData, "customerId");
  const siteId = getString(formData, "siteId");
  const poolId = getString(formData, "poolId");
  const jobId = getString(formData, "jobId");
  const waterTestId = getString(formData, "waterTestId");
  const technicianId = getString(formData, "technicianId");
  const status = getString(formData, "status");
  const customerSummary = getString(formData, "customerSummary");
  const workCompleted = getString(formData, "workCompleted");
  const recommendations = getString(formData, "recommendations");
  const followUpRequired = getString(formData, "followUpRequired");
  const nextServiceRecommendation = getString(
    formData,
    "nextServiceRecommendation",
  );
  const internalNotes = getString(formData, "internalNotes");
  const fieldErrors: NonNullable<
    CreateServiceReportFormState["fieldErrors"]
  > = {};

  if (!customerId) {
    fieldErrors.customerId = "A linked customer is required.";
  }

  if (!customerSummary) {
    fieldErrors.customerSummary = "Customer-facing summary is required.";
  }

  if (!workCompleted) {
    fieldErrors.workCompleted = "Work completed is required.";
  }

  if (!reportStatusToDatabase[status]) {
    fieldErrors.status = "Choose a valid report status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Service reports are ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();
  let createdReportId = "";

  try {
    if (!(await tableExists(client, "reports"))) {
      return {
        formError:
          "The reports table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, "reports");

    if (
      !columns.has("customer_id") ||
      !columns.has("report_number") ||
      !columns.has("report_type")
    ) {
      return {
        formError:
          "The reports table is missing required customer or report columns. Please check the database setup.",
      };
    }

    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;

    const reportNumber = `SR-${Date.now().toString().slice(-6)}`;
    const findings = [
      workCompleted,
      followUpRequired ? `Follow-up required: ${followUpRequired}` : "",
      nextServiceRecommendation
        ? `Next service recommendation: ${nextServiceRecommendation}`
        : "",
      internalNotes ? `Internal notes: ${internalNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    const metadata = {
      followUpRequired,
      internalNotes,
      nextServiceRecommendation,
      source: "service-report-foundation",
    };
    const candidateValues: Record<string, boolean | Date | string | null> = {
      organisation_id: organisationId,
      customer_id: customerId,
      site_id: siteId || null,
      property_id: siteId || null,
      pool_id: poolId || null,
      job_id: jobId || null,
      water_test_id: waterTestId || null,
      technician_id: technicianId || null,
      report_number: reportNumber,
      report_type: "service_report",
      status: reportStatusToDatabase[status] ?? "draft",
      report_date: new Date(),
      customer_summary: customerSummary,
      work_completed: workCompleted,
      summary: customerSummary,
      findings,
      recommendations:
        recommendations || nextServiceRecommendation || "No recommendations.",
      follow_up_required: followUpRequired === "yes",
      next_service_recommendation: nextServiceRecommendation || null,
      internal_notes: internalNotes || null,
      notes: findings || null,
      metadata: JSON.stringify(metadata),
      created_at: new Date(),
      updated_at: new Date(),
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const values = insertColumns.map((column) => candidateValues[column]);
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");
    const rows = await client.unsafe<{ id: string }[]>(
      `insert into "reports" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})
       returning "id"`,
      values,
    );

    createdReportId = rows[0]?.id ?? "";
  } catch (error) {
    console.error("Service report creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        hasCustomerId: Boolean(customerId),
        hasJobId: Boolean(jobId),
        hasPoolId: Boolean(poolId),
        hasSiteId: Boolean(siteId),
        status,
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this service report. Please check the Vercel server logs for the safe report save error summary.",
    };
  } finally {
    await client.end();
  }

  redirect(createdReportId ? `/reports/${createdReportId}` : "/reports");
}
