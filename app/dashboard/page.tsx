"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { StatCardWithChart } from "@/components/stat-card-with-chart";
import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/lib/server-functions/campaign";

const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const campaigns = await getCampaigns();
      if ("error" in campaigns) {
        throw new Error(campaigns.error);
      }
      return campaigns.data;
    },
  });
};

export default function DashboardPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"name" | "status" | "completion">(
    "name"
  );
  const {
    data: campaigns,
    isLoading,
    error,
  } = useCampaigns();

  // const totalNumbers = campaigns.reduce((sum, c) => sum + c.totalNumbers, 0);
  const totalNumbers = 100;

  // const completedCalls = campaigns.reduce(
  //   (sum, c) => sum + c.completedCalls,
  //   0,
  // );
  const completedCalls = 100;

  // const queuedCalls = campaigns.reduce((sum, c) => sum + c.queuedCalls, 0);
  const queuedCalls = 100;

  const callStatusData = [
    { name: "Completed", value: completedCalls, fill: "#22c55e" },
    { name: "Queued", value: queuedCalls, fill: "#eab308" },
  ];

  const dailyCallsData = [
    { date: "Mon", calls: 12 },
    { date: "Tue", calls: 19 },
    { date: "Wed", calls: 15 },
    { date: "Thu", calls: 22 },
    { date: "Fri", calls: 18 },
  ];

  // const sortedCampaigns = [...campaigns].sort((a, b) => {
  //   if (sortBy === "name") return a.name.localeCompare(b.name);
  //   if (sortBy === "status") return a.status.localeCompare(b.status);
  //   const aRate = a.completedCalls / a.totalNumbers;
  //   const bRate = b.completedCalls / b.totalNumbers;
  //   return bRate - aRate;
  // });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Campaigns</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your calling campaigns
            </p>
          </div>
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              + Create Campaign
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Numbers", value: totalNumbers },
            { label: "Completed Calls", value: completedCalls },
            { label: "In Queue", value: queuedCalls },
          ].map((stat, idx) => (
            <Card key={idx} className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCardWithChart
            title="Call Status Distribution"
            data={callStatusData}
            type="pie"
            height={180}
          />
          <StatCardWithChart
            title="Daily Call Volume"
            data={dailyCallsData}
            type="bar"
            height={180}
          />
        </div>

        {/* Campaigns Table */}
        {campaigns && (
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Campaigns</CardTitle>
                  <CardDescription>
                    Manage and monitor your active campaigns
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-border/50 bg-background text-sm text-foreground hover:border-primary/50 transition-colors"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                    <option value="completion">Sort by Completion</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No campaigns yet</p>
                  <Link href="/dashboard/campaigns/new">
                    <Button variant="outline">
                      Create your first campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Campaign Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Completed / Total
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Created
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => {
                        const completionRate =
                          campaign.totalNumbers == 0
                            ? 0
                            : Math.round(
                                (campaign.completedCalls /
                                  campaign.totalNumbers) *
                                  100
                              );
                        // const completionRate = Math.round(
                        //   (campaign.completedCalls / campaign.totalNumbers) *
                        //     100
                        // );
                        return (
                          <tr
                            key={campaign.id}
                            className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-semibold text-foreground">
                                {campaign.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {campaign.description}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  campaign.status === "active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : campaign.status === "paused"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                                }`}
                              >
                                {campaign.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-32">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-foreground">
                                    {completionRate}%
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${completionRate}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">
                              {campaign.completedCalls} /{" "}
                              {campaign.totalNumbers}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {campaign.createdAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                href={`/dashboard/campaigns/${campaign.id}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-primary/30 hover:bg-primary/5 bg-transparent"
                                >
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
