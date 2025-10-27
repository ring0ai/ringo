import { env } from "@/config/env";
import { db } from "@/db";
import { campaignContactsTable, contactsTable } from "@/db/schemas";
import { Queue } from "bull";
import { and, eq } from "drizzle-orm";
import z from "zod";

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
      const client = require("twilio")(
        env.TWILIO_ACCOUNT_SID,
        env.TWILIO_AUTH_TOKEN
      );

      const twiml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say language="en">"This call may be monitored or recorded for quality purposes"</Say>
          <Connect>
            <Stream url="wss://${env.API_BASE_URL}/api/campaigns/${campaignId}/calls/${contact.id}" />
          </Connect>
        </Response>
      `;

      await client.calls.create({
        twiml: twiml,
        from: fromNumber,
        to: contact.number,
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
