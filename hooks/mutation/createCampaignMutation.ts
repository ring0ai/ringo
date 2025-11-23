"use client";

import { useMutation } from "@tanstack/react-query";
import { createCampaign } from "@/lib/server-functions/campaign";
import { CreateCampaignSchema } from "@/lib/validators";
import { toast } from "sonner";
import { queryClient, queryKeys } from "@/lib/query-keys";
import { useRouter } from "next/navigation";

export const useCreateCampaignMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (campaign: CreateCampaignSchema) => {
      const response = await createCampaign(campaign);
      if ("error" in response) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Campaign created successfully");
      router.push("/dashboard");
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaings.list,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
