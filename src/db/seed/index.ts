import { drizzle } from "drizzle-orm/postgres-js";

import { createPostgresClient, getDatabaseUrl } from "@/db/connection";
import {
  customers,
  equipment,
  organisations,
  pools,
  roles,
  sites,
  userRoles,
  users,
} from "@/db/schema";

import { customerSeeds } from "./customers";
import { equipmentSeeds } from "./equipment";
import { organisationSeed } from "./organisation";
import { poolSeeds } from "./pools";
import { siteSeeds } from "./sites";
import { roleSeeds, userRoleSeeds, userSeeds } from "./users-roles";

async function seed() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.warn(
      "DATABASE_URL is not configured. Skipping seed. Add DATABASE_URL to .env.local when you are ready to seed PostgreSQL.",
    );
    return;
  }

  const client = createPostgresClient(databaseUrl);
  const db = drizzle(client);

  try {
    await db.insert(organisations).values(organisationSeed).onConflictDoNothing();
    await db.insert(users).values(userSeeds).onConflictDoNothing();
    await db.insert(roles).values(roleSeeds).onConflictDoNothing();
    await db.insert(userRoles).values(userRoleSeeds).onConflictDoNothing();
    await db.insert(customers).values(customerSeeds).onConflictDoNothing();
    await db.insert(sites).values(siteSeeds).onConflictDoNothing();
    await db.insert(pools).values(poolSeeds).onConflictDoNothing();
    await db.insert(equipment).values(equipmentSeeds).onConflictDoNothing();

    console.info("ClearWater seed complete.");
  } finally {
    await client.end();
  }
}

seed().catch((error: unknown) => {
  console.error("ClearWater seed failed.");
  console.error(error);
  process.exitCode = 1;
});
