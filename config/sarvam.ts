import { env } from "process";
import { SarvamAIClient } from "sarvamai";

const sarvamai = new SarvamAIClient({
  apiSubscriptionKey: env.SARVAM_API_SUBSCRIPTION_KEY,
});

export default sarvamai;
