"use server";

import { db } from "@/db";
import { campaignsTable } from "@/db/schemas/campaign";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { queueManager, TaskType } from "../queues/queueManager";

const getCampaignsParamsSchema = z
  .object({
    page: z.number().optional().default(1),
    size: z.number().optional().default(10),
    orderBy: z.enum(["createdAt", "title"]).optional().default("createdAt"),
  })
  .optional()
  .default({
    page: 1,
    size: 10,
    orderBy: "createdAt",
  });

const getCampaignDetailsParamsSchema = z.object({
  campaignId: z.string().uuid(),
})

const sortBy = (orderBy: "createdAt" | "title") => {
  switch (orderBy) {
    case "createdAt":
      return desc(campaignsTable.createdAt);
  }
};

export const createCampaign = async (campaign: typeof campaignsTable.$inferInsert) => {
  try {
    const queue = await queueManager.createQueue("callWorker", TaskType.CallWorker);
    await queue.add({
      campaignId: '2bc7bdb3-730c-4046-861d-8fb593f04fe2',
      contactId: 'b5146bf2-b49a-49a8-bd1b-823ba776aae4',
      fromNumber: "+14422281166"
    })

    // const newCampaign = await db.insert(campaignsTable).values(campaign).returning();
    // return createSuccessResponse(newCampaign)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage)
  }
}

export const getCampaigns = async (_params?: z.infer<typeof getCampaignsParamsSchema>) => {
  try {
    const user = await currentUser();
    if (!user) {
      return createErrorResponse("User not found", "UNAUTHORIZED");
    }

    const params = getCampaignsParamsSchema.parse(_params);

    const campaigns = await db.query.campaignsTable.findMany({
      where: eq(campaignsTable.created_by, user.id),
      orderBy: sortBy(params?.orderBy),
      limit: params.size,
      offset: (params.page - 1) * params.size,
      with: {
        campaignContacts: {
          columns: {
            call_status: true,
          },
          with: {
            contact: true,
          },
        },
      },
    });

    const response = campaigns.map((campaign) => {
      return {
        ...campaign,
        completedCalls: campaign.campaignContacts.reduce(
          (sum, c) => sum + (c.call_status === "completed" ? 1 : 0),
          0
        ),
        totalNumbers: campaign.campaignContacts.length,
      };
    });

    return createSuccessResponse(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
};

export const getCampaignDetails = async (_params?: z.infer<typeof getCampaignDetailsParamsSchema>) => {
  try {
    const user = await currentUser();
    if(!user) {
      return createErrorResponse("User not found", "UNAUTHORIZED");
    }

    const params = getCampaignDetailsParamsSchema.parse(_params);

    const campaign = await db.query.campaignsTable.findFirst({
      where: and(
        eq(campaignsTable.id, params.campaignId),
        eq(campaignsTable.created_by, user.id)
      ),
      with: {
        campaignContacts: {
          columns: {
            call_status: true,
          },
          with: {
            contact: true,
          },
        },
      },
    });

    if (!campaign) {
      return createErrorResponse("Campaign not found");
    }

    return createSuccessResponse(campaign);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
};
