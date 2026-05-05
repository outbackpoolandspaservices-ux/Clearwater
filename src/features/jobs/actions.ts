"use server";

import { redirect } from "next/navigation";

import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";

export type CreateJobFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};
export type UpdateJobExecutionFormState = {
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

const jobStatusValues = [
  "draft",
  "scheduled",
  "ready",
  "in_progress",
  "waiting_on_parts",
  "waiting_on_customer",
  "completed",
  "cancelled",
  "follow_up_required",
] as const;
const priorityValues = ["Low", "Normal", "High", "Urgent"] as const;
const yesNoValues = ["no", "yes"] as const;
const executionStatusValues = [
  "in_progress",
  "completed",
  "follow_up_required",
  "waiting_on_parts",
  "waiting_on_customer",
] as const;

const statusToDatabaseStatus: Record<string, string> = {
  cancelled: "cancelled",
  completed: "completed",
  draft: "new",
  follow_up_required: "follow_up_required",
  in_progress: "in_progress",
  ready: "ready_to_schedule",
  scheduled: "scheduled",
  waiting_on_customer: "on_hold",
  waiting_on_parts: "on_hold",
};

const jobTypeToDatabaseType: Record<string, string> = {
  chlorinator_service: "chlorinator_repair",
  emergency_callout: "emergency_service",
  equipment_inspection: "equipment_repair",
  filter_service: "filter_service",
  green_pool_recovery: "green_pool_recovery",
  handover_new_owner_visit: "handover_service",
  heater_inspection_repair: "heater_service",
  leak_investigation: "leak_investigation",
  one_off_service: "one_off_pool_service",
  other: "customer_requested_work",
  pool_inspection: "pool_inspection",
  pump_repair: "pump_repair",
  quote_visit: "quote_visit",
  regular_service: "regular_pool_service",
  vacuum_and_clean: "pool_clean_up",
  water_test_only: "water_test_only",
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

async function userExists(
  client: ReturnType<typeof createPostgresClient>,
  userId: string,
) {
  if (!userId || !(await tableExists(client, "users"))) {
    return false;
  }

  const rows = await client<{ exists: boolean }[]>`
    select exists (
      select 1
      from users
      where id = ${userId}
    )
  `;

  return rows[0]?.exists ?? false;
}

function parsePositiveInteger(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function parsePositiveNumber(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildScheduledDateTime(date: string, time: string) {
  if (!date) {
    return null;
  }

  return new Date(`${date}T${time || "08:00"}:00`);
}

function safeErrorSummary(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown job save error.",
  };
}

export async function createJobAction(
  _previousState: CreateJobFormState,
  formData: FormData,
): Promise<CreateJobFormState> {
  const customerId = getString(formData, "customerId");
  const siteId = getString(formData, "siteId");
  const poolId = getString(formData, "poolId");
  const title = getString(formData, "title");
  const jobType = getString(formData, "jobType");
  const status = getString(formData, "status");
  const priority = getString(formData, "priority");
  const preferredDate = getString(formData, "preferredDate");
  const scheduledDate = getString(formData, "scheduledDate");
  const scheduledStartTime = getString(formData, "scheduledStartTime");
  const estimatedDurationValue = getString(formData, "estimatedDurationMinutes");
  const assignedTechnicianId = getString(formData, "assignedTechnicianId");
  const recurringJob = getString(formData, "recurringJob");
  const recurrencePattern = getString(formData, "recurrencePattern");
  const checklist = getStrings(formData, "checklist");
  const customerNotes = getString(formData, "customerNotes");
  const technicianNotes = getString(formData, "technicianNotes");
  const internalNotes = getString(formData, "internalNotes");
  const reportedIssue = getString(formData, "reportedIssue");
  const faultObserved = getString(formData, "faultObserved");
  const diagnosisNotes = getString(formData, "diagnosisNotes");
  const partsRequired = getString(formData, "partsRequired");
  const partsOrdered = getString(formData, "partsOrdered");
  const quoteRequired = getString(formData, "quoteRequired");
  const customerApprovalRequired = getString(
    formData,
    "customerApprovalRequired",
  );
  const followUpRequired = getString(formData, "followUpRequired");
  const fieldErrors: NonNullable<CreateJobFormState["fieldErrors"]> = {};
  const estimatedDurationMinutes = parsePositiveInteger(estimatedDurationValue);

  if (!customerId) {
    fieldErrors.customerId = "Choose a customer.";
  }

  if (!siteId) {
    fieldErrors.siteId = "Choose a property/site.";
  }

  if (!title) {
    fieldErrors.title = "Job title is required.";
  }

  if (!jobType || !jobTypeToDatabaseType[jobType]) {
    fieldErrors.jobType = "Choose a valid job type.";
  }

  if (!jobStatusValues.includes(status as (typeof jobStatusValues)[number])) {
    fieldErrors.status = "Choose a valid job status.";
  }

  if (!priorityValues.includes(priority as (typeof priorityValues)[number])) {
    fieldErrors.priority = "Choose a valid priority.";
  }

  if (estimatedDurationValue && estimatedDurationMinutes === null) {
    fieldErrors.estimatedDurationMinutes =
      "Enter a whole number greater than 0.";
  }

  if (
    recurringJob &&
    !yesNoValues.includes(recurringJob as (typeof yesNoValues)[number])
  ) {
    fieldErrors.recurringJob = "Choose whether this job is recurring.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError: "Job creation is ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "jobs"))) {
      return {
        formError:
          "The jobs table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, "jobs");
    const siteColumn = columns.has("site_id")
      ? "site_id"
      : columns.has("property_id")
        ? "property_id"
        : null;

    if (!columns.has("customer_id") || !siteColumn || !columns.has("title")) {
      return {
        formError:
          "The jobs table is missing required customer, property/site, or title columns. Please check the database setup.",
      };
    }

    const organisationId = columns.has("organisation_id")
      ? await getDefaultOrganisationId(client)
      : null;

    if (columns.has("organisation_id") && !organisationId) {
      return {
        formError:
          "The jobs table needs an organisation record before jobs can be created. Please run the protected database setup route, then try again.",
      };
    }

    const scheduledStart = buildScheduledDateTime(
      scheduledDate,
      scheduledStartTime,
    );
    const scheduledEnd =
      scheduledStart && estimatedDurationMinutes
        ? new Date(scheduledStart.getTime() + estimatedDurationMinutes * 60_000)
        : null;
    const safeAssignedTechnicianId = await userExists(
      client,
      assignedTechnicianId,
    )
      ? assignedTechnicianId
      : null;
    const generatedJobNumber = `JOB-${Date.now().toString().slice(-6)}`;
    const workflowNotes = [
      preferredDate ? `Preferred date: ${preferredDate}` : "",
      recurringJob ? `Recurring job: ${recurringJob}` : "",
      recurrencePattern ? `Recurrence pattern: ${recurrencePattern}` : "",
      checklist.length > 0 ? `Checklist: ${checklist.join(", ")}` : "",
      reportedIssue ? `Reported issue: ${reportedIssue}` : "",
      faultObserved ? `Fault observed: ${faultObserved}` : "",
      diagnosisNotes ? `Diagnosis notes: ${diagnosisNotes}` : "",
      partsRequired ? `Parts required: ${partsRequired}` : "",
      partsOrdered ? `Parts ordered: ${partsOrdered}` : "",
      quoteRequired ? `Quote required: ${quoteRequired}` : "",
      customerApprovalRequired
        ? `Customer approval required: ${customerApprovalRequired}`
        : "",
      followUpRequired ? `Follow-up required: ${followUpRequired}` : "",
      assignedTechnicianId && !safeAssignedTechnicianId
        ? `Requested technician placeholder: ${assignedTechnicianId}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    const combinedInternalNotes = [internalNotes, workflowNotes]
      .filter(Boolean)
      .join("\n\n");
    const databaseStatus = statusToDatabaseStatus[status] ?? "new";
    const databaseJobType =
      jobTypeToDatabaseType[jobType] ?? "customer_requested_work";

    const candidateValues: Record<string, Date | number | string | null> = {
      assigned_to_user_id: safeAssignedTechnicianId,
      customer_id: customerId,
      estimated_duration_minutes: estimatedDurationMinutes,
      internal_notes: combinedInternalNotes || null,
      job_number: generatedJobNumber,
      job_type: databaseJobType,
      organisation_id: organisationId,
      pool_id: poolId || null,
      priority,
      [siteColumn]: siteId,
      scheduled_end: scheduledEnd,
      scheduled_start: scheduledStart,
      service_notes: workflowNotes || null,
      status: databaseStatus,
      title,
      customer_notes: customerNotes || null,
      technician_notes: technicianNotes || null,
      recommendations: followUpRequired === "yes" ? "Follow-up required" : null,
    };
    const insertColumns = Object.keys(candidateValues).filter((column) =>
      columns.has(column),
    );
    const values = insertColumns.map((column) => candidateValues[column]);
    const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(", ");

    await client.unsafe(
      `insert into "jobs" (${insertColumns.map(quoteIdentifier).join(", ")})
       values (${placeholders})`,
      values,
    );
  } catch (error) {
    console.error("Job creation failed", {
      ...safeErrorSummary(error),
      formFields: {
        hasCustomerId: Boolean(customerId),
        hasPoolId: Boolean(poolId),
        hasSiteId: Boolean(siteId),
        jobType,
        status,
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this job. Please check the Vercel server logs for the safe job save error summary.",
    };
  } finally {
    await client.end();
  }

  redirect("/jobs?created=job");
}

export async function updateJobExecutionAction(
  _previousState: UpdateJobExecutionFormState,
  formData: FormData,
): Promise<UpdateJobExecutionFormState> {
  const jobId = getString(formData, "jobId");
  const status = getString(formData, "status");
  const checklist = getStrings(formData, "checklist");
  const checklistTotal = parsePositiveInteger(getString(formData, "checklistTotal")) ?? 0;
  const waterTestRecorded = getString(formData, "waterTestRecorded");
  const chemicalProductId = getString(formData, "chemicalProductId");
  const chemicalProductNameFromCatalogue = getString(
    formData,
    "chemicalProductNameFromCatalogue",
  );
  const chemicalProductName = getString(formData, "chemicalProductName");
  const chemicalQuantity = getString(formData, "chemicalQuantity");
  const chemicalQuantityValue = parsePositiveNumber(chemicalQuantity);
  const chemicalUnit = getString(formData, "chemicalUnit");
  const chemicalReason = getString(formData, "chemicalReason");
  const chemicalNotes = getString(formData, "chemicalNotes");
  const deductStock = getString(formData, "deductStock") === "yes";
  const stockId = getString(formData, "stockId");
  const technicianNotes = getString(formData, "technicianNotes");
  const customerNotes = getString(formData, "customerNotes");
  const internalNotes = getString(formData, "internalNotes");
  const followUpRequired = getString(formData, "followUpRequired");
  const quoteRequired = getString(formData, "quoteRequired");
  const partsRequired = getString(formData, "partsRequired");
  const customerApprovalRequired = getString(formData, "customerApprovalRequired");
  const fieldErrors: NonNullable<UpdateJobExecutionFormState["fieldErrors"]> = {};

  if (!jobId) {
    fieldErrors.jobId = "Job ID is missing.";
  }

  if (
    !executionStatusValues.includes(
      status as (typeof executionStatusValues)[number],
    )
  ) {
    fieldErrors.status = "Choose a valid job status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  if (chemicalQuantity && chemicalQuantityValue === null) {
    return {
      fieldErrors: {
        chemicalQuantity: "Enter a quantity greater than 0.",
      },
    };
  }

  if (!hasDatabaseUrl()) {
    return {
      formError:
        "Job execution updates are ready, but no database URL is configured yet.",
    };
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "jobs"))) {
      return {
        formError:
          "The jobs table is not available yet. Please run the protected database setup route, then try again.",
      };
    }

    const columns = await getTableColumns(client, "jobs");

    if (!columns.has("id") || !columns.has("status")) {
      return {
        formError:
          "The jobs table is missing required execution columns. Please check the database setup.",
      };
    }

    const databaseStatus = statusToDatabaseStatus[status] ?? "on_hold";
    const chemicalName =
      chemicalProductNameFromCatalogue || chemicalProductName || chemicalProductId;
    const chemicalsNoted = Boolean(
      chemicalName || chemicalQuantity || chemicalReason || chemicalNotes,
    );
    const completedCount = checklist.length;
    const executionSummary = [
      "Job execution update",
      `Checklist completed: ${completedCount}/${checklistTotal}`,
      `Water test recorded: ${waterTestRecorded === "yes" ? "yes" : "no"}`,
      `Chemicals noted: ${chemicalsNoted ? "yes" : "no"}`,
      `Follow-up required: ${followUpRequired || "no"}`,
      `Quote required: ${quoteRequired || "no"}`,
      `Parts required: ${partsRequired || "no"}`,
      `Customer approval required: ${customerApprovalRequired || "no"}`,
      checklist.length > 0 ? `Completed checklist: ${checklist.join(", ")}` : "",
      chemicalsNoted
        ? [
            "Chemicals used:",
            chemicalProductId ? `Product ID: ${chemicalProductId}` : "",
            chemicalName ? `Product: ${chemicalName}` : "",
            chemicalQuantity ? `Quantity: ${chemicalQuantity}` : "",
            chemicalUnit ? `Unit: ${chemicalUnit}` : "",
            chemicalReason ? `Reason: ${chemicalReason}` : "",
            chemicalNotes ? `Notes: ${chemicalNotes}` : "",
            deductStock && stockId ? `Stock deducted: ${stockId}` : "",
          ]
            .filter(Boolean)
            .join(" ")
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    const updates: Record<string, Date | string | null> = {
      status: databaseStatus,
    };

    if (columns.has("technician_notes")) {
      updates.technician_notes = [technicianNotes, executionSummary]
        .filter(Boolean)
        .join("\n\n");
    }

    if (columns.has("customer_notes")) {
      updates.customer_notes = customerNotes || null;
    }

    if (columns.has("internal_notes")) {
      updates.internal_notes = [internalNotes, executionSummary]
        .filter(Boolean)
        .join("\n\n");
    }

    if (columns.has("recommendations")) {
      updates.recommendations =
        followUpRequired === "yes" || quoteRequired === "yes"
          ? [
              followUpRequired === "yes" ? "Follow-up required" : "",
              quoteRequired === "yes" ? "Quote required" : "",
              partsRequired === "yes" ? "Parts required" : "",
            ]
              .filter(Boolean)
              .join("; ")
          : null;
    }

    if (columns.has("updated_at")) {
      updates.updated_at = new Date();
    }

    const updateColumns = Object.keys(updates).filter((column) =>
      columns.has(column),
    );
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

    if (
      chemicalsNoted &&
      chemicalQuantityValue !== null &&
      (await tableExists(client, "job_chemical_usage"))
    ) {
      const usageColumns = await getTableColumns(client, "job_chemical_usage");
      const organisationId = usageColumns.has("organisation_id")
        ? await getDefaultOrganisationId(client)
        : null;
      const usageValues: Record<string, boolean | Date | number | string | null> = {
        organisation_id: organisationId,
        job_id: jobId,
        stock_id: stockId || null,
        product_id: chemicalProductId || null,
        product_name: chemicalName || "Chemical product",
        quantity: chemicalQuantityValue,
        unit: chemicalUnit || "unit",
        reason: chemicalReason || null,
        notes: chemicalNotes || null,
        stock_deducted: false,
        created_at: new Date(),
      };

      if (deductStock && stockId && (await tableExists(client, "stock"))) {
        const stockColumns = await getTableColumns(client, "stock");

        if (
          stockColumns.has("id") &&
          stockColumns.has("quantity_on_hand")
        ) {
          const updatedAtSet = stockColumns.has("updated_at")
            ? `, "updated_at" = now()`
            : "";

          await client.unsafe(
            `update "stock"
             set "quantity_on_hand" = greatest(0, "quantity_on_hand" - $1)
                 ${updatedAtSet}
             where "id" = $2`,
            [chemicalQuantityValue, stockId],
          );
          usageValues.stock_deducted = true;
        }

        if (chemicalProductId && (await tableExists(client, "stock_movements"))) {
          const movementColumns = await getTableColumns(client, "stock_movements");
          const movementValues: Record<string, Date | number | string | null> = {
            organisation_id: organisationId,
            stock_id: stockId,
            product_id: chemicalProductId || null,
            job_id: jobId,
            movement_type: "job_usage",
            quantity: chemicalQuantityValue,
            unit: chemicalUnit || "unit",
            note:
              chemicalReason || chemicalNotes
                ? [chemicalReason, chemicalNotes].filter(Boolean).join(" - ")
                : "Used on job",
            created_at: new Date(),
          };
          const movementInsertColumns = Object.keys(movementValues).filter(
            (column) => movementColumns.has(column),
          );
          const movementPlaceholders = movementInsertColumns
            .map((_, index) => `$${index + 1}`)
            .join(", ");

          await client.unsafe(
            `insert into "stock_movements" (${movementInsertColumns
              .map(quoteIdentifier)
              .join(", ")})
             values (${movementPlaceholders})`,
            movementInsertColumns.map((column) => movementValues[column]),
          );
        }
      }

      const usageInsertColumns = Object.keys(usageValues).filter((column) =>
        usageColumns.has(column),
      );
      const usagePlaceholders = usageInsertColumns
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      await client.unsafe(
        `insert into "job_chemical_usage" (${usageInsertColumns
          .map(quoteIdentifier)
          .join(", ")})
         values (${usagePlaceholders})`,
        usageInsertColumns.map((column) => usageValues[column]),
      );
    }
  } catch (error) {
    console.error("Job execution update failed", {
      ...safeErrorSummary(error),
      formFields: {
        checklistCount: checklist.length,
        hasChemicalNotes: Boolean(chemicalNotes),
        jobId,
        status,
      },
      error,
    });

    return {
      formError:
        "ClearWater could not save this job execution update. Please check the Vercel server logs for the safe job update summary.",
    };
  } finally {
    await client.end();
  }

  redirect(status === "completed" ? "/technician/today?completed=job" : `/jobs/${jobId}`);
}
