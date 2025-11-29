"use client";

import { queryKeys } from "@/lib/query-keys";
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
    queryKey: queryKeys.campaigns.details(campaignId),
    queryFn: async () => {
      const campaign = await getCampaignDetails({ campaignId });
      if ("error" in campaign) {
        throw new Error(campaign.message);
      }
      return campaign.data;
    },
    enabled,
  });
};

export default useCampaignDetails;
