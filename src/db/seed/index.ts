import { createPostgresClient, getDatabaseUrl } from "@/db/connection";
import { seedInitialClearWaterData } from "./run";

async function seed() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.warn(
      "No database URL is configured. Skipping seed. Add DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING when you are ready to seed PostgreSQL.",
    );
    return;
  }

  const client = createPostgresClient(databaseUrl);

  try {
    await seedInitialClearWaterData(client);
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
