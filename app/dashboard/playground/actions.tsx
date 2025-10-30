"use server"

import { queueManager, TaskType } from "@/lib/queues/queueManager";

export const testFunction = async () => {
  console.log("test");
  const queue = await queueManager.createQueue("callWorker#+14422281166", TaskType.CallWorker);
    await queue.add({
      campaignId: 'b89351eb-5e0e-47d8-b7a8-d453579a60bf',
      contactId: '2a5e7738-c7c5-41ee-b8b6-6ac570442aa3',
      fromNumber: "+14422281166"
    })
}