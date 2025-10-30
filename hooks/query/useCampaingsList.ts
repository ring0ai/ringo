import { queryKeys } from "@/lib/queryClient";
import { getCampaigns } from "@/lib/server-functions/campaign";
import { useQuery } from "@tanstack/react-query";

const useCampaignsList = () => {
  return useQuery({
    queryKey: queryKeys.campaings.list,
    queryFn: async () => {
      const campaigns = await getCampaigns();
      if ("error" in campaigns) {
        throw new Error(campaigns.error);
      }
      return campaigns.data;
    },
  });
};

export default useCampaignsList;
