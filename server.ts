import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import next from "next";
import dotenv from "dotenv";
import auth from "basic-auth";
import { Server } from "socket.io";
import { createServer } from "http";
import { queueManager } from "./lib/queues/queueManager";
import { createClient } from "redis"

dotenv.config();

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

const handle = nextApp.getRequestHandler();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// Initialize your queues here, before setting up BullBoard router
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [],
  serverAdapter,
});

/**\
 * @dev This middleware function will be used by the defined Express router to ensure that its called only from the localhost
 */
const verifyAPIKey = (req: any, res: any, next: any) => {
  const apiKey = process.env.LOCAL_API_KEY;
  const apiKeyHeader = req.headers["x-api-key"];
  if (apiKey !== apiKeyHeader) {
    console.log("Invalid API key");
    return res.status(401).send("Unauthorized");
  }
  next();
}

async function main() {
  await nextApp.prepare();

  const app = express();
  const server = createServer(app);

  app.use(express.json())

  const queues = await queueManager.getQueues();
  for (const queue of queues) {
    addQueue(new BullAdapter(queue));
  }

  //NOTE: this part manages blll queues
  app.use(
    "/admin/queues",
    async (req, res, next) => {
      const user = auth(req);
      const username = process.env.BULL_QUEUE_USERNAME;
      const password = process.env.BULL_QUEUE_PASSWORD;
      if (!user || user.name !== username || user.pass !== password) {
        res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
        return res.status(401).send("Authentication required.");
      }
      next();
    },
    serverAdapter.getRouter()
  );

  app.get("/api/health", async (req, res) => {
    console.log(`Redis URL: ${process.env.REDIS_URL}`);
    // Check redis connection
    const redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    if(!redisClient.isOpen) {
      await redisClient.connect();
    }

    redisClient.on("error", (err) => {
      console.error("Redis connection error:", err);
      res.status(500).json({ message: "Redis connection error" });
    });

    const ping = await redisClient.ping();

    res.json({ status: "ok", redis: ping === "PONG" });
  });

  // API endpoint to update queues
  app.post("/api/internal/queues", verifyAPIKey,  async (req, res) => {
    console.log("🔌 Queues updated:", req.body);
    try {
      const queue = new Queue(req.body.name);
      addQueue(new BullAdapter(queue));
      res.status(201).json({ message: "Queue created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create queue" });
    }
  });

  //NOTE: web this part manages next js
  app.use((req, res) => handle(req, res));

  //NOTE: web sockets
  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.emit("message", "Connected!");

    socket.on("ping", (msg) => {
      console.log("Received ping:", msg);
      socket.emit("pong", `Pong: ${msg}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log("next js running withtin express");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
