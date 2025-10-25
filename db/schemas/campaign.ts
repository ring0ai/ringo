import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const campaignStatusEnum = pgEnum("campaign_status", ["inactive", "active", "paused", "completed"])

export const campaignsTable = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_by: text("created_by").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prompt: text("prompt"),
  status: campaignStatusEnum("status").notNull().default("inactive"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())
})