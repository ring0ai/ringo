"use server"

import { queueManager, TaskType } from "@/lib/queues/queueManager";

export const testFunction = async () => {
  console.log("test");
  const queue = await queueManager.createQueue("callWorker#+14422281166", TaskType.CallWorker);
    await queue.add({
      campaignId: '2bc7bdb3-730c-4046-861d-8fb593f04fe2',
      contactId: 'b5146bf2-b49a-49a8-bd1b-823ba776aae4',
      fromNumber: "+14422281166"
    })
}