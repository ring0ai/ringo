"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useCreateCampaignMutation } from "@/hooks/mutation/createCampaignMutation";
import {
  SubscribeButton,
  TextareaField,
  TextField,
  useAppForm,
} from "@/hooks/form";
import { createCampaignSchema } from "@/lib/validators";

export default function NewCampaignPage() {
  const createCampaignMutation = useCreateCampaignMutation();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      prompt: "",
    },
    validators: {
      onChange: createCampaignSchema,
    },
    onSubmit: async ({ value }) => {
      await createCampaignMutation.mutateAsync(value);
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              ← Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Create Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Set up a new calling campaign
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-primary/20">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-primary">Campaign Details</CardTitle>
            <CardDescription>
              Fill in the information for your new campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <form.AppField
                name="title"
                children={(props) => (
                  <TextField
                    label="Campaign Name *"
                    placeholder="e.g., Summer Product Launch"
                    {...props}
                  />
                )}
              />

              <form.AppField
                name="description"
                children={(props) => (
                  <TextareaField
                    label="Description"
                    placeholder="Brief description of the campaign"
                    {...props}
                  />
                )}
              />

              <form.AppField
                name="prompt"
                children={(props) => (
                  <TextareaField
                    label="Prompt for AI (Script)"
                    placeholder="Enter the text that will be used by calling agents..."
                    className="min-h-[160px]"
                    {...props}
                  />
                )}
              />

              <form.AppForm>
                <SubscribeButton
                  buttonProps={{ className: "w-full" }}
                  label="Create Campaign"
                />
              </form.AppForm>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
