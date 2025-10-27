import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import next from "next";
import dotenv from "dotenv";
import auth from "basic-auth";

dotenv.config();

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

const handle = nextApp.getRequestHandler();

const queue = new Queue("callWorker");
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues"); // VERY IMPORTANT

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(queue)],
  serverAdapter,
});

async function main() {
  await nextApp.prepare();

  const server = express();
  server.use(
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

  server.use((req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log("next js running withtin express");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
