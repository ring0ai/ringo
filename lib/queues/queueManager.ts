import { env } from "@/config/env";
import Queue from "bull";
import { callWorker } from "./workers/callWorker";
import type { Job } from "bull";

enum TaskType {
  CallWorker = "callWorker",
}

class QueueManager {
  private queues: Map<string, Queue.Queue> = new Map();

  #getWorker(taskType: TaskType) {
    switch (taskType) {
      case TaskType.CallWorker:
        return callWorker;
      default:
        throw new Error(`Task type ${taskType} not found`);
    }
  }

  // Get or create a new queue
  getQueue(name: string): Queue.Queue {
    if (!this.queues.has(name)) {
      throw new Error(`Queue with name ${name} does not exist`);
    }
    return this.queues.get(name)!;
  }

  // Create new queue
  createQueue(name: string, taskType: TaskType): Queue.Queue {
    if(this.queues.has(name)) {
      throw new Error(`Queue with name ${name} already exists`);
    }
    const queue = new Queue(name, env.REDIS_URL);

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

    this.queues.set(name, queue);
    console.log(`Queue with name ${name} created`);
    
    return queue;
  }
}

export const queueManager = new QueueManager();

export { TaskType };