import { Campaign } from '@/app/dashboard/utils/types';
import { getCampaigns } from '@/lib/server-functions/campaign';

export class CampaignService {
  async getCampaignsList(): Promise<Campaign[] | undefined> {
    const campaigns = await getCampaigns();
    if ('error' in campaigns) {
      throw new Error(campaigns.error);
    }
    return campaigns.data;
  }
}
