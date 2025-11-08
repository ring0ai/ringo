import deepgramDefaultConfig from "@/config/deepgram";
import { env } from "@/config/env";
import { WebSocket } from "ws";

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
  let config = deepgramDefaultConfig;
  // TODO: Update config based on campaign

  // wait for the connection to be established
  await new Promise((resolve, reject) => {
    ws.on("open", resolve);
    ws.on("error", reject);
  });

  ws.send(JSON.stringify(config));

  ws.on("message", (message) => {
    console.log("Received message from Deepgram:", message);
    if (typeof message === "string") {
      console.log("Received message from Deepgram:", message);
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

    console.log(typeof message);
    const rawMulaw = message as Buffer;

    const mediaMessage = {
      event: "media",
      streamSid: streamSid,
      media: { payload: rawMulaw.toString("base64") },
    };
    console.log("Sending message to twilio:", mediaMessage);
    twilioWs.send(JSON.stringify(mediaMessage));
  });

  return ws;
};

export const conversationHandler = (twilioWs: WebSocket, req: any) => {
  console.log("Twilio Connection established");

  const audioQueue: Buffer<ArrayBuffer>[] = [];
  let streamSid: string;
  let campaignId;
  let contactId;
  let deepgramWs: WebSocket | null = null;

  // This function sends audio to deepgram
  function deepgramSender() {
    console.log("deepgram_sender started");
    setInterval(() => {
      const chunk = audioQueue.shift();
      if (chunk && deepgramWs) {
        console.log("Sending audio to deepgram");
        deepgramWs.send(chunk);
      }
    }, 10);
  }

  // This function handles the incoming data from twilio websocket
  function twilioReceiver() {
    console.log("Listening for incoming messages from Twilio");

    const BUFFER_SIZE = 20 * 160;
    let inbuffer = Buffer.alloc(0);

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
            console.log("🟢 Started");
            streamSid = messageData.start.streamSid;
            campaignId = messageData.start.customParameters.campaignId;
            contactId = messageData.start.customParameters.contactId;
            deepgramWs = await getDeepgramWs(twilioWs, streamSid, campaignId);
            deepgramSender();
            break;
          case "media":
            const media = messageData.media;
            const chunk = Buffer.from(media.payload, "base64");
            if (media.track == "inbound") {
              inbuffer = Buffer.concat([inbuffer, chunk]);
            }

            while (inbuffer.length >= BUFFER_SIZE) {
              const chunk = inbuffer.subarray(0, BUFFER_SIZE);
              audioQueue.push(chunk);
              inbuffer = inbuffer.subarray(BUFFER_SIZE);
            }

            break;
          case "stop":
            console.log("🔴 Ended");
            if (deepgramWs) {
              deepgramWs.close(1000, "Ended");
            }
            twilioWs.close(1000, "Ended");
            break;
          default:
            console.log("Unknown event:", messageData.event);
        }
      } catch (error) {
        console.log("Error in twilio receiver", error);
      }
    });
  }

  twilioReceiver();
};
