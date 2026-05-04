import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { JobForm } from "@/features/jobs/job-form";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewJobPage() {
  const [customers, sites, pools] = await Promise.all([
    getCustomers(),
    getSites(),
    getPools(),
  ]);

  return (
    <SectionPage
      title="Add Job"
      description="Create a service visit linked to a customer, property/site, and pool. Recurrence and detailed technician workflow stay as safe placeholders for now."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          href="/jobs"
        >
          Back to jobs
        </Link>
      </div>

      <JobForm
        customers={customers}
        pools={pools}
        sites={sites}
        technicians={technicians}
      />
    </SectionPage>
  );
}
