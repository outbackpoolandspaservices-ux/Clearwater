import {
  getCustomerById,
  getJobsForCustomer,
  getPaymentsForInvoice,
  getPoolsForSite,
  getSitesForCustomer,
  getWaterTestsForPool,
  invoices,
  quotes,
  reports,
} from "@/lib/mock-data";

export const portalCustomerId = "cust-flynn";

export function getPortalData() {
  const customer = getCustomerById(portalCustomerId);

  if (!customer) {
    throw new Error("Portal mock customer is missing.");
  }

  const sites = getSitesForCustomer(customer.id);
  const pools = sites.flatMap((site) => getPoolsForSite(site.id));
  const jobs = getJobsForCustomer(customer.id);
  const waterTests = pools.flatMap((pool) => getWaterTestsForPool(pool.id));
  const customerReports = reports.filter(
    (report) => report.customerId === customer.id,
  );
  const customerQuotes = quotes.filter((quote) => quote.customerId === customer.id);
  const customerInvoices = invoices.filter(
    (invoice) => invoice.customerId === customer.id,
  );
  const payments = customerInvoices.flatMap((invoice) =>
    getPaymentsForInvoice(invoice.id),
  );

  return {
    customer,
    sites,
    pools,
    jobs,
    upcomingJobs: jobs.filter((job) => job.status !== "Completed"),
    serviceHistory: jobs.filter((job) => job.status === "Completed"),
    waterTests,
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
