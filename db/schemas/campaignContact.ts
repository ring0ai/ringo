import { pgTable, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { campaignsTable } from "./campaign";
import { contactsTable } from "./contact";

export const callStatusEnum = pgEnum("call_status", [
  "idle",
  "queued",
  "in-progress",
  "completed"
])

export const campaignContactsTable = pgTable("campaign_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaignsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contactsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  call_status: callStatusEnum("call_status").notNull().default("idle"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

