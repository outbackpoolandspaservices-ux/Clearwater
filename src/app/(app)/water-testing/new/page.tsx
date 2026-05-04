import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getJobs } from "@/features/jobs/data/jobs";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { WaterTestForm } from "@/features/water-testing/water-test-form";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewWaterTestPage() {
  const [customers, jobs, pools, sites] = await Promise.all([
    getCustomers(),
    getJobs(),
    getPools(),
    getSites(),
  ]);

  return (
    <SectionPage
      title="Add Water Test"
      description="Record technician water chemistry readings and link them to a customer, property/site, pool, and optional job."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          href="/water-testing"
        >
          Back to water testing
        </Link>
      </div>

      <WaterTestForm
        customers={customers}
        jobs={jobs}
        pools={pools}
        sites={sites}
        technicians={technicians}
      />
    </SectionPage>
  );
}
