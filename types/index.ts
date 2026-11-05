export type CynbitService =
  | "AI Automation"
  | "Web Development"
  | "Mobile App Development"
  | "Cloud Solutions"
  | "Technical Consulting";

export type LeadScore = "High" | "Medium" | "Low";

export type LeadStatus = "New" | "Contacted" | "Proposal Sent" | "Qualified" | "Closed";

export type BusinessType =
  | "Startup"
  | "Small / Medium Business"
  | "Enterprise"
  | "Agency / Partner"
  | "Individual / Creator"
  | "Other";

export interface IChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isProposal?: boolean;
  leadProposalData?: Partial<ILead>;
  suggestions?: string[];
}

export interface ILead {
  _id?: any;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  businessType: BusinessType | string;
  budget: string;
  budgetAmount: number;
  timeline: string;
  projectRequirement: string;
  message?: string;
  serviceRecommended: CynbitService;
  leadScore: LeadScore;
  scoreValue?: number; // 0 - 100
  status: LeadStatus;
  tags?: string[];
  aiAnalysis?: {
    rationale: string;
    keyNeeds?: string[];
    suggestedTechStack?: string[];
  };
  chatHistory?: {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  }[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ILeadStats {
  totalLeads: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  estimatedPipelineValue: number;
  recentLeads: ILead[];
  serviceDistribution: {
    service: CynbitService;
    count: number;
    percentage: number;
  }[];
  scoreDistribution: {
    score: LeadScore;
    count: number;
    percentage: number;
  }[];
  timelineDistribution: {
    timeline: string;
    count: number;
  }[];
  statusDistribution: {
    status: LeadStatus;
    count: number;
  }[];
  dailyTrends: {
    date: string;
    count: number;
  }[];
}

export interface IChatApiRequest {
  message: string;
  history: {
    role: "user" | "assistant";
    content: string;
  }[];
  currentLeadData?: Partial<ILead>;
}

export interface IChatApiResponse {
  reply: string;
  extractedLead: Partial<ILead>;
  isQualified: boolean;
  recommendedService?: CynbitService;
  leadScore?: LeadScore;
  suggestions?: string[];
}
