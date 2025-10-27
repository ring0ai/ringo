import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import next from "next";
import dotenv from "dotenv";

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
