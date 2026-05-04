import {
  customers as mockCustomers,
  getCustomerById as getMockCustomerById,
} from "@/lib/mock-data";
import { isDatabaseDataSourceEnabled } from "@/lib/data-source";

export type CustomerRecord = (typeof mockCustomers)[number];

async function getCustomersFromDatabase(): Promise<CustomerRecord[]> {
  // Database querying will be enabled after the first seed/migration pass.
  // Keep mock fallback active so the current demo never depends on a local DB.
  return mockCustomers;
}

async function getCustomerFromDatabaseById(
  customerId: string,
): Promise<CustomerRecord | undefined> {
  // Future Drizzle query target: src/db/schema.ts customers table.
  return getMockCustomerById(customerId);
}

export async function getCustomers() {
  if (isDatabaseDataSourceEnabled()) {
    return getCustomersFromDatabase();
  }

  return mockCustomers;
}

export async function getCustomerById(customerId: string) {
  if (isDatabaseDataSourceEnabled()) {
    return getCustomerFromDatabaseById(customerId);
  }

  return getMockCustomerById(customerId);
}
