import { drizzle } from "drizzle-orm/postgres-js";

import { createPostgresClient, getDatabaseUrl } from "./connection";
import * as schema from "./schema";

const databaseUrl =
  getDatabaseUrl() ?? "postgres://postgres:postgres@localhost:5432/clearwater";

const client = createPostgresClient(databaseUrl);
export const db = drizzle(client, { schema });
