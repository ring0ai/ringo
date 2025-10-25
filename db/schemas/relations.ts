import { relations } from "drizzle-orm";
import { campaignsTable } from "./campaign";
import { campaignContactsTable } from "./campaignContacts";
import { contactsTable } from "./contact";

export const contactCampaignsRelation = relations(
  campaignsTable,
  ({ many }) => ({
    contactCampaign: many(campaignsTable),
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

export const campaignContactRelation = relations(contactsTable, ({ many }) => ({
  campaignContacts: many(campaignContactsTable),
}));
