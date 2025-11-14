import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { campaignContactsTable } from "./campaignContact";

export const callHistoryTable = pgTable("call_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignContactId: uuid("campaign_contact_id")
    .notNull()
    .references(() => campaignContactsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  callStatus: varchar("call_status", {
    enum: ["idle", "queued", "in-progress", "completed", "failed"],
  })
    .notNull()
    .default("idle"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  queuedAt: timestamp("queued_at"),
  callStartTime: timestamp("call_start_time"),
  callEndTime: timestamp("call_end_time"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  summary: text("summary"),
});
