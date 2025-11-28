import { Queue } from "bullmq";
import { redisClient } from "../redis";
import { setupCallWorker } from "./workers/callWorker";

const callQueue = new Queue("callQueue", { connection: redisClient });
setupCallWorker(callQueue.name);

export { callQueue };
