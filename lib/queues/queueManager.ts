import dotenv from "dotenv";
import Queue from "bull";
import { callWorker } from "./workers/callWorker";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { queuesTable } from "@/db/schemas";

dotenv.config();

enum TaskType {
  CallWorker = "callWorker",
}

class QueueManager {
  #getWorker(taskType: TaskType) {
    switch (taskType) {
      case TaskType.CallWorker:
        return callWorker;
      default:
        throw new Error(`Task type ${taskType} not found`);
    }
  }

  // Get all queues
  async getQueues(): Promise<Queue.Queue[]> {
    const queues = await db.query.queuesTable.findMany();
    const response = queues.map((queue) => new Queue(queue.name));
    return response;
  }

  async getQueue(name: string): Promise<Queue.Queue> {
    const queue = await db.query.queuesTable.findFirst({
      where: eq(queuesTable.name, name)
    });

    if (!queue) {
      throw new Error(`Queue with name ${name} does not exist`);
    }
    
    return new Queue(queue.name);
  }

  // Create new queue
  async createQueue(name: string, taskType: TaskType): Promise<Queue.Queue> {
    const preExistingQueue = await db.query.queuesTable.findFirst({
      where: eq(queuesTable.name, name)
    });
    if (preExistingQueue) {
      return new Queue(preExistingQueue.name);
    }

    // Create new queue
    const queue = new Queue(name, process.env.REDIS_URL!);
    queue.on("active", (job) => {
      console.log(`Job ${job.id} is active`);
    });
    queue.on("completed", (job, result) => {
      console.log(`Job ${job.id} is completed`);
    });
    queue.on("failed", (job, error) => {
      console.error(`Job ${job.id} has failed: ${error.message}`);
    });
    queue.on("error", (error) => {
      console.error(`Queue error: ${error.message}`);
    });

    const worker = this.#getWorker(taskType);
    worker(queue);

    // Make post API call to localhost:3000/api/internal/queues with name
    await fetch("http://localhost:3000/api/internal/queues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    await db.insert(queuesTable).values({
      name,
      task_type: taskType
    });
  
    console.log(`Queue with name ${name} created`);

    return queue;
  }
}

export const queueManager = new QueueManager();

export { TaskType };

