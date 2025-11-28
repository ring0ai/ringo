"use server";

import { db } from "@/db";
import { campaignsTable } from "@/db/schemas/campaign";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { CreateCampaignSchema } from "../validators";
import { campaignContactsTable, contactsTable } from "@/db/schemas";
import { env } from "@/config/env";
import { callQueue } from "../queues/queueManager";

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
});

const sortBy = (orderBy: "createdAt" | "title") => {
  switch (orderBy) {
    case "createdAt":
      return desc(campaignsTable.createdAt);
  }
};

export const createCampaign = async (campaign: CreateCampaignSchema) => {
  try {
    const user = await currentUser();
    if (!user) {
      return createErrorResponse("User not found", "UNAUTHORIZED");
    }

    const newCampaign = await db.transaction(async (trx) => {
      const insertedContacts = await trx
        .insert(contactsTable)
        .values(
          campaign.contacts.map((contact) => ({
            name: contact.name,
            number: contact.number,
          }))
        )
        .returning({ id: contactsTable.id });

      const [insertedCampaign] = await trx
        .insert(campaignsTable)
        .values({
          title: campaign.title,
          description: campaign.description,
          prompt: campaign.prompt,
          created_by: user.id,
        })
        .returning();

      await trx.insert(campaignContactsTable).values(
        insertedContacts.map((contact) => ({
          campaignId: insertedCampaign.id,
          contactId: contact.id,
        }))
      );

      return insertedCampaign;
    });

    return createSuccessResponse(newCampaign);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
};

export const getCampaigns = async (
  _params?: z.infer<typeof getCampaignsParamsSchema>
) => {
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
    return createErrorResponse(errorMessage, "INTERNAL_ERROR");
  }
};

export const getCampaignDetails = async (
  _params?: z.infer<typeof getCampaignDetailsParamsSchema>
) => {
  try {
    const user = await currentUser();
    if (!user) {
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

    const result = {
      ...campaign,
      completedCalls: campaign.campaignContacts.reduce(
        (sum, c) => sum + (c.call_status === "completed" ? 1 : 0),
        0
      ),
      queuedCalls: campaign.campaignContacts.reduce(
        (sum, c) => sum + (c.call_status === "queued" ? 1 : 0),
        0
      ),
      idleCalls: campaign.campaignContacts.reduce(
        (sum, c) => sum + (c.call_status === "idle" ? 1 : 0),
        0
      ),
      inProgressCalls: campaign.campaignContacts.reduce(
        (sum, c) => sum + (c.call_status === "in-progress" ? 1 : 0),
        0
      ),
      totalNumbers: campaign.campaignContacts.length,
    };

    return createSuccessResponse(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
};

export const initiateCampaign = async (campaignId: string) => {
  try {
    console.log("initiate campaign called");
    const user = await currentUser();
    if (!user) {
      return createErrorResponse("User not found", "UNAUTHORIZED");
    }

    const campaign = await db.query.campaignsTable.findFirst({
      where: and(
        eq(campaignsTable.id, campaignId),
        eq(campaignsTable.created_by, user.id)
      ),
      with: {
        campaignContacts: {
          with: {
            contact: true,
          },
        },
      },
    });
    if (!campaign) {
      return createErrorResponse("Campaign not found", "NOT_FOUND");
    }

    // TODO: The number used to make call should be made dynamic in future
    const fromNumber = env.FROM_NUMBER;

    // Add all the contacts to the queue
    const queuePayload = campaign.campaignContacts.map((contact) => ({
      name: callQueue.name,
      data: {
        campaignId: campaign.id,
        contactId: contact.contact.id,
        fromNumber: fromNumber,
      },
    }));

    console.log("queue payload", queuePayload);

    await callQueue.addBulk(queuePayload);

    await db
      .update(campaignContactsTable)
      .set({
        call_status: "queued",
      })
      .where(eq(campaignContactsTable.campaignId, campaign.id));

    return createSuccessResponse(campaign);
  } catch (error) {
    console.log("error", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
};
