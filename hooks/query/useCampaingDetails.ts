"use client";

import { queryKeys } from "@/lib/queryClient";
import { getCampaignDetails } from "@/lib/server-functions/campaign";
import { useQuery } from "@tanstack/react-query";

type CampaignDetailsParams = {
  campaignId: string;
  enabled?: boolean;
};

const useCampaignDetails = ({
  campaignId,
  enabled = true,
}: CampaignDetailsParams) => {
  return useQuery({
    queryKey: queryKeys.campaings.details(campaignId),
    queryFn: async () => {
      const campaign = await getCampaignDetails({ campaignId });
      if ("error" in campaign) {
        throw new Error(campaign.error);
      }
      return campaign.data;
    },
    enabled,
  });
};

export default useCampaignDetails;
