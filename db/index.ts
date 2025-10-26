import "server-only";
import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/neon-http";
// Import the schemas from the `db/schemas` directory
import * as schemas from "./schemas";

export const db = drizzle(env.DATABASE_URL, {
  schema: schemas
});

