import { relations } from "drizzle-orm";
import { campaignsTable } from "./campaign";
import { campaignContactsTable } from "./campaignContact";
import { contactsTable } from "./contact";

export const campaignContactsRelation = relations(
  campaignsTable,
  ({ many }) => ({
    campaignContacts: many(campaignContactsTable),
  }),
);

export const campaignContactsCampaignRelation = relations(
  campaignContactsTable,
  ({ one }) => ({
    campaign: one(campaignsTable, {
      fields: [campaignContactsTable.campaignId],
      references: [campaignsTable.id],
    }),
    contact: one(contactsTable, {
      fields: [campaignContactsTable.contactId],
      references: [contactsTable.id],
    }),
  }),
);

export const contactCampaignsRelation = relations(contactsTable, ({ many }) => ({
  contactCampaigns: many(campaignContactsTable),
}));
