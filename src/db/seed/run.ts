import type { drizzle } from "drizzle-orm/postgres-js";

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

type SeedDatabase = ReturnType<typeof drizzle>;

export async function seedInitialClearWaterData(db: SeedDatabase) {
  await db.insert(organisations).values(organisationSeed).onConflictDoNothing();
  await db.insert(users).values(userSeeds).onConflictDoNothing();
  await db.insert(roles).values(roleSeeds).onConflictDoNothing();
  await db.insert(userRoles).values(userRoleSeeds).onConflictDoNothing();
  await db.insert(customers).values(customerSeeds).onConflictDoNothing();
  await db.insert(sites).values(siteSeeds).onConflictDoNothing();
  await db.insert(pools).values(poolSeeds).onConflictDoNothing();
  await db.insert(equipment).values(equipmentSeeds).onConflictDoNothing();
}
