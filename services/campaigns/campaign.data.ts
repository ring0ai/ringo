import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { CampaignService } from './campaign.service';

const campaigns = new CampaignService();

const useCampaignsList = () => {
  return useQuery({
    queryKey: queryKeys.campaigns.list,
    queryFn: campaigns.getCampaignsList,
  });
};

export default useCampaignsList;
