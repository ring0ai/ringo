import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import next from "next";
import dotenv from "dotenv";
import auth from "basic-auth";
import { createServer } from "http";
import { setupWebsocketServer } from "./lib/websocket/server";
import url from "url";
import { redisClient } from "./lib/redis";
import { callQueue } from "./lib/queues/queueManager";

dotenv.config();

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

const handle = nextApp.getRequestHandler();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(callQueue)],
  serverAdapter,
});

async function main() {
  await nextApp.prepare();

  const app = express();
  const server = createServer(app);

  const wss = setupWebsocketServer();
  server.on("upgrade", (req, socket, head) => {
    const { pathname } = url.parse(req.url || "");

    if (
      pathname?.startsWith("/_next/webpack-hmr") ||
      pathname?.startsWith("/__next")
    ) {
      return;
    }

    if (pathname === "/api/socket") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  app.use(express.json());

  //NOTE: this part manages bull queues
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
    const ping = await redisClient.ping();

    res.json({
      status: "ok",
      redis: ping === "PONG",
      websocket: wss.clients.size + " clients connected",
    });
  });

  //NOTE: this part manages next js
  app.use((req, res) => handle(req, res));

  const port = Number(process.env.PORT) || 3000;
  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    console.log(`🔌 WebSocket server running on ws://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
