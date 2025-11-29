"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { StatCardWithChart } from "@/components/stat-card-with-chart";
import useCampaignDetails from "@/hooks/query/useCampaingDetails";
import CampaignTabs from "./CampaignTabs";
import { getCallLogsByCampaign } from "@/lib/campaign-store";
import { initiateCampaign } from "@/lib/server-functions/campaign";
import { Spinner } from "@/components/ui/spinner";

export default function CampaignDetailsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const {
    data: campaign,
    isLoading,
    error,
    refetch,
  } = useCampaignDetails({ campaignId });
  const [loading, setLoading] = useState(false);

  const completionRate = Math.round(
    (campaign?.completedCalls / campaign?.totalNumbers) * 100
  );

  const callLogs = campaign ? getCallLogsByCampaign(campaignId) : [];

  const completedCalls = callLogs.filter(
    (log) => log.callStatus === "completed"
  ).length;

  const callStatusData = [
    { name: "Completed", value: campaign?.completedCalls, fill: "#22c55e" },
    { name: "Queued", value: campaign?.queuedCalls, fill: "#3b82f6" },
    { name: "Pending", value: campaign?.idleCalls, fill: "#eab308" },
    { name: "In Progress", value: campaign?.inProgressCalls, fill: "#f6c141" },
  ];

  const dailyCallsData = [
    { date: "Mon", calls: 5 },
    { date: "Tue", calls: 8 },
    { date: "Wed", calls: 6 },
    { date: "Thu", calls: 9 },
    { date: "Fri", calls: 7 },
  ];

  const handleStartCampaign = async () => {
    try {
      setLoading(true);
      await initiateCampaign(campaignId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              ← Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary">
              {campaign.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button
              onClick={() => {
                handleStartCampaign();
              }}
              disabled={loading}
            >
              {loading && <Spinner />}
              Run Campaign
            </Button>

            <Button
              onClick={() => {
                alert("Not implemented yet");
              }}
            >
              Schedule Campaign
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Numbers", value: campaign.campaignContacts.length },
            { label: "Completed", value: campaign.completedCalls },
            {
              label: "In Queue",
              value: campaign.totalNumbers - campaign.completedCalls,
            },
            { label: "Completion Rate", value: `${completionRate}%` },
          ].map((metric, idx) => (
            <Card
              key={idx}
              className="border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardContent className="pt-4 pb-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {metric.label}
                </div>
                <div className="text-2xl font-bold text-primary">
                  {metric.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCardWithChart
            title="Call Status"
            data={callStatusData}
            type="pie"
            height={160}
          />
          <StatCardWithChart
            title="Daily Volume"
            data={dailyCallsData}
            type="bar"
            height={160}
          />
        </div>
        <CampaignTabs />
      </div>
    </main>
  );
}
