import z from "zod";
import twilio from "twilio";
import { env } from "@/config/env";

const callSchema = z.object({
  fromNumber: z.string(),
  toNumber: z.string(),
  campaignId: z.string(),
  contactId: z.string(),
});

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

const twiml = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings
    .reduce((acc, str, i) => acc + str + (values[i] || ""), "")
    .replace(/>\s+</g, "><")
    .trim();
};

export const initiateCall = async ({
  fromNumber,
  toNumber,
  campaignId,
  contactId,
}: z.infer<typeof callSchema>) => {
  const websocketUrl = `wss://${
    process.env.API_BASE_URL?.split("://")[1]
  }/api/socket`;
  console.log(`The websocket url => ${websocketUrl}`);

  const template = twiml`
    <Response>
      <Say language="en">This is a test message.</Say>
      <Connect>
        <Stream url="${websocketUrl}">
          <Parameter name="campaignId" value="${campaignId}"/>
          <Parameter name="contactId" value="${contactId}"/>
        </Stream>
      </Connect>
    </Response>
  `;

  await client.calls.create({
    twiml: template,
    from: fromNumber,
    to: toNumber,
  });
};
