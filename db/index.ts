import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(env.DATABASE_URL);