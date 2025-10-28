import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schemas from "./schemas";

dotenv.config()

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: schemas
});

