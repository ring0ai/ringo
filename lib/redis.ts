import dotenv from "dotenv";
import Redis from "ioredis"

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
  throw new Error("Redis connection error");
});

redisClient.connect();

export { redisClient };