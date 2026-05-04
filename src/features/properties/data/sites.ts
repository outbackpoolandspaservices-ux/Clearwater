import {
  getSiteById as getMockSiteById,
  getSitesForCustomer as getMockSitesForCustomer,
  sites as mockSites,
} from "@/lib/mock-data";
import { isDatabaseDataSourceEnabled } from "@/lib/data-source";

export type SiteRecord = (typeof mockSites)[number];

async function getSitesFromDatabase(): Promise<SiteRecord[]> {
  // Future Drizzle query target: src/db/schema.ts sites table.
  return mockSites;
}

async function getSiteFromDatabaseById(
  siteId: string,
): Promise<SiteRecord | undefined> {
  // Database querying will be wired after the schema is migrated and seeded.
  return getMockSiteById(siteId);
}

async function getSitesFromDatabaseForCustomer(
  customerId: string,
): Promise<SiteRecord[]> {
  // Future query will filter sites by customerId and organisationId.
  return getMockSitesForCustomer(customerId);
}

export async function getSites() {
  if (isDatabaseDataSourceEnabled()) {
    return getSitesFromDatabase();
  }

  return mockSites;
}

export async function getSiteById(siteId: string) {
  if (isDatabaseDataSourceEnabled()) {
    return getSiteFromDatabaseById(siteId);
  }

  return getMockSiteById(siteId);
}

export async function getSitesForCustomer(customerId: string) {
  if (isDatabaseDataSourceEnabled()) {
    return getSitesFromDatabaseForCustomer(customerId);
  }

  return getMockSitesForCustomer(customerId);
}
