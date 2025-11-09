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
import { CreateCampaignSchema, createCampaignSchema } from "@/lib/validators";
import { PhoneContactsForm } from "./PhoneContactForm";
import { isDevelopment } from "@/config/constants";

export default function NewCampaignPage() {
  const createCampaignMutation = useCreateCampaignMutation();

  const form = useAppForm({
    defaultValues: isDevelopment
      ? generateDummyCampaignData(5)
      : {
          title: "",
          description: "",
          prompt: "",
          contacts: [] as CreateCampaignSchema["contacts"],
        },
    validators: {
      onChange: createCampaignSchema,
    },
    onSubmit: async ({ value }) => {
      await createCampaignMutation.mutateAsync(value);
    },
  });

  const handleAddContact = (contacts: CreateCampaignSchema["contacts"]) => {
    form.setFieldValue("contacts", contacts);
  };

  const contacts = form.state.values.contacts;

  return (
    <main className="min-h-screen bg-background">
      <div className=" mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              ← Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">Create Campaign</h1>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-primary">Campaign Details</CardTitle>
            <CardDescription>
              Fill in the information for your new campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="space-y-6 col-span-3">
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
            </div>

            <PhoneContactsForm
              contacts={contacts || []}
              updateContact={handleAddContact}
            />

            <div className="col-span-3" />
            <form.AppForm>
              <SubscribeButton
                buttonProps={{ className: "w-full col-span-3" }}
                label="Create Campaign"
              />
            </form.AppForm>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const randomUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

function generateDummyCampaignData(count = 5): CreateCampaignSchema {
  const contacts = Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    name: `Contact ${i + 1}`,
    number: `+91${Math.floor(9000000000 + Math.random() * 1000000000)}`,
  }));

  return {
    title: "AI Marketing Campaign",
    description: "A test campaign for demo purposes",
    prompt:
      "Call and introduce our new AI-powered product to potential clients.",
    contacts: [],
  };
}
