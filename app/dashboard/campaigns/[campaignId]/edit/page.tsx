"use client";

import type React from "react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCampaignById,
  updateCampaign,
  getClients,
  addClient,
} from "@/lib/campaign-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { CampaignDetails } from "@/lib/types";
import useCampaignDetails from "@/hooks/query/useCampaingDetails";

export default function EditCampaignPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    clientName: "",
    campaignText: "",
    newClientName: "",
    newClientEmail: "",
    newClientPhone: "",
  });

  const { data: foundCampaign } = useCampaignDetails({ campaignId });

  useEffect(() => {
    if (foundCampaign) {
      setCampaign(foundCampaign);
      setFormData({
        name: foundCampaign.name,
        description: foundCampaign.description,
        clientId: foundCampaign.clientId,
        clientName: foundCampaign.clientName,
        campaignText: foundCampaign.campaignText,
        newClientName: "",
        newClientEmail: "",
        newClientPhone: "",
      });
    }
  }, [, router, campaignId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.description) {
        alert("Please fill in all required fields");
        return;
      }

      let clientId = formData.clientId;
      let clientName = formData.clientName;

      if (!clientId) {
        alert("Please select or create a client");
        return;
      }

      if (campaign) {
        updateCampaign(campaignId, {
          name: formData.name,
          description: formData.description,
          clientId,
          clientName,
          campaignText: formData.campaignText,
        });
      }

      router.push(`/dashboard/campaigns/${campaignId}`);
    } catch (err) {
      alert("Failed to update campaign");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId || !campaign) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/campaigns/${campaignId}`}>
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              ← Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Edit Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Update campaign details
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-primary/20">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-primary">Campaign Details</CardTitle>
            <CardDescription>Modify the campaign information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Campaign Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Summer Product Launch"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border-primary/30 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Brief description of the campaign"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border-primary/30 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="campaignText"
                  className="text-sm font-medium text-foreground"
                >
                  Prompt for AI (Script)
                </label>
                <textarea
                  id="campaignText"
                  name="campaignText"
                  placeholder="Enter the text that will be used by calling agents..."
                  value={formData.campaignText}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-primary/30 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={5}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? "Updating..." : "Update Campaign"}
                </Button>
                <Link
                  href={`/dashboard/campaigns/${campaignId}`}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/5 bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
