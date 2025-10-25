import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { campaignsTable } from "./campaign";
import { relations } from "drizzle-orm";
import { contactsTable } from "./contact";

export const campaignContactsTable = pgTable("campaign_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => campaignsTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  contactId: uuid("contact_id").notNull().references(() => contactsTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())
})

export const campaignContactsCampaignRelation = relations(campaignContactsTable, ({one})=>({
  campaign: one(campaignsTable, {
    fields: [campaignContactsTable.campaignId],
    references: [campaignsTable.id]
  }),
  contact: one(contactsTable, {
    fields: [campaignContactsTable.contactId],
    references: [contactsTable.id]
  })
}))