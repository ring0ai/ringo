import { CallDetailsSidebar } from "@/components/call-details-sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import useCampaignDetails from "@/hooks/query/useCampaingDetails";
import { getCallLogsByCampaign } from "@/lib/campaign-store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";

const CampaignTabs = () => {
  const [activeTab, setActiveTab] = useQueryState<
    "overview" | "calls" | "logs" | "targets"
  >(
    "tab",
    parseAsStringEnum(["overview", "calls", "logs", "targets"]).withDefault(
      "overview",
    ),
  );

  const { campaignId } = useParams<{ campaignId: string }>();
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const { data: campaign } = useCampaignDetails({ campaignId });

  const callLogs = campaign ? getCallLogsByCampaign(campaignId) : [];

  const ongoingCalls = callLogs.filter(
    (log) => log.callStatus === "pending",
  ).length;
  const completedCalls = callLogs.filter(
    (log) => log.callStatus === "completed",
  ).length;
  const failedCalls = callLogs.filter(
    (log) => log.callStatus === "failed",
  ).length;
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "calls", label: "Ongoing Calls", icon: "📞", badge: ongoingCalls },
    { id: "logs", label: "Call Logs", icon: "📋", badge: callLogs.length },
    {
      id: "targets",
      label: "Target Numbers",
      icon: "📱",
      badge: campaign?.campaignContacts?.length,
    },
  ];

  const selectedCall = selectedCallId
    ? callLogs.find((log) => log.id === selectedCallId)
    : null;

  if (!campaign) return null;

  return (
    <>
      <div className="mb-8">
        <div className="flex gap-2 border-b border-border/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge !== undefined && (
                <span className="ml-2 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Campaign Info Card */}
            <Card className="border-border/50">
              <CardHeader className="border-b border-border/50 pb-3">
                <CardTitle className="text-base">
                  Campaign Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-foreground text-sm mt-1">
                    {campaign.description}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Campaign Text (Agent Script)
                  </label>
                  <p className="text-foreground text-sm mt-1 p-3 bg-muted rounded-lg italic border border-border/50">
                    {campaign.prompt}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Status
                    </label>
                    <p className="text-foreground text-sm mt-1 capitalize font-semibold">
                      {campaign.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Created Date
                    </label>
                    <p className="text-foreground text-sm mt-1">
                      {campaign.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="border-b border-border/50 pb-3">
                <CardTitle className="text-base">Call Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Completed
                    </div>
                    <div className="text-xl font-bold text-green-700 dark:text-green-300 mt-1">
                      {completedCalls}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      Ongoing
                    </div>
                    <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                      {ongoingCalls}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Failed
                    </div>
                    <div className="text-xl font-bold text-red-700 dark:text-red-300 mt-1">
                      {failedCalls}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "calls" && (
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-base">Ongoing Calls</CardTitle>
              <CardDescription className="text-xs">
                Calls currently in progress
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {ongoingCalls === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">
                  No ongoing calls at the moment
                </p>
              ) : (
                <div className="space-y-2">
                  {callLogs
                    .filter((log) => log.callStatus === "pending")
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-3 border border-border/50 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedCallId(log.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {log.phoneNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {log.timestamp.toLocaleString()}
                            </p>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            In Progress
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "logs" && (
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-base">Call Logs</CardTitle>
              <CardDescription className="text-xs">
                Complete history of all calls
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {callLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">
                  No call logs yet
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {callLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 border border-border/50 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCallId(log.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {log.phoneNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            log.callStatus === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : log.callStatus === "failed"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {log.callStatus}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Duration: {Math.floor(log.callDuration / 60)}m{" "}
                        {log.callDuration % 60}s
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "targets" && (
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-base">Target Numbers</CardTitle>
              <CardDescription className="text-xs">
                All phone numbers for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {campaign.campaignContacts.map((number, idx) => (
                  <div
                    key={idx}
                    className="space-y-1 border rounded-md p-2 shadow"
                  >
                    <p>{number.contact?.name}</p>
                    <p className="text-muted-foreground">
                      {number.contact?.number}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CallDetailsSidebar
        call={selectedCall}
        onClose={() => setSelectedCallId(null)}
      />
    </>
  );
};

export default CampaignTabs;
