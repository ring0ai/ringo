"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClients, addClient } from "@/lib/campaign-store";
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

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState(getClients());
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        alert("Please fill in all fields");
        return;
      }

      addClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      setClients(getClients());
      setFormData({ name: "", email: "", phone: "" });
      alert("Client added successfully!");
    } catch (err) {
      alert("Failed to add client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Clients</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your clients
            </p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Client Form */}
          <Card className="border-primary/20 lg:col-span-1">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-primary">Add New Client</CardTitle>
              <CardDescription>Create a new client profile</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Client Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Acme Corp"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-primary/30 focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-primary/30 focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Phone *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="555-1234"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-primary/30 focus:border-primary focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? "Adding..." : "Add Client"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Clients List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="border-b border-border/50">
                <CardTitle>All Clients ({clients.length})</CardTitle>
                <CardDescription>
                  View and manage all your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {clients.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No clients yet. Create one to get started!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {client.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {client.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          Phone: {client.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
