import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  getReportById as getMockReportById,
  reports as mockReports,
} from "@/lib/mock-data";

export type ReportRecord = (typeof mockReports)[number];
export type ReportDataSource = "database" | "mock";
export type ReportsLoadResult = {
  count: number;
  reports: ReportRecord[];
  source: ReportDataSource;
};

type DatabaseReportRow = {
  id: string;
  created_at?: Date | string | null;
  customer_summary?: string | null;
  customer_id?: string | null;
  findings?: string | null;
  follow_up_required?: boolean | null;
  internal_notes?: string | null;
  job_id?: string | null;
  metadata?: Record<string, unknown> | string | null;
  next_service_recommendation?: string | null;
  notes?: string | null;
  pool_id?: string | null;
  property_id?: string | null;
  recommendations?: string | null;
  report_date?: Date | string | null;
  report_number?: string | null;
  report_type?: string | null;
  sent_at?: Date | string | null;
  site_id?: string | null;
  status?: string | null;
  summary?: string | null;
  technician_id?: string | null;
  water_test_id?: string | null;
  work_completed?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown report read error.",
  };
}

function logReportSource(source: ReportDataSource, count: number) {
  console.info("ClearWater reports data source", {
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
    return "Not dated";
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value));
}

function reportTypeLabel(value?: string | null) {
  const labels: Record<string, string> = {
    pool_inspection_report: "Pool Inspection Report",
    service_report: "Service Report",
    water_test_report: "Water Test Report",
  };

  return value ? labels[value] ?? value : "Service Report";
}

function statusLabel(value?: string | null) {
  const labels: Record<string, string> = {
    archived: "Archived",
    draft: "Draft",
    ready: "Ready to send",
    sent: "Sent",
  };

  return value ? labels[value] ?? value : "Draft";
}

function mapDatabaseReport(report: DatabaseReportRow): ReportRecord {
  const summary =
    report.customer_summary ??
    report.summary ??
    "Service report summary not recorded yet.";
  const findings =
    report.work_completed ??
    report.findings ??
    report.notes ??
    "Work completed details not recorded yet.";
  const recommendations =
    report.recommendations ?? "No recommendations recorded.";

  return {
    id: report.id,
    reportNumber:
      report.report_number ?? `SR-${report.id.slice(0, 8).toUpperCase()}`,
    reportType: reportTypeLabel(report.report_type),
    customerId: report.customer_id ?? "",
    siteId: report.site_id ?? report.property_id ?? "",
    poolId: report.pool_id ?? "",
    jobId: report.job_id ?? "",
    technicianId: report.technician_id ?? "",
    waterTestId: report.water_test_id ?? "",
    equipmentIds: [],
    reportDate: formatDate(report.report_date ?? report.created_at),
    status: statusLabel(report.status),
    sentStatus: report.sent_at ? "Sent to customer" : "Not sent",
    workCompleted: findings,
    equipmentObservations:
      "Equipment observations will be expanded when report-specific equipment fields are migrated.",
    recommendations,
    summaryOfFindings: summary,
    customerSummary: summary,
    nextService:
      report.next_service_recommendation ??
      "Next service recommendation placeholder.",
    photoSummary: "Before, after, equipment, and completion photos placeholder.",
  };
}

async function getReportsFromDatabase(): Promise<ReportRecord[]> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "reports"))) {
      throw new Error("The reports table is not available.");
    }

    const columns = await getTableColumns(client, "reports");

    if (!columns.has("id") || !columns.has("report_number")) {
      throw new Error("The reports table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "customer_id",
      "site_id",
      "property_id",
      "pool_id",
      "job_id",
      "water_test_id",
      "technician_id",
      "report_number",
      "report_type",
      "status",
      "report_date",
      "customer_summary",
      "work_completed",
      "summary",
      "findings",
      "recommendations",
      "follow_up_required",
      "next_service_recommendation",
      "internal_notes",
      "notes",
      "metadata",
      "sent_at",
      "created_at",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseReportRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "reports"
       order by ${columns.has("report_date") ? '"report_date" desc' : columns.has("created_at") ? '"created_at" desc' : '"id" desc'}`,
    );

    return rows.map(mapDatabaseReport);
  } finally {
    await client.end();
  }
}

async function getReportFromDatabaseById(
  reportId: string,
): Promise<ReportRecord | undefined> {
  if (!hasDatabaseUrl()) {
    throw new Error("No database URL is configured.");
  }

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "reports"))) {
      throw new Error("The reports table is not available.");
    }

    const columns = await getTableColumns(client, "reports");

    if (!columns.has("id") || !columns.has("report_number")) {
      throw new Error("The reports table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "customer_id",
      "site_id",
      "property_id",
      "pool_id",
      "job_id",
      "water_test_id",
      "technician_id",
      "report_number",
      "report_type",
      "status",
      "report_date",
      "customer_summary",
      "work_completed",
      "summary",
      "findings",
      "recommendations",
      "follow_up_required",
      "next_service_recommendation",
      "internal_notes",
      "notes",
      "metadata",
      "sent_at",
      "created_at",
    ].filter((column) => columns.has(column));

    const rows = await client.unsafe<DatabaseReportRow[]>(
      `select ${readableColumns.map(quoteIdentifier).join(", ")}
       from "reports"
       where "id" = $1
       limit 1`,
      [reportId],
    );

    return rows[0] ? mapDatabaseReport(rows[0]) : undefined;
  } finally {
    await client.end();
  }
}

export async function getReportsWithSource(): Promise<ReportsLoadResult> {
  try {
    const reports = await getReportsFromDatabase();

    logReportSource("database", reports.length);

    return {
      count: reports.length,
      reports,
      source: "database",
    };
  } catch (error) {
    console.error(
      "Falling back to mock reports after database read failed or no database URL was available",
      safeReadError(error),
    );
    logReportSource("mock", mockReports.length);

    return {
      count: mockReports.length,
      reports: mockReports,
      source: "mock",
    };
  }
}

export async function getReports() {
  const result = await getReportsWithSource();

  return result.reports;
}

export async function getReportById(reportId: string) {
  try {
    const report = await getReportFromDatabaseById(reportId);

    if (report) {
      console.info("ClearWater report detail data source", {
        reportId,
        source: "database",
      });

      return report;
    }

    console.info("ClearWater report detail data source", {
      reportId,
      source: "mock",
    });

    return getMockReportById(reportId);
  } catch (error) {
    console.error(
      "Falling back to mock report after database detail read failed",
      safeReadError(error),
    );
    console.info("ClearWater report detail data source", {
      reportId,
      source: "mock",
    });

    return getMockReportById(reportId);
  }
}
