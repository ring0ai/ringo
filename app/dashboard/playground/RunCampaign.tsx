import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useCampaignsList from "@/hooks/query/useCampaingsList";
import { initiateCampaign } from "@/lib/server-functions/campaign";
import { CampaignListItem } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

const CampaignItem = ({ campaign }: { campaign: CampaignListItem }) => {
  const [loading, setLoading] = useState(false);

  const clickHandler = async () => {
    try {
      setLoading(true);
      const res = await initiateCampaign(campaign.id);
      if ("error" in res) {
        toast.error(res.message);
        return;
      }
      toast.success("Campaign started successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 border rounded-sm p-4 hover:bg-muted/10 transition-colors justify-between">
      <div>
        <p>{campaign.title}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(campaign.createdAt).toLocaleDateString()}{" "}
          {new Date(campaign.createdAt).toLocaleTimeString()}
        </p>
      </div>
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
