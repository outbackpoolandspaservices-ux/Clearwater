import { getDatabaseUrlSource } from "@/db/connection";
import { getDataSourceLabel } from "@/lib/data-source";

const source = getDatabaseUrlSource();

console.info("ClearWater database configuration check");
console.info(`Data source mode: ${getDataSourceLabel()}`);

if (source) {
  console.info(`Database URL configured: yes (${source})`);
  console.info("Database URL value: hidden");
} else {
  console.info("Database URL configured: no");
  console.info(
    "Set DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING before running migrations.",
  );
}

if (getDataSourceLabel() === "mock") {
  console.info("UI mode: safe mock fallback is active");
}
