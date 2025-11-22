import dotenv from "dotenv";
import Redis from "ioredis"

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
  throw new Error("Redis connection error");
});
redisClient.on("connect", () => {
  console.log("Redis connected");
})

export { redisClient };