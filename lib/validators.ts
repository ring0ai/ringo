import z from "zod";

export const createCampaignSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(8, "Title must be at least 8 characters"),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(8, "Description must be at least 8 characters"),
  prompt: z
    .string({
      required_error: "Prompt is required",
    })
    .min(20, "Prompt must be at least 20 characters"),
});

export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
