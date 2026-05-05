import { SectionPage } from "@/components/app-shell/section-page";
import { getCustomers } from "@/features/customers/data/customers";
import { getPools } from "@/features/pools/data/pools";
import { getSites } from "@/features/properties/data/sites";
import { getWaterTestsWithSource } from "@/features/water-testing/data/water-tests";
import { WaterTestingWorkspace } from "@/features/water-testing/water-testing-workspace";
import { technicians } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

type WaterTestingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WaterTestingPage({
  searchParams,
}: WaterTestingPageProps) {
  const params = searchParams ? await searchParams : {};
  const [customers, pools, sites, waterTestsResult] = await Promise.all([
    getCustomers(),
    getPools(),
    getSites(),
    getWaterTestsWithSource(),
  ]);
  const { waterTests } = waterTestsResult;

  return (
    <SectionPage
      title="Water Testing"
      description="Water chemistry readings, practical guide ranges, technician-reviewed BioGuard product suggestions, and test history for each pool."
    >
      <WaterTestingWorkspace
        customers={customers}
        pools={pools}
        sites={sites}
        technicians={technicians}
        initialStatus={firstParam(params.status)}
        waterTests={waterTests}
      />
    </SectionPage>
  );
}
