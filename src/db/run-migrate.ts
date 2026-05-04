import { spawn } from "node:child_process";

import { getDatabaseUrlSource } from "@/db/connection";

const source = getDatabaseUrlSource();

if (!source) {
  console.warn(
    "No database URL is configured. Skipping migration. Set DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING first.",
  );
  process.exit(0);
}

console.info(`Running Drizzle migrations using ${source}. URL value is hidden.`);

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(command, ["drizzle-kit", "migrate"], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error("Failed to start Drizzle migration.");
  console.error(error);
  process.exit(1);
});
