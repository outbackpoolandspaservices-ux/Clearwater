import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import {
  invoices as mockInvoices,
  payments as mockPayments,
} from "@/lib/mock-data";

export type InvoiceLineItemRecord = {
  amount: string;
  description: string;
  quantity: string;
  type: string;
};

export type PaymentRecord = {
  amount: string;
  date: string;
  id: string;
  invoiceId: string;
  method: string;
  reference: string;
  status: string;
};

export type InvoiceRecord = {
  customerId: string;
  customerName: string;
  dueDate: string;
  gst: string;
  id: string;
  invoiceDate: string;
  jobId: string;
  jobNumber: string;
  lineItems: InvoiceLineItemRecord[];
  number: string;
  paymentStatus: string;
  poolId: string;
  quoteId?: string | null;
  reportId: string | null;
  siteId: string;
  siteName: string;
  status: string;
  subtotal: string;
  totalAmount: string;
  xeroSyncStatus: string;
};

export type InvoiceDataSource = "database" | "mock";
export type InvoicesLoadResult = {
  count: number;
  invoices: InvoiceRecord[];
  source: InvoiceDataSource;
};

type DatabaseInvoiceRow = {
  customer_id?: string | null;
  customer_name?: string | null;
  due_at?: Date | string | null;
  gst_cents?: number | null;
  id: string;
  invoice_number?: string | null;
  issued_at?: Date | string | null;
  job_id?: string | null;
  job_number?: string | null;
  payment_status?: string | null;
  pool_id?: string | null;
  quote_id?: string | null;
  report_id?: string | null;
  site_id?: string | null;
  site_name?: string | null;
  status?: string | null;
  subtotal_cents?: number | null;
  total_cents?: number | null;
  xero_sync_status?: string | null;
};

type DatabaseLineItemRow = {
  description?: string | null;
  item_type?: string | null;
  quantity?: number | null;
  total_cents?: number | null;
};

