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

dotenv.config();

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

const handle = nextApp.getRequestHandler();

const queue = new Queue("callWorker");
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(queue)],
  serverAdapter,
});

async function main() {
  await nextApp.prepare();

  const app = express();
  const server = createServer(app);

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
    serverAdapter.getRouter(),
  );

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("next js running withtin express");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
