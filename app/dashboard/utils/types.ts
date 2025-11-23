export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum CallStatus {
  COMPLETED = 'completed',
  IDLE = 'idle',
  QUEUED = 'queued',
  IN_PROGRESS = 'in-progress',
}

export interface Campaign {
  completedCalls: number;
  totalNumbers: number;
  status: CampaignStatus;
  id: string;
  title: string;
  createdAt: Date;
  created_by: string;
  description: string;
  prompt: string | null;
  updatedAt: Date;
  campaignContacts: CampaignContact[];
}

export interface CampaignContact {
  call_status: CallStatus;
  contact: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}
