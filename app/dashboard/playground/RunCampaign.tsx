import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useCampaignsList from "@/hooks/query/useCampaingsList";
import { initiateCampaign } from "@/lib/server-functions/campaign";
import { CampaignListItem } from "@/lib/types";
import { useState } from "react";

const CampaignItem = ({ campaign }: { campaign: CampaignListItem }) => {
  const [loading, setLoading] = useState(false);

  const clickHandler = async () => {
    try {
      setLoading(true);
      await initiateCampaign(campaign.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>{campaign.title}</p>
      <Button
        onClick={() => {
          clickHandler();
        }}
      >
        {loading && <Spinner />}
        Run
      </Button>
    </div>
  );
};

const RunCampaign = () => {
  const { data: campaigns } = useCampaignsList();

  return (
    <div className="border-2 flex flex-col  rounded-sm p-4 gap-3">
      {campaigns?.map((campaign) => (
        <CampaignItem key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};

export default RunCampaign;
