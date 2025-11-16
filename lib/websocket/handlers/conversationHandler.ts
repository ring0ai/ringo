import deepgramDefaultConfig from "@/config/deepgram";
import { env } from "@/config/env";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";

const getDeepgramWs = async (
  twilioWs: WebSocket,
  streamSid: string,
  campaignId: string,
): Promise<WebSocket> => {
  const ws = new WebSocket("wss://agent.deepgram.com/v1/agent/converse", {
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
    },
  });
  let config = deepgramDefaultConfig;

  return new Promise((resolve, reject) => {
    ws.on("open", () => {
      ws.send(JSON.stringify(config));
      resolve(ws);
    });

    ws.on("message", (message) => {
      // console.log("Received message from Deepgram:", message);
      if (typeof message === "string") {
        // console.log("Received message from Deepgram:", message);
        const decoded = JSON.parse(message);
        if (decoded.type === "UserStartedSpeaking") {
          console.log("Clearing twilio stream");
          twilioWs.send(
            JSON.stringify({
              event: "clear",
              streamSid: streamSid,
            }),
          );
          return;
        }
      }

      console.log(typeof message);
      const rawMulaw = message as Buffer;

      const mediaMessage = {
        event: "media",
        streamSid: streamSid,
        media: { payload: rawMulaw.toString("base64") },
      };
      // console.log("Sending message to twilio:", mediaMessage);
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
  req: IncomingMessage,
) => {
  console.log("Twilio Connection established");

  const { deepgramWs, streamSid } = await twilioReceiver(twilioWs);
};

async function twilioReceiver(twilioWs: WebSocket) {
  console.log("Listening for incoming messages from Twilio");

  const BUFFER_SIZE = 20 * 160;
  let inbuffer = Buffer.alloc(0);

  let streamSid: string;
  let campaignId;
  let contactId;
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
              deepgramWs = await getDeepgramWs(twilioWs, streamSid, campaignId);
              resolve({ deepgramWs, streamSid });
              break;

            case "media":
              const media = messageData.media;
              const chunk = Buffer.from(media.payload, "base64");
              if (media.track === "inbound") {
                inbuffer = Buffer.concat([inbuffer, chunk]);
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
              break;

            default:
              console.log("Unknown event:", messageData.event);
          }
        } catch (error) {
          console.error("Error in Twilio receiver:", error);
          reject(error);
        }
      });
    },
  );
}
