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
import type { Campaign } from "@/lib/types";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [clients, setClients] = useState(getClients());
  const [showNewClient, setShowNewClient] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
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

  useEffect(() => {
    const foundCampaign = getCampaignById(campaignId);
    if (foundCampaign) {
      setCampaign(foundCampaign);
      setPhoneNumbers(foundCampaign.targetNumbers);
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

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newNumbers = [...phoneNumbers];
    newNumbers[index] = value;
    setPhoneNumbers(newNumbers);
  };

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const removePhoneNumberField = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const targetNumbers = phoneNumbers.filter((num) => num.trim());

      if (
        !formData.name ||
        !formData.campaignText ||
        targetNumbers.length === 0
      ) {
        alert("Please fill in all required fields");
        return;
      }

      let clientId = formData.clientId;
      let clientName = formData.clientName;

      if (showNewClient) {
        if (
          !formData.newClientName ||
          !formData.newClientEmail ||
          !formData.newClientPhone
        ) {
          alert("Please fill in all client details");
          return;
        }
        const newClient = addClient({
          name: formData.newClientName,
          email: formData.newClientEmail,
          phone: formData.newClientPhone,
        });
        clientId = newClient.id;
        clientName = newClient.name;
      }

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
          targetNumbers,
          totalNumbers: targetNumbers.length,
        });
      }

      router.push(`/dashboard/campaigns/${campaignId}`);
    } catch (err) {
      alert("Failed to update campaign");
    } finally {
      setIsLoading(false);
    }
  };

  if (!auth.isAuthenticated || !campaign) {
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

              <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Select Client *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewClient(!showNewClient)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showNewClient ? "Select Existing" : "Create New"}
                  </button>
                </div>

                {!showNewClient ? (
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-primary/30 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-3">
                    <Input
                      name="newClientName"
                      placeholder="Client Name"
                      value={formData.newClientName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                    <Input
                      name="newClientEmail"
                      placeholder="Client Email"
                      type="email"
                      value={formData.newClientEmail}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                    <Input
                      name="newClientPhone"
                      placeholder="Client Phone"
                      value={formData.newClientPhone}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="campaignText"
                  className="text-sm font-medium text-foreground"
                >
                  Campaign Text (Script) *
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Target Phone Numbers *
                  </label>
                  <button
                    type="button"
                    onClick={addPhoneNumberField}
                    className="text-xs text-primary hover:underline"
                  >
                    + Add Number
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {phoneNumbers.map((number, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Phone number ${index + 1}`}
                        value={number}
                        onChange={(e) =>
                          handlePhoneNumberChange(index, e.target.value)
                        }
                        disabled={isLoading}
                        className="border-primary/30 focus:border-primary focus:ring-primary"
                      />
                      {phoneNumbers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePhoneNumberField(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
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