type DatabasePaymentRow = {
  amount_cents?: number | null;
  id: string;
  invoice_id?: string | null;
  method?: string | null;
  provider_reference?: string | null;
  received_at?: Date | string | null;
  status?: string | null;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function money(cents?: number | null) {
  return new Intl.NumberFormat("en-AU", {
    currency: "AUD",
    style: "currency",
  }).format((cents ?? 0) / 100);
}

function formatDate(value?: Date | string | null) {
  if (!value) return "Not dated";

  return new Intl.DateTimeFormat("en-CA").format(new Date(value));
}

function statusLabel(value?: string | null) {
  const labels: Record<string, string> = {
    draft: "Draft",
    overdue: "Overdue",
    paid: "Paid",
    partially_paid: "Part paid",
    sent: "Sent",
    void: "Void",
  };

  return value ? labels[value] ?? value : "Draft";
}

function paymentLabel(value?: string | null) {
  const labels: Record<string, string> = {
    Overdue: "Overdue",
    Paid: "Paid",
    Unpaid: "Unpaid",
    paid: "Paid",
    partially_paid: "Part paid",
    sent: "Unpaid",
  };

  return value ? labels[value] ?? value : "Unpaid";
}

function xeroLabel(value?: string | null) {
  const labels: Record<string, string> = {
    not_synced: "Not synced",
    ready_to_sync: "Ready to sync",
    sync_failed: "Sync failed",
    synced: "Synced",
  };

  return value ? labels[value] ?? value : "Not synced";
}

function mapMockInvoice(invoice: (typeof mockInvoices)[number]): InvoiceRecord {
  return {
    ...invoice,
    customerName: "",
    jobNumber: "",
    quoteId: null,
    reportId: invoice.reportId,
    siteName: "",
  };
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

async function getLineItems(
  client: ReturnType<typeof createPostgresClient>,
  invoiceId: string,
) {
  if (!(await tableExists(client, "invoice_line_items"))) return [];

  const rows = await client<DatabaseLineItemRow[]>`
    select item_type, description, quantity, total_cents
    from invoice_line_items
    where invoice_id = ${invoiceId}
    order by id asc
  `;

  return rows.map((item) => ({
    amount: money(item.total_cents),
    description: item.description ?? "Invoice item",
    quantity: String(item.quantity ?? 1),
    type: item.item_type ?? "Other",
  }));
}

async function getPaymentsFromDatabase(
  client: ReturnType<typeof createPostgresClient>,
  invoiceId: string,
) {
  if (!(await tableExists(client, "payments"))) return [];

  const rows = await client<DatabasePaymentRow[]>`
    select id, invoice_id, amount_cents, status, method, provider_reference, received_at
    from payments
    where invoice_id = ${invoiceId}
    order by received_at desc nulls last, id desc
  `;

  return rows.map((payment) => ({
    amount: money(payment.amount_cents),
    date: formatDate(payment.received_at),
    id: payment.id,
    invoiceId: payment.invoice_id ?? invoiceId,
    method: payment.method ?? "Payment method placeholder",
    reference: payment.provider_reference ?? "",
    status: statusLabel(payment.status),
  }));
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown invoice read error.",
  };
}

async function mapDatabaseInvoice(
  client: ReturnType<typeof createPostgresClient>,
  invoice: DatabaseInvoiceRow,
): Promise<InvoiceRecord> {
  const lineItems = await getLineItems(client, invoice.id);

  return {
    customerId: invoice.customer_id ?? "",
    customerName: invoice.customer_name ?? "Database customer",
    dueDate: formatDate(invoice.due_at),
    gst: money(invoice.gst_cents),
    id: invoice.id,
    invoiceDate: formatDate(invoice.issued_at),
    jobId: invoice.job_id ?? "",
    jobNumber: invoice.job_number ?? "",
    lineItems,
    number:
      invoice.invoice_number ?? `INV-${invoice.id.slice(0, 8).toUpperCase()}`,
    paymentStatus: paymentLabel(invoice.payment_status ?? invoice.status),
    poolId: invoice.pool_id ?? "",
    quoteId: invoice.quote_id ?? null,
    reportId: invoice.report_id ?? null,
    siteId: invoice.site_id ?? "",
    siteName: invoice.site_name ?? "",
    status: statusLabel(invoice.status),
    subtotal: money(invoice.subtotal_cents),
    totalAmount: money(invoice.total_cents),
    xeroSyncStatus: xeroLabel(invoice.xero_sync_status),
  };
}

async function getInvoicesFromDatabase() {
  if (!hasDatabaseUrl()) throw new Error("No database URL is configured.");

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "invoices"))) {
      throw new Error("The invoices table is not available.");
    }

    const columns = await getTableColumns(client, "invoices");

    if (!columns.has("id") || !columns.has("invoice_number")) {
      throw new Error("The invoices table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "customer_id",
      "site_id",
      "pool_id",
      "job_id",
      "quote_id",
      "report_id",
      "invoice_number",
      "status",
      "payment_status",
      "subtotal_cents",
      "gst_cents",
      "total_cents",
      "issued_at",
      "due_at",
      "xero_sync_status",
    ].filter((column) => columns.has(column));
    const rows = await client.unsafe<DatabaseInvoiceRow[]>(
      `select ${readableColumns.map((column) => `i.${quoteIdentifier(column)}`).join(", ")},
        c.display_name as customer_name,
        s.name as site_name,
        j.job_number as job_number
       from invoices i
       left join customers c on c.id = i.customer_id
       left join sites s on s.id = i.site_id
       left join jobs j on j.id = i.job_id
       order by ${columns.has("issued_at") ? "i.issued_at desc nulls last" : "i.id desc"}`,
    );

    return Promise.all(rows.map((invoice) => mapDatabaseInvoice(client, invoice)));
  } finally {
    await client.end();
  }
}

export async function getInvoicesWithSource(): Promise<InvoicesLoadResult> {
  try {
    const invoices = await getInvoicesFromDatabase();

    console.info("ClearWater invoices data source", {
      count: invoices.length,
      source: "database",
    });

    return { count: invoices.length, invoices, source: "database" };
  } catch (error) {
    console.error(
      "Falling back to mock invoices after database read failed or no database URL was available",
      safeReadError(error),
    );
    const invoices = mockInvoices.map(mapMockInvoice);

    return { count: invoices.length, invoices, source: "mock" };
  }
}

export async function getInvoiceById(invoiceId: string) {
  try {
    const invoices = await getInvoicesFromDatabase();
    const invoice = invoices.find(
      (item) => item.id === invoiceId || item.number === invoiceId,
    );

    if (invoice) return invoice;

    return mockInvoices.map(mapMockInvoice).find(
      (item) => item.id === invoiceId || item.number === invoiceId,
    );
  } catch (error) {
    console.error(
      "Falling back to mock invoice after database detail read failed",
      safeReadError(error),
    );

    return mockInvoices.map(mapMockInvoice).find(
      (item) => item.id === invoiceId || item.number === invoiceId,
    );
  }
}

export async function getPaymentsForInvoice(invoiceId: string) {
  try {
    if (!hasDatabaseUrl()) throw new Error("No database URL is configured.");

    const client = createPostgresClient();

    try {
      return await getPaymentsFromDatabase(client, invoiceId);
    } finally {
      await client.end();
    }
  } catch {
    return mockPayments
      .filter((payment) => payment.invoiceId === invoiceId)
      .map((payment) => ({ ...payment }));
  }
}
