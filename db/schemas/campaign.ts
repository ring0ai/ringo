import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { contactsTable } from "./contact";
import { campaignContactsTable } from "./campaignContacts";

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

export const campaignContactRelation = relations(contactsTable, ({many}) => ({
  campaignContacts: many(campaignContactsTable)
}));