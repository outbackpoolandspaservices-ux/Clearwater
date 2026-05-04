import {
  createPostgresClient,
  getDatabaseUrl,
  getDatabaseUrlSource,
} from "@/db/connection";
import { getSetupTableCounts } from "@/db/table-counts";
import { getDataSourceLabel } from "@/lib/data-source";

async function verifyCounts() {
  const databaseUrl = getDatabaseUrl();
  const source = getDatabaseUrlSource();

  console.info("ClearWater database table count verification");
  console.info(`Data source mode: ${getDataSourceLabel()}`);

  if (!databaseUrl || !source) {
    console.warn(
      "No database URL is configured. Skipping table counts. The app can still run in mock mode.",
    );
    return;
  }

  console.info(`Database URL configured: yes (${source})`);
  console.info("Database URL value: hidden");

  const client = createPostgresClient(databaseUrl);

  try {
    const counts = await getSetupTableCounts(client);

    for (const [table, count] of Object.entries(counts)) {
      if (count === "missing") {
        console.info(`${table}: missing`);
      } else {
        console.info(`${table}: ${count}`);
      }
    }
  } finally {
    await client.end();
  }
}

verifyCounts().catch((error: unknown) => {
  console.error("ClearWater table count verification failed.");
  console.error(error);
  process.exitCode = 1;
});
