import type { Campaign, CallLog, Client } from "./types"

const mockClients: Client[] = [
  {
    id: "c1",
    name: "Fashion Retail Co",
    email: "contact@fashionretail.com",
    phone: "555-1000",
    createdAt: new Date("2024-09-01"),
  },
  {
    id: "c2",
    name: "Tech Solutions Inc",
    email: "info@techsolutions.com",
    phone: "555-2000",
    createdAt: new Date("2024-09-15"),
  },
]

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Product Launch",
    description: "Calling customers about new summer collection",
    targetNumbers: ["555-0101", "555-0102", "555-0103", "555-0104", "555-0105"],
    campaignText:
      "Hello! We are excited to introduce our new summer collection. Would you like to hear more about our latest products?",
    totalNumbers: 5,
    completedCalls: 3,
    queuedCalls: 2,
    createdAt: new Date("2024-10-15"),
    clientId: "c1",
    clientName: "Fashion Retail Co",
    status: "active",
  },
  {
    id: "2",
    name: "Customer Feedback Survey",
    description: "Gathering feedback on recent purchases",
    targetNumbers: ["555-0201", "555-0202", "555-0203"],
    campaignText:
      "Hi! We would love to hear your feedback about your recent purchase. Do you have a few minutes to answer some quick questions?",
    totalNumbers: 3,
    completedCalls: 2,
    queuedCalls: 1,
    createdAt: new Date("2024-10-10"),
    clientId: "c2",
    clientName: "Tech Solutions Inc",
    status: "active",
  },
]

const mockCallLogs: CallLog[] = [
  {
    id: "1",
    campaignId: "1",
    phoneNumber: "555-0101",
    callDuration: 245,
    feedback: "Customer interested in summer collection",
    callStatus: "completed",
    timestamp: new Date("2024-10-20T10:30:00"),
    agentNotes: "Customer requested catalog",
    discussionPoints: "Product features, pricing, delivery options",
    callStartTime: new Date("2024-10-20T10:30:00"),
    callEndTime: new Date("2024-10-20T10:34:05"),
    outcome: "Interested - Follow up needed",
  },
  {
    id: "2",
    campaignId: "1",
    phoneNumber: "555-0102",
    callDuration: 180,
    feedback: "Not interested",
    callStatus: "completed",
    timestamp: new Date("2024-10-20T11:15:00"),
    discussionPoints: "Product overview",
    callStartTime: new Date("2024-10-20T11:15:00"),
    callEndTime: new Date("2024-10-20T11:18:00"),
    outcome: "Not interested",
  },
]

export function getClients(): Client[] {
  return mockClients
}

export function getClientById(id: string): Client | undefined {
  return mockClients.find((c) => c.id === id)
}

export function addClient(client: Omit<Client, "id" | "createdAt">): Client {
  const newClient: Client = {
    ...client,
    id: `c${mockClients.length + 1}`,
    createdAt: new Date(),
  }
  mockClients.push(newClient)
  return newClient
}

export function getCampaignById(id: string): Campaign | undefined {
  return mockCampaigns.find((c) => c.id === id)
}

export function addCampaign(campaign: Omit<Campaign, "id" | "createdAt" | "completedCalls" | "queuedCalls">): Campaign {
  const newCampaign: Campaign = {
    ...campaign,
    id: String(mockCampaigns.length + 1),
    createdAt: new Date(),
    completedCalls: 0,
    queuedCalls: campaign.targetNumbers.length,
  }
  mockCampaigns.push(newCampaign)
  return newCampaign
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | undefined {
  const campaign = mockCampaigns.find((c) => c.id === id)
  if (campaign) {
    Object.assign(campaign, updates)
  }
  return campaign
}

export function getCallLogsByCampaign(campaignId: string): CallLog[] {
  return mockCallLogs.filter((log) => log.campaignId === campaignId)
}

export function addCallLog(log: Omit<CallLog, "id">): CallLog {
  const newLog: CallLog = {
    ...log,
    id: String(mockCallLogs.length + 1),
  }
  mockCallLogs.push(newLog)
  return newLog
}
