import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { DetailCard, DetailList } from "@/components/ui/detail-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCustomerById } from "@/features/customers/data/customers";
import { getSitesForCustomer } from "@/features/properties/data/sites";
import { getJobsForCustomer } from "@/lib/mock-data";

type CustomerDetailPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { customerId } = await params;
  const customer = await getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const sites = await getSitesForCustomer(customer.id);
  const recentJobs = getJobsForCustomer(customer.id);

  return (
    <SectionPage
      title={customer.name}
      description="Customer profile with contact, billing, communication, site, job, quote, and invoice context."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={customer.status === "Active" ? "success" : "warning"}>
          {customer.status}
        </StatusBadge>
        <p className="text-sm text-slate-600">{customer.type}</p>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Contact details">
          <DetailList
            items={[
              { label: "Phone", value: customer.phone },
              { label: "Email", value: customer.email },
              { label: "Customer type", value: customer.type },
              { label: "Status", value: customer.status },
            ]}
          />
        </DetailCard>

        <DetailCard title="Billing details">
          <DetailList
            items={[
              { label: "Billing address", value: customer.billingAddress },
              { label: "Invoice terms", value: customer.invoiceTerms },
              {
                label: "Outstanding balance",
                value: customer.outstandingBalance,
              },
            ]}
          />
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Communication preferences">
          <p className="text-sm leading-6 text-slate-700">
            {customer.communicationPreference}
          </p>
        </DetailCard>

        <DetailCard title="Internal notes">
          <p className="text-sm leading-6 text-slate-700">
            {customer.internalNotes}
          </p>
        </DetailCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DetailCard title="Linked properties / sites">
          {sites.length > 0 ? (
            <div className="space-y-3">
              {sites.map((site) => (
                <Link
                  key={site.id}
                  className="block rounded-md border border-slate-200 p-4 transition hover:border-cyan-300"
                  href={`/properties/${site.id}`}
                >
                  <p className="font-semibold text-slate-950">{site.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {site.address}, {site.suburb}
                  </p>
                  <p className="mt-2 text-sm text-amber-700">
                    {site.accessWarning}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Add a site before scheduling services for this customer."
              title="No sites linked"
            />
          )}
        </DetailCard>

        <DetailCard title="Quotes and invoices">
          <DetailList
            items={[
              { label: "Quotes", value: customer.quoteSummary },
              { label: "Invoices", value: customer.invoiceSummary },
            ]}
          />
        </DetailCard>
      </section>

      <DetailCard title="Recent jobs">
        {recentJobs.length > 0 ? (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="grid gap-2 rounded-md border border-slate-200 p-4 text-sm md:grid-cols-[120px_1fr_160px]"
              >
                <p className="font-medium text-slate-500">{job.id}</p>
                <div>
                  <p className="font-semibold text-slate-950">{job.title}</p>
                  <p className="mt-1 text-slate-600">{job.date}</p>
                </div>
                <p className="font-medium text-cyan-700">{job.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Recent jobs will appear here once work is created for this customer."
            title="No recent jobs"
          />
        )}
      </DetailCard>
    </SectionPage>
  );
}
