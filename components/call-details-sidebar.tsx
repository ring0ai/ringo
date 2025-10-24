"use client"

import type { CallLog } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface CallDetailsSidebarProps {
  call: CallLog | null
  onClose: () => void
}

export function CallDetailsSidebar({ call, onClose }: CallDetailsSidebarProps) {
  if (!call) return null

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-background border-l border-border/50 shadow-lg z-50 overflow-y-auto">
      <div className="sticky top-0 bg-background border-b border-border/50 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Call Details</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
          <p className="text-foreground font-semibold mt-1">{call.phoneNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Call Duration</label>
            <p className="text-foreground font-semibold mt-1">
              {Math.floor(call.callDuration / 60)}m {call.callDuration % 60}s
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <p className="text-foreground font-semibold mt-1 capitalize">{call.callStatus}</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Call Time</label>
          <p className="text-foreground font-semibold mt-1">{call.timestamp.toLocaleString()}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Call Start</label>
          <p className="text-foreground text-sm mt-1">{call.callStartTime.toLocaleTimeString()}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Call End</label>
          <p className="text-foreground text-sm mt-1">{call.callEndTime.toLocaleTimeString()}</p>
        </div>

        {call.discussionPoints && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Discussion Points</label>
            <p className="text-foreground text-sm mt-1 p-2 bg-muted rounded border border-border/50">
              {call.discussionPoints}
            </p>
          </div>
        )}

        {call.outcome && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Outcome</label>
            <p className="text-foreground text-sm mt-1 p-2 bg-muted rounded border border-border/50">{call.outcome}</p>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-muted-foreground">Feedback</label>
          <p className="text-foreground text-sm mt-1 p-2 bg-muted rounded border border-border/50">{call.feedback}</p>
        </div>

        {call.agentNotes && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Agent Notes</label>
            <p className="text-foreground text-sm mt-1 p-2 bg-muted rounded border border-border/50 italic border-l-2 border-l-primary">
              {call.agentNotes}
            </p>
          </div>
        )}

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary/5 bg-transparent"
        >
          Close
        </Button>
      </div>
    </div>
  )
}
