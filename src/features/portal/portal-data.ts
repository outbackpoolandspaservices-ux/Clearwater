import { getCustomers } from "@/features/customers/data/customers";
import {
  getInvoicesWithSource,
  getPaymentsForInvoice,
} from "@/features/invoices/data/invoices";
import { getJobsWithSource } from "@/features/jobs/data/jobs";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { getQuotesWithSource } from "@/features/quotes/data/quotes";
import { getReportsWithSource } from "@/features/reports/data/reports";
import { getWaterTests } from "@/features/water-testing/data/water-tests";

export const portalCustomerId = "cust-flynn";

export async function getPortalData() {
  const [
    customers,
    sites,
    pools,
    jobsResult,
    waterTests,
    reportsResult,
    quotesResult,
    invoicesResult,
  ] = await Promise.all([
    getCustomers(),
    getSites(),
    getPools(),
    getJobsWithSource(),
    getWaterTests(),
    getReportsWithSource(),
    getQuotesWithSource(),
    getInvoicesWithSource(),
  ]);
  const customer =
    customers.find((item) => item.id === portalCustomerId) ?? customers[0];

  if (!customer) {
    throw new Error("Portal demo customer is missing.");
  }

  const customerSites = sites.filter((site) => site.customerId === customer.id);
  const siteIds = new Set(customerSites.map((site) => site.id));
  const customerPools = pools.filter((pool) => siteIds.has(pool.siteId));
  const poolIds = new Set(customerPools.map((pool) => pool.id));
  const jobs = jobsResult.jobs.filter((job) => job.customerId === customer.id);
  const customerWaterTests = waterTests.filter((test) =>
    poolIds.has(test.poolId),
  );
  const customerReports = reportsResult.reports.filter(
    (report) => report.customerId === customer.id,
  );
  const customerQuotes = quotesResult.quotes.filter(
    (quote) => quote.customerId === customer.id,
  );
  const customerInvoices = invoicesResult.invoices.filter(
    (invoice) => invoice.customerId === customer.id,
  );
  const paymentGroups = await Promise.all(
    customerInvoices.map((invoice) => getPaymentsForInvoice(invoice.id)),
  );
  const payments = paymentGroups.flat();

  return {
    customer,
    sites: customerSites,
    pools: customerPools,
    jobs,
    upcomingJobs: jobs.filter((job) => job.status !== "Completed"),
    serviceHistory: jobs.filter((job) => job.status === "Completed"),
    waterTests: customerWaterTests,
    reports: customerReports,
    quotes: customerQuotes,
    quotesAwaitingApproval: customerQuotes.filter((quote) =>
      quote.approvalStatus.toLowerCase().includes("awaiting"),
    ),
    invoices: customerInvoices,
    unpaidInvoices: customerInvoices.filter(
      (invoice) => invoice.paymentStatus !== "Paid",
    ),
    payments,
  };
}
