import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  getJobById as getMockJobById,
  jobs as mockJobs,
} from "@/lib/mock-data";

export type JobRecord = {
  actualFinish: string | null;
  actualStart: string | null;
  customer: string;
  customerId: string;
  customerNotes: string;
  date: string;
  estimatedDuration: string;
  id: string;
  internalNotes: string;
  invoiceId: string | null;
  jobNumber: string;
  jobType: string;
  poolId: string;
  priority: string;
  quoteId: string | null;
  routeOrder: number | null;
  scheduledDate: string;
  scheduledTime: string;
  siteId: string;
  status: string;
  technicianId: string;
  title: string;
  waterTestIds: string[];
};
export type JobDataSource = "database" | "mock";
export type JobsLoadResult = {
  count: number;
  jobs: JobRecord[];
  source: JobDataSource;
};

type DatabaseJobRow = {
  id: string;
  assigned_to_user_id?: string | null;
  completed_at?: Date | string | null;
  customer_id?: string | null;
  customer_notes?: string | null;
  estimated_duration_minutes?: number | null;
  internal_notes?: string | null;
  job_number?: string | null;
  job_type?: string | null;
  pool_id?: string | null;
  priority?: string | null;
  property_id?: string | null;
  recommendations?: string | null;
  scheduled_end?: Date | string | null;
  scheduled_start?: Date | string | null;
  service_notes?: string | null;
  site_id?: string | null;
  started_at?: Date | string | null;
  status?: string | null;
  technician_notes?: string | null;
  title?: string | null;
};

const statusLabels: Record<string, string> = {
  cancelled: "Cancelled",
  completed: "Completed",
  follow_up_required: "Follow-up required",
  in_progress: "In progress",
  new: "Draft",
  on_hold: "Waiting on customer",
  scheduled: "Scheduled",
};

const jobTypeLabels: Record<string, string> = {
  chlorinator_service: "Chlorinator service",
  customer_requested_work: "Other",
  emergency_service: "Emergency callout",
  equipment_repair: "Equipment inspection",
  filter_service: "Filter service",
  green_pool_recovery: "Green pool recovery",
  handover_service: "Handover/new owner visit",
  heater_service: "Heater inspection/repair",
  leak_investigation: "Leak investigation",
  one_off_pool_service: "One-off service",
  pool_clean_up: "Vacuum and clean",
  pool_inspection: "Pool inspection",
  pump_repair: "Pump repair",
  quote_visit: "Quote visit",
  regular_pool_service: "Regular service",
  water_test_only: "Water test only",
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown job read error.",
  };
}

function logJobSource(source: JobDataSource, count: number) {
  console.info("ClearWater jobs data source", {
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

function formatDate(value?: Date | string | null) {
  if (!value) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value?: Date | string | null) {
  if (!value) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapDatabaseJob(job: DatabaseJobRow): JobRecord {
  const scheduledStart = job.scheduled_start ?? null;
  const estimatedMinutes = job.estimated_duration_minutes ?? 60;
  const notes = [
    job.service_notes,
    job.technician_notes,
    job.recommendations,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: job.id,
    jobNumber: job.job_number ?? `JOB-${job.id.slice(0, 8).toUpperCase()}`,
    title: job.title ?? "Untitled job",
    jobType:
      job.job_type && jobTypeLabels[job.job_type]
        ? jobTypeLabels[job.job_type]
        : job.job_type ?? "Other",
    customerId: job.customer_id ?? "",
    siteId: job.site_id ?? job.property_id ?? "",
    poolId: job.pool_id ?? "",
    technicianId: job.assigned_to_user_id ?? "",
    waterTestIds: [],
    quoteId: null,
    invoiceId: null,
    customer: "Database customer",
    status:
      job.status && statusLabels[job.status] ? statusLabels[job.status] : "Draft",
    priority: job.priority ?? "Normal",
    scheduledDate: formatDate(scheduledStart),
    scheduledTime: formatTime(scheduledStart),
    estimatedDuration: `${estimatedMinutes} minutes`,
    routeOrder: null,
    actualStart: job.started_at ? formatTime(job.started_at) : null,
    actualFinish: job.completed_at ? formatTime(job.completed_at) : null,
    date: scheduledStart ? formatDate(scheduledStart) : "Unscheduled",
    internalNotes:
      job.internal_notes ?? notes ?? "No internal notes recorded for this job.",
    customerNotes: job.customer_notes ?? "No customer notes recorded.",
  };
}

async function getJobsFromDatabase(): Promise<JobRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "jobs"))) {
      throw new Error("The jobs table is not available.");
    }

    const columns = await getTableColumns(client, "jobs");

    if (!columns.has("id") || !columns.has("title")) {
      throw new Error("The jobs table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "job_number",
      "title",
      "job_type",
      "customer_id",
      "property_id",
      "site_id",
      "pool_id",
      "assigned_to_user_id",
      "status",
      "priority",
      "scheduled_start",
      "scheduled_end",
      "estimated_duration_minutes",
      "started_at",
      "completed_at",
      "service_notes",
      "internal_notes",
      "customer_notes",
      "technician_notes",
      "recommendations",
    ].filter((column) => columns.has(column));
    const orderColumn = columns.has("scheduled_start") ? "scheduled_start" : "id";

    const rows = await client.unsafe<DatabaseJobRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "jobs"
       order by ${quoteIdentifier(orderColumn)} desc nulls last`,
    );

    return rows.map(mapDatabaseJob);
  } finally {
    await client.end();
  }
}

async function getJobFromDatabaseById(
  jobId: string,
): Promise<JobRecord | undefined> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "jobs"))) {
      throw new Error("The jobs table is not available.");
    }

    const columns = await getTableColumns(client, "jobs");

    if (!columns.has("id") || !columns.has("title")) {
      throw new Error("The jobs table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "job_number",
      "title",
      "job_type",
      "customer_id",
      "property_id",
      "site_id",
      "pool_id",
      "assigned_to_user_id",
      "status",
      "priority",
      "scheduled_start",
      "scheduled_end",
      "estimated_duration_minutes",
      "started_at",
      "completed_at",
      "service_notes",
      "internal_notes",
      "customer_notes",
      "technician_notes",
      "recommendations",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseJobRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "jobs"
       where "id" = $1
       limit 1`,
      [jobId],
    );

    return rows[0] ? mapDatabaseJob(rows[0]) : undefined;
  } finally {
    await client.end();
  }
}

export async function getJobsWithSource(): Promise<JobsLoadResult> {
  try {
    const jobs = await getJobsFromDatabase();

    logJobSource("database", jobs.length);

    return {
      count: jobs.length,
      jobs,
      source: "database",
    };
  } catch (error) {
    console.error(
      "Falling back to mock jobs after database read failed or no database URL was available",
      safeReadError(error),
    );
    logJobSource("mock", mockJobs.length);

    return {
      count: mockJobs.length,
      jobs: mockJobs,
      source: "mock",
    };
  }
}

export async function getJobs() {
  const result = await getJobsWithSource();

  return result.jobs;
}

export async function getJobById(jobId: string) {
  try {
    const job = await getJobFromDatabaseById(jobId);

    if (job) {
      console.info("ClearWater job detail data source", {
        jobId,
        source: "database",
      });

      return job;
    }

    console.info("ClearWater job detail data source", {
      jobId,
      source: "mock",
    });

    return getMockJobById(jobId);
  } catch (error) {
    console.error(
      "Falling back to mock job after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater job detail data source", {
      jobId,
      source: "mock",
    });

    return getMockJobById(jobId);
  }
}
