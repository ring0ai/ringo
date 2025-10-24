"use client"

import Link from "next/link"
import type { Campaign } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const completionRate = Math.round((campaign.completedCalls / campaign.totalNumbers) * 100)

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{campaign.name}</CardTitle>
            <CardDescription>{campaign.clientName}</CardDescription>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              campaign.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : campaign.status === "paused"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            }`}
          >
            {campaign.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{completionRate}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-lg font-semibold text-foreground">{campaign.totalNumbers}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="text-lg font-semibold text-primary">{campaign.completedCalls}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Queued</div>
            <div className="text-lg font-semibold text-accent-foreground">{campaign.queuedCalls}</div>
          </div>
        </div>

        {/* Created Date */}
        <div className="text-xs text-muted-foreground mb-4">Created {campaign.createdAt.toLocaleDateString()}</div>

        {/* Action Button */}
        <Link href={`/dashboard/campaigns/${campaign.id}`}>
          <Button variant="outline" className="w-full bg-transparent">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
