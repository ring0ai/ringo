import dotenv from "dotenv";
import { db } from "@/db";
import { campaignContactsTable, contactsTable } from "@/db/schemas";
import { Queue } from "bull";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { initiateCall } from "@/lib/services/twilio";

dotenv.config();

export const callWorker = (queue: Queue) => {
  queue.process(1, async (job, done) => {
    try {
      console.log("Job received:", job.data);
      const callWorkerDataSchema = z.object({
        campaignId: z.string(),
        contactId: z.string(),
        fromNumber: z.string(),
      });

      const { campaignId, contactId, fromNumber } = callWorkerDataSchema.parse(
        job.data
      );

      const contact = await db.query.contactsTable.findFirst({
        where: eq(contactsTable.id, contactId),
      });
      if (!contact) {
        throw new Error("Contact not found");
      }

      // Call the client
      await initiateCall({
        fromNumber: fromNumber,
        toNumber: contact.number,
        campaignId: campaignId,
        contactId: contact.id,
      });

      await db
        .update(campaignContactsTable)
        .set({
          call_status: "in-progress",
        })
        .where(
          and(
            eq(campaignContactsTable.campaignId, campaignId),
            eq(campaignContactsTable.contactId, contactId)
          )
        );

      done();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      done(new Error(errorMessage));
    }
  });
};
