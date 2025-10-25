"use server";

import { db } from "@/db";
import { campaignsTable } from "@/db/schemas/campaign";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export const createCampaign = async (campaign: typeof campaignsTable.$inferInsert) => {
  try {
    const newCampaign = await db.insert(campaignsTable).values(campaign).returning();
    return createSuccessResponse(newCampaign)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage)
  }
}