import { Worker } from "bullmq";
import { db } from "@/db";
import { campaignContactsTable, contactsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { initiateCall } from "@/lib/services/twilio";
import { redisClient } from "@/lib/redis";


export const setupCallWorker = (queueName: string) => {
  new Worker(queueName, async (job) => {
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
  }, {connection: redisClient});
};
