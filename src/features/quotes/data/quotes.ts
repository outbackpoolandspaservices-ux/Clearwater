import { createPostgresClient, hasDatabaseUrl } from "@/db/connection";
import { quotes as mockQuotes } from "@/lib/mock-data";

export type QuoteLineItemRecord = {
  amount: string;
  description: string;
  quantity: string;
  type: string;
};

export type QuoteRecord = {
  approvalStatus: string;
  customerId: string;
  customerName: string;
  expiryDate: string;
  gst: string;
  id: string;
  jobId: string;
  jobNumber: string;
  lineItems: QuoteLineItemRecord[];
  number: string;
  poolId: string;
  quoteDate: string;
  reportId: string | null;
  siteId: string;
  siteName: string;
  status: string;
  subtotal: string;
  terms: string;
  title: string;
  totalAmount: string;
};

export type QuoteDataSource = "database" | "mock";
export type QuotesLoadResult = {
  count: number;
  quotes: QuoteRecord[];
  source: QuoteDataSource;
};

type DatabaseQuoteRow = {
  approval_status?: string | null;
  customer_id?: string | null;
  customer_name?: string | null;
  gst_cents?: number | null;
  id: string;
  issued_at?: Date | string | null;
  job_id?: string | null;
  job_number?: string | null;
  pool_id?: string | null;
  quote_number?: string | null;
  report_id?: string | null;
  site_id?: string | null;
  site_name?: string | null;
  status?: string | null;
  subtotal_cents?: number | null;
  terms?: string | null;
  title?: string | null;
  total_cents?: number | null;
  valid_until?: Date | string | null;
};

type DatabaseLineItemRow = {
  description?: string | null;
  item_type?: string | null;
  quantity?: number | null;
  total_cents?: number | null;
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
    accepted: "Accepted",
    converted: "Converted to invoice",
    declined: "Declined",
    draft: "Draft",
    expired: "Expired",
    sent: "Sent",
  };

  return value ? labels[value] ?? value : "Draft";
}

function mapMockQuote(quote: (typeof mockQuotes)[number]): QuoteRecord {
  return {
    ...quote,
    customerName: "",
    jobNumber: "",
    lineItems: quote.lineItems,
    reportId: quote.reportId,
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
  quoteId: string,
) {
  if (!(await tableExists(client, "quote_line_items"))) return [];

  const rows = await client<DatabaseLineItemRow[]>`
    select item_type, description, quantity, total_cents
    from quote_line_items
    where quote_id = ${quoteId}
    order by id asc
  `;

  return rows.map((item) => ({
    amount: money(item.total_cents),
    description: item.description ?? "Quote item",
    quantity: String(item.quantity ?? 1),
    type: item.item_type ?? "Other",
  }));
}

function safeReadError(error: unknown) {
  return {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown quote read error.",
  };
}

async function mapDatabaseQuote(
  client: ReturnType<typeof createPostgresClient>,
  quote: DatabaseQuoteRow,
): Promise<QuoteRecord> {
  const lineItems = await getLineItems(client, quote.id);

  return {
    approvalStatus: quote.approval_status ?? "Not sent",
    customerId: quote.customer_id ?? "",
    customerName: quote.customer_name ?? "Database customer",
    expiryDate: formatDate(quote.valid_until),
    gst: money(quote.gst_cents),
    id: quote.id,
    jobId: quote.job_id ?? "",
    jobNumber: quote.job_number ?? "",
    lineItems,
    number: quote.quote_number ?? `Q-${quote.id.slice(0, 8).toUpperCase()}`,
    poolId: quote.pool_id ?? "",
    quoteDate: formatDate(quote.issued_at),
    reportId: quote.report_id ?? null,
    siteId: quote.site_id ?? "",
    siteName: quote.site_name ?? "",
    status: statusLabel(quote.status),
    subtotal: money(quote.subtotal_cents),
    terms: quote.terms ?? "Terms and conditions placeholder.",
    title: quote.title ?? "Quote",
    totalAmount: money(quote.total_cents),
  };
}

async function getQuotesFromDatabase() {
  if (!hasDatabaseUrl()) throw new Error("No database URL is configured.");

  const client = createPostgresClient();

  try {
    if (!(await tableExists(client, "quotes"))) {
      throw new Error("The quotes table is not available.");
    }

    const columns = await getTableColumns(client, "quotes");

    if (!columns.has("id") || !columns.has("quote_number")) {
      throw new Error("The quotes table is missing required columns.");
    }

    const readableColumns = [
      "id",
      "customer_id",
      "site_id",
      "pool_id",
      "job_id",
      "report_id",
      "quote_number",
      "title",
      "status",
      "approval_status",
      "subtotal_cents",
      "gst_cents",
      "total_cents",
      "issued_at",
      "valid_until",
      "terms",
    ].filter((column) => columns.has(column));
    const rows = await client.unsafe<DatabaseQuoteRow[]>(
      `select ${readableColumns.map((column) => `q.${quoteIdentifier(column)}`).join(", ")},
        c.display_name as customer_name,
        s.name as site_name,
        j.job_number as job_number
       from quotes q
       left join customers c on c.id = q.customer_id
       left join sites s on s.id = q.site_id
       left join jobs j on j.id = q.job_id
       order by ${columns.has("issued_at") ? "q.issued_at desc nulls last" : "q.id desc"}`,
    );

    return Promise.all(rows.map((quote) => mapDatabaseQuote(client, quote)));
  } finally {
    await client.end();
  }
}

export async function getQuotesWithSource(): Promise<QuotesLoadResult> {
  try {
    const quotes = await getQuotesFromDatabase();

    console.info("ClearWater quotes data source", {
      count: quotes.length,
      source: "database",
    });

    return { count: quotes.length, quotes, source: "database" };
  } catch (error) {
    console.error(
      "Falling back to mock quotes after database read failed or no database URL was available",
      safeReadError(error),
    );
    const quotes = mockQuotes.map(mapMockQuote);

    return { count: quotes.length, quotes, source: "mock" };
  }
}

export async function getQuotes() {
  const result = await getQuotesWithSource();

  return result.quotes;
}

export async function getQuoteById(quoteId: string) {
  try {
    const quotes = await getQuotesFromDatabase();
    const quote = quotes.find(
      (item) => item.id === quoteId || item.number === quoteId,
    );

    if (quote) return quote;

    return mockQuotes.map(mapMockQuote).find(
      (item) => item.id === quoteId || item.number === quoteId,
    );
  } catch (error) {
    console.error(
      "Falling back to mock quote after database detail read failed",
      safeReadError(error),
    );

    return mockQuotes.map(mapMockQuote).find(
      (item) => item.id === quoteId || item.number === quoteId,
    );
  }
}
