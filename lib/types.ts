import { getCampaignDetails, getCampaigns } from "./server-functions/campaign";
import { SuccessData } from "./utils";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface CallLog {
  id: string;
  campaignId: string;
  phoneNumber: string;
  callDuration: number;
  feedback: string;
  callStatus: "completed" | "failed" | "pending";
  timestamp: Date;
  agentNotes?: string;
  discussionPoints?: string;
  callStartTime?: Date;
  callEndTime?: Date;
  outcome?: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin";
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type CampaignListItem = SuccessData<typeof getCampaigns>[number];

export type CampaignDetails = SuccessData<typeof getCampaignDetails>;
