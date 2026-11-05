import { ILead, LeadScore, LeadStatus, CynbitService } from "@/types";

// Fallback in-memory store for instant demonstration & environments without MongoDB connection
let inMemoryLeads: ILead[] = [
  {
    id: "lead_demo_01",
    _id: "lead_demo_01",
    name: "Aarav Sharma",
    email: "aarav@finflow.io",
    phone: "+91 98201 44521",
    businessType: "Startup",
    budget: "₹2.5 Lakhs",
    budgetAmount: 250000,
    timeline: "Immediate (< 2 weeks)",
    projectRequirement: "Automate invoice reconciliation and build an AI chatbot for customer loan underwriting inquiries.",
    message: "We need an end-to-end AI pipeline integrating automated underwriting with our internal Postgres DB.",
    serviceRecommended: "AI Automation",
    leadScore: "High",
    scoreValue: 95,
    status: "New",
    tags: ["High Value", "Fintech", "AI Pipeline"],
    aiAnalysis: {
      rationale: "Client requires complex multi-step document understanding and agentic database integration with a budget well above ₹1 Lakh.",
      keyNeeds: ["OCR & Document Processing", "LLM Fine-Tuning / RAG", "Postgres Tool Calling"],
      suggestedTechStack: ["Next.js 15", "Enterprise LLMs", "LangChain", "FastAPI"],
    },
    chatHistory: [
      { role: "user", content: "Hi, we are a fintech startup looking to automate customer document intake and build an AI agent.", timestamp: "2026-11-05T10:00:00Z" },
      { role: "assistant", content: "Hello Aarav! Cynbit Technologies specializes in generative AI automation and custom LLM workflows. What is your estimated timeline and budget for this project?", timestamp: "2026-11-05T10:00:30Z" },
      { role: "user", content: "We want to launch within 2 weeks and our budget is around 2.5 lakhs.", timestamp: "2026-11-05T10:01:10Z" },
      { role: "assistant", content: "That aligns perfectly with our AI Automation accelerator tier. Let me lock in your proposal!", timestamp: "2026-11-05T10:01:45Z" },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead_demo_02",
    _id: "lead_demo_02",
    name: "Pooja Reddy",
    email: "pooja.reddy@urbanstore.co",
    phone: "+91 94481 22910",
    businessType: "Small / Medium Business",
    budget: "₹80,000",
    budgetAmount: 80000,
    timeline: "1-2 Months",
    projectRequirement: "Modern e-commerce storefront with high SEO score, responsive mobile design, and Stripe/Razorpay integration.",
    message: "Replacing our old WordPress site with Next.js and Tailwind CSS.",
    serviceRecommended: "Web Development",
    leadScore: "Medium",
    scoreValue: 80,
    status: "Proposal Sent",
    tags: ["Web Dev", "E-commerce", "Next.js"],
    aiAnalysis: {
      rationale: "Budget sits firmly between ₹50k - ₹1 Lakh. Classic modern full-stack web development scope.",
      keyNeeds: ["Next.js App Router", "Payment Gateway", "Product Catalog CMS"],
      suggestedTechStack: ["Next.js", "Tailwind CSS", "Shopify Headless / Medusa", "Razorpay"],
    },
    chatHistory: [
      { role: "user", content: "Looking for a modern website rebuild for our fashion store.", timestamp: "2026-11-04T14:20:00Z" },
      { role: "assistant", content: "Great! Cynbit crafts blazing fast Next.js e-commerce platforms. What budget range are you targeting?", timestamp: "2026-11-04T14:20:45Z" },
      { role: "user", content: "Around ₹80,000 with delivery in 4-6 weeks.", timestamp: "2026-11-04T14:21:20Z" },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "lead_demo_03",
    _id: "lead_demo_03",
    name: "Vikram Malhotra",
    email: "vikram@nexuslogistics.in",
    phone: "+91 97112 09843",
    businessType: "Enterprise",
    budget: "₹3,50,000",
    budgetAmount: 350000,
    timeline: "3-6 Months",
    projectRequirement: "Driver companion mobile application for iOS and Android with offline-first sync, GPS tracking, and proof-of-delivery signatures.",
    message: "Requires scalable backend with AWS IoT integration.",
    serviceRecommended: "Mobile App Development",
    leadScore: "High",
    scoreValue: 98,
    status: "Contacted",
    tags: ["Enterprise", "Mobile", "React Native"],
    aiAnalysis: {
      rationale: "High priority enterprise lead. Budget > ₹1 Lakh with cross-platform mobile app requirements and hardware GPS tracking.",
      keyNeeds: ["React Native / Flutter", "Offline DB", "Background Geolocation"],
      suggestedTechStack: ["React Native", "Node.js Microservices", "AWS ECS", "MongoDB"],
    },
    chatHistory: [
      { role: "user", content: "We need a driver mobile app for 200+ fleet vehicles.", timestamp: "2026-11-03T11:00:00Z" },
      { role: "assistant", content: "Cynbit has extensive experience building mission-critical mobile apps. May I know your timeline and budget?", timestamp: "2026-11-03T11:01:00Z" },
      { role: "user", content: "Budget is 3.5 lakhs, timeline 3 months.", timestamp: "2026-11-03T11:02:10Z" },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "lead_demo_04",
    _id: "lead_demo_04",
    name: "Neha Kapoor",
    email: "neha@kapoorcreative.agency",
    phone: "+91 98114 55670",
    businessType: "Agency / Partner",
    budget: "₹35,000",
    budgetAmount: 35000,
    timeline: "Flexible",
    projectRequirement: "Basic consultation on migrating two legacy EC2 servers to serverless architecture and containerizing docker apps.",
    message: "Need quick audit and advisory session.",
    serviceRecommended: "Cloud Solutions",
    leadScore: "Low",
    scoreValue: 60,
    status: "New",
    tags: ["Cloud", "DevOps", "Advisory"],
    aiAnalysis: {
      rationale: "Budget is under ₹50k, classified as Low priority. Focus on scoped technical advisory.",
      keyNeeds: ["AWS Migration Plan", "Dockerization", "Cost Optimization"],
      suggestedTechStack: ["AWS Lambda", "Terraform", "Docker"],
    },
    chatHistory: [
      { role: "user", content: "Need help moving our cloud infrastructure to serverless.", timestamp: "2026-11-02T16:00:00Z" },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "lead_demo_05",
    _id: "lead_demo_05",
    name: "Devendra Verma",
    email: "devendra@cloudhealth.tech",
    phone: "+91 99220 33118",
    businessType: "Startup",
    budget: "₹1,20,000",
    budgetAmount: 120000,
    timeline: "1-2 Months",
    projectRequirement: "Architecture audit and HIPAA compliance readiness consultation for our healthcare data ingestion pipeline.",
    message: "Need high-level system architect for 4 weeks.",
    serviceRecommended: "Technical Consulting",
    leadScore: "High",
    scoreValue: 90,
    status: "Qualified",
    tags: ["Consulting", "Healthcare", "Compliance"],
    aiAnalysis: {
      rationale: "Specialized technical consulting for healthcare compliance. Budget > ₹1 Lakh marks as High priority.",
      keyNeeds: ["HIPAA Architecture", "Security Audit", "API Encryption"],
      suggestedTechStack: ["AWS KMS", "Kubernetes", "OpenID Connect"],
    },
    chatHistory: [],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export const memoryStore = {
  getLeads: (filters?: { score?: LeadScore; service?: CynbitService; search?: string; status?: LeadStatus }): ILead[] => {
    let list = [...inMemoryLeads];

    if (filters?.score && filters.score !== ("All" as any)) {
      list = list.filter((l) => l.leadScore === filters.score);
    }
    if (filters?.service && filters.service !== ("All" as any)) {
      list = list.filter((l) => l.serviceRecommended === filters.service);
    }
    if (filters?.status && filters.status !== ("All" as any)) {
      list = list.filter((l) => l.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.projectRequirement.toLowerCase().includes(q) ||
          l.businessType.toLowerCase().includes(q) ||
          l.serviceRecommended.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getLeadById: (id: string): ILead | undefined => {
    return inMemoryLeads.find((l) => l.id === id || l._id === id);
  },

  createLead: (leadData: Omit<ILead, "id" | "_id" | "createdAt" | "updatedAt">): ILead => {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newLead: ILead = {
      ...leadData,
      id,
      _id: id,
      createdAt: now,
      updatedAt: now,
    };
    inMemoryLeads.unshift(newLead);
    return newLead;
  },

  updateLead: (id: string, updates: Partial<ILead>): ILead | null => {
    const index = inMemoryLeads.findIndex((l) => l.id === id || l._id === id);
    if (index === -1) return null;

    inMemoryLeads[index] = {
      ...inMemoryLeads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryLeads[index];
  },

  deleteLead: (id: string): boolean => {
    const initialLen = inMemoryLeads.length;
    inMemoryLeads = inMemoryLeads.filter((l) => l.id !== id && l._id !== id);
    return inMemoryLeads.length < initialLen;
  },

  seedDemoLeads: () => {
    // Reset or reseed
    return inMemoryLeads;
  },
};
