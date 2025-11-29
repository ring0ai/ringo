import deepgramDefaultConfig from "@/config/deepgram";
import { env } from "@/config/env";
import { db } from "@/db";
import { campaignContactsTable, campaignsTable } from "@/db/schemas";
import { and, eq, sql } from "drizzle-orm";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";

const startTime: { [key: string]: number } = {};

const getDeepgramWs = async (
  twilioWs: WebSocket,
  streamSid: string,
  campaignId: string
): Promise<WebSocket> => {
  const ws = new WebSocket("wss://agent.deepgram.com/v1/agent/converse", {
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
    },
  });

  const campaign = await db.query.campaignsTable.findFirst({
    where: eq(campaignsTable.id, campaignId),
  });

  const config = {
    ...deepgramDefaultConfig,
    agent: {
      ...deepgramDefaultConfig.agent,
      think: {
        ...deepgramDefaultConfig.agent.think,
        prompt: `#User Prompt \n ${campaign?.prompt} \n\n ${deepgramDefaultConfig.agent.think.prompt}`,
      },
      greeting: "Hello! Is this the right time for you to speak to me?",
    },
  };

  return new Promise((resolve, reject) => {
    ws.on("open", () => {
      ws.send(JSON.stringify(config));
      resolve(ws);
    });

    ws.on("message", (message) => {
      if (typeof message === "string") {
        const decoded = JSON.parse(message);
        if (decoded.type === "UserStartedSpeaking") {
          console.log("Clearing twilio stream");
          twilioWs.send(
            JSON.stringify({
              event: "clear",
              streamSid: streamSid,
            })
          );
          return;
        }
      }

      const rawMulaw = message as Buffer;

      const mediaMessage = {
        event: "media",
        streamSid: streamSid,
        media: { payload: rawMulaw.toString("base64") },
      };
      twilioWs.send(JSON.stringify(mediaMessage));
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    });
  });
};

export const conversationHandler = async (
  twilioWs: WebSocket,
  req: IncomingMessage
) => {
  console.log("Twilio Connection established");

  const { deepgramWs, streamSid } = await twilioReceiver(twilioWs);
};

async function twilioReceiver(twilioWs: WebSocket) {
  console.log("Listening for incoming messages from Twilio");

  const BUFFER_SIZE = 20 * 160;
  let inbuffer = Buffer.alloc(0);

  let streamSid: string;
  let campaignId: string;
  let contactId: string;
  let deepgramWs: WebSocket | null;

  return new Promise<{ deepgramWs: WebSocket | null; streamSid: string }>(
    (resolve, reject) => {
      twilioWs.on("message", async (message, isBinary) => {
        try {
          if (isBinary) {
            console.log("Binary message received:", message);
            return;
          }

          const messageData = JSON.parse(message.toString());

          switch (messageData.event) {
            case "connected":
              console.log("🟢 Connected");
              break;

            case "start":
              console.log("📞 Start event received");
              streamSid = messageData.start.streamSid;
              campaignId = messageData.start.customParameters.campaignId;
              contactId = messageData.start.customParameters.contactId;
              startTime[streamSid] = Date.now();

              // Update the progress in database
              await db.transaction(async (trx) => {
                await trx
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

                await trx
                  .update(campaignsTable)
                  .set({
                    status: "active",
                  })
                  .where(
                    and(
                      eq(campaignsTable.id, campaignId),
                      eq(campaignsTable.status, "inactive")
                    )
                  );
              });

              deepgramWs = await getDeepgramWs(twilioWs, streamSid, campaignId);
              resolve({ deepgramWs, streamSid });
              break;

            case "media":
              const media = messageData.media;
              const chunk = Buffer.from(media.payload, "base64");
              if (media.track === "inbound") {
                inbuffer = Buffer.concat([inbuffer, chunk]);
              }

              // Check if the conversation is over 5min
              if (Date.now() - startTime[streamSid] > 5 * 60 * 1000) {
                console.log("🔴Ending the call due to time limit");
                if (deepgramWs) deepgramWs.close(1000, "Ended");
                twilioWs.close(1000, "Ended");
                break;
              }

              while (inbuffer.length >= BUFFER_SIZE) {
                const chunk = inbuffer.subarray(0, BUFFER_SIZE);
                if (chunk && deepgramWs) {
                  deepgramWs.send(chunk);
                }
                inbuffer = inbuffer.subarray(BUFFER_SIZE);
              }
              break;

            case "stop":
              console.log("🔴 Ended");
              if (deepgramWs) deepgramWs.close(1000, "Ended");
              twilioWs.close(1000, "Ended");

              // Update the progress in database
              await db.transaction(async (trx) => {
                await trx
                  .update(campaignContactsTable)
                  .set({
                    call_status: "completed",
                  })
                  .where(
                    and(
                      eq(campaignContactsTable.campaignId, campaignId),
                      eq(campaignContactsTable.contactId, contactId)
                    )
                  );

                await trx.execute(
                  sql`
                    UPDATE campaigns
                    SET status = 'completed'
                    WHERE id = ${campaignId}
                      AND NOT EXISTS (
                        SELECT 1
                        FROM campaign_contacts
                        WHERE campaign_id = ${campaignId}
                          AND call_status != 'completed'
                      );
                  `
                );
              });

              break;

            default:
              console.log("Unknown event:", messageData.event);
          }
        } catch (error) {
          console.error("Error in Twilio receiver:", error);
          reject(error);
        }
      });
    }
  );
}
