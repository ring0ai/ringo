"use server";

import { db } from "@/db";
import { campaignContactsTable, contactsTable } from "@/db/schemas";
import { campaignsTable } from "@/db/schemas/campaign";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { and, desc, eq } from "drizzle-orm";

interface RequestCampaignDetails {
  userId: string;
  page?: number;
  size?: number;
  orderBy?: "createdAt" | "title"
}

const sortBy = (orderBy: "createdAt" | "title") => {
  switch (orderBy) {
    case "createdAt": return desc(campaignsTable.createdAt)
  }
}

export const getCampaigns = async ({
  userId,
  page = 1,
  size = 10,
  orderBy = "createdAt"
}: RequestCampaignDetails) => {
  try {
    const campaigns = await db.query.campaignsTable.findMany({
      where: eq(campaignsTable.created_by, userId),
      orderBy: sortBy(orderBy),
      limit: size,
      offset: (page - 1) * size,
      with: {
        campaignContacts: {
          columns: {
            call_status: true,
          },
          with: {
            contact: true,
          }
        }
      }
    })

    const response = campaigns.map((campaign)=> {
      return {
        ...campaign,
        
      }
    })
    
    return createSuccessResponse(campaigns);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
};

export const getCampaignById = async(campaignId: string, userId: string) => {
  try {
    const campaign = await db.query.campaignsTable.findFirst({
      where: and(
        eq(campaignsTable.id, campaignId),
        eq(campaignsTable.created_by, userId)
      ),
      with: {
        campaignContacts: {
          columns: {
            call_status: true,
          },
          with: {
            contact: true,
          }
        }
      }
    })

    if (!campaign) {
      return createErrorResponse("Campaign not found");
    }

    return createSuccessResponse(campaign);
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
}
