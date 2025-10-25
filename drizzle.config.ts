import { defineConfig } from "drizzle-kit";
import { env } from "./config/env";

export default defineConfig({
  schema: "./db/schemas/*.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  }
})