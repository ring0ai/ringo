export interface Client {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
}

export interface Campaign {
  id: string
  name: string
  description: string
  targetNumbers: string[]
  campaignText: string
  totalNumbers: number
  completedCalls: number
  queuedCalls: number
  createdAt: Date
  clientId: string
  clientName: string
  status: "active" | "paused" | "completed"
}

export interface CallLog {
  id: string
  campaignId: string
  phoneNumber: string
  callDuration: number
  feedback: string
  callStatus: "completed" | "failed" | "pending"
  timestamp: Date
  agentNotes?: string
  discussionPoints?: string
  callStartTime?: Date
  callEndTime?: Date
  outcome?: string
}

export interface User {
  id: string
  email: string
  role: "admin"
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
