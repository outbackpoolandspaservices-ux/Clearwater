import {
  getPoolById as getMockPoolById,
  getPoolsForSite as getMockPoolsForSite,
  pools as mockPools,
} from "@/lib/mock-data";
import { isDatabaseDataSourceEnabled } from "@/lib/data-source";

export type PoolRecord = (typeof mockPools)[number];

async function getPoolsFromDatabase(): Promise<PoolRecord[]> {
  // Future Drizzle query target: src/db/schema.ts pools table.
  return mockPools;
}

async function getPoolFromDatabaseById(
  poolId: string,
): Promise<PoolRecord | undefined> {
  // Database querying will be wired after customers/sites are seeded.
  return getMockPoolById(poolId);
}

async function getPoolsFromDatabaseForSite(
  siteId: string,
): Promise<PoolRecord[]> {
  // Future query will filter pools by siteId and organisationId.
  return getMockPoolsForSite(siteId);
}

export async function getPools() {
  if (isDatabaseDataSourceEnabled()) {
    return getPoolsFromDatabase();
  }

  return mockPools;
}

export async function getPoolById(poolId: string) {
  if (isDatabaseDataSourceEnabled()) {
    return getPoolFromDatabaseById(poolId);
  }

  return getMockPoolById(poolId);
}

export async function getPoolsForSite(siteId: string) {
  if (isDatabaseDataSourceEnabled()) {
    return getPoolsFromDatabaseForSite(siteId);
  }

  return getMockPoolsForSite(siteId);
}
