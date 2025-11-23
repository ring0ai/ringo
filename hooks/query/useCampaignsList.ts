import { queryKeys } from '@/lib/query-keys';
import { getCampaigns } from '@/lib/server-functions/campaign';
import { useQuery } from '@tanstack/react-query';

export const useCampaignsList = () => {
  return useQuery({
    queryKey: queryKeys.campaigns.list,
    queryFn: async () => {
      const campaigns = await getCampaigns();
      if ('error' in campaigns) {
        throw new Error(campaigns.error);
      }
      return campaigns.data;
    },
  });
};
