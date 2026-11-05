import { CynbitService, LeadScore, ILead } from "@/types";
import { parseBudgetString } from "@/lib/utils/formatters";

export interface ClassificationResult {
  service: CynbitService;
  leadScore: LeadScore;
  budgetAmount: number;
  scoreValue: number;
  rationale: string;
  suggestedTechStack: string[];
  keyNeeds: string[];
}

export function classifyCynbitService(requirementText: string, declaredBudget: string = ""): ClassificationResult {
  const text = (requirementText + " " + declaredBudget).toLowerCase();

  const { amount: budgetAmount, score: leadScore } = parseBudgetString(declaredBudget);

  // Scores for each service category based on signal keywords
  const scores: Record<CynbitService, number> = {
    "AI Automation": 0,
    "Web Development": 0,
    "Mobile App Development": 0,
    "Cloud Solutions": 0,
    "Technical Consulting": 0,
  };

  const aiKeywords = [
    "ai", "artificial intelligence", "automation", "llm", "gpt", "gemini", "chatbot", "bot", "agent",
    "agentic", "workflow", "rag", "langchain", "prompt", "nlp", "computer vision", "machine learning",
    "automate", "intelligent", "neural", "predictive", "fine-tuning",
  ];

  const webKeywords = [
    "web", "website", "next.js", "nextjs", "react", "frontend", "full stack", "fullstack", "saas",
    "portal", "e-commerce", "ecommerce", "storefront", "dashboard", "tailwind", "cms", "landing page",
    "seo", "redesign", "web application",
  ];

  const mobileKeywords = [
    "mobile", "app", "ios", "android", "flutter", "react native", "play store", "app store",
    "cross platform", "cross-platform", "phone app", "tablet", "companion app", "hybrid app",
  ];

  const cloudKeywords = [
    "cloud", "aws", "azure", "gcp", "devops", "kubernetes", "k8s", "docker", "serverless",
    "ci/cd", "cicd", "migration", "pipeline", "infrastructure", "terraform", "helm", "hosting",
  ];

  const consultingKeywords = [
    "consulting", "consultation", "audit", "architecture", "advisory", "strategy", "cto",
    "assessment", "feasibility", "review", "security audit", "hipaa", "compliance", "roadmap",
  ];

  aiKeywords.forEach((kw) => {
    if (text.includes(kw)) scores["AI Automation"] += 2;
  });
  webKeywords.forEach((kw) => {
    if (text.includes(kw)) scores["Web Development"] += 2;
  });
  mobileKeywords.forEach((kw) => {
    if (text.includes(kw)) scores["Mobile App Development"] += 2;
  });
  cloudKeywords.forEach((kw) => {
    if (text.includes(kw)) scores["Cloud Solutions"] += 2;
  });
  consultingKeywords.forEach((kw) => {
    if (text.includes(kw)) scores["Technical Consulting"] += 2;
  });

  // Pick top service
  let topService: CynbitService = "AI Automation";
  let maxScore = -1;

  for (const [srv, scr] of Object.entries(scores)) {
    if (scr > maxScore) {
      maxScore = scr;
      topService = srv as CynbitService;
    }
  }

  // If no strong match, default based on typical inbound profile or fallback
  if (maxScore === 0) {
    if (text.includes("app")) topService = "Mobile App Development";
    else if (text.includes("site") || text.includes("page")) topService = "Web Development";
    else topService = "AI Automation";
  }

  // Tech stacks & recommendations map
  const techMap: Record<CynbitService, { stack: string[]; needs: string[]; baseRationale: string }> = {
    "AI Automation": {
      stack: ["Next.js 15", "Enterprise LLM Pipelines", "LangChain / LlamaIndex", "FastAPI / Python", "Vector DB (Pinecone/pgvector)"],
      needs: ["Automated task processing", "LLM reasoning & extraction", "Enterprise database integrations"],
      baseRationale: "Client benefits from Cynbit's AI Automation framework for operational cost reduction and intelligent user interactions.",
    },
    "Web Development": {
      stack: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "shadcn/ui", "Prisma / MongoDB", "PostgreSQL"],
      needs: ["Modern responsive UI", "Lightning performance (Core Web Vitals)", "Conversion-focused SEO"],
      baseRationale: "Client requires a modern, scalable web platform engineered with Next.js and high-speed UI architectures.",
    },
    "Mobile App Development": {
      stack: ["React Native / Expo", "Flutter", "TypeScript", "Node.js API", "Firebase / Supabase"],
      needs: ["Cross-platform iOS & Android launch", "Fluid 60fps animations", "Offline-first capability"],
      baseRationale: "Client requires a native-feel mobile application with fast time-to-market across iOS and Android.",
    },
    "Cloud Solutions": {
      stack: ["AWS / GCP / Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions CI/CD"],
      needs: ["High availability & auto-scaling", "Zero-downtime deployments", "Cloud cost optimization"],
      baseRationale: "Client requires resilient cloud architecture, container orchestration, and continuous deployment automation.",
    },
    "Technical Consulting": {
      stack: ["System Architecture Design", "Security & HIPAA/SOC2 Audit", "Technology Roadmap", "Code Review"],
      needs: ["Strategic technology guidance", "Scalability bottleneck identification", "AI readiness advisory"],
      baseRationale: "Client requires expert technical consulting to de-risk architecture decisions and plan long-term technology roadmaps.",
    },
  };

  const details = techMap[topService];

  // Quantitative score 0 - 100
  let scoreValue = 60;
  if (leadScore === "High") scoreValue = 92;
  else if (leadScore === "Medium") scoreValue = 78;
  else scoreValue = 52;

  const rationale = `${details.baseRationale} Classified as ${leadScore} Priority based on budget (${declaredBudget || "Standard tier"}) and project scope.`;

  return {
    service: topService,
    leadScore,
    budgetAmount,
    scoreValue,
    rationale,
    suggestedTechStack: details.stack,
    keyNeeds: details.needs,
  };
}

export function extractLeadDetailsFromConversation(history: { role: string; content: string }[]): Partial<ILead> {
  const fullText = history.map((m) => m.content).join(" \n ");

  const partial: Partial<ILead> = {};

  // Email regex
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    partial.email = emailMatch[0].trim();
  }

  // Phone regex (Indian or international)
  const phoneMatch = fullText.match(/(?:\+91[\s-]?)?[6789]\d{9}/);
  if (phoneMatch) {
    partial.phone = phoneMatch[0].trim();
  }

  // Name heuristic (e.g., "my name is X", "I am X", "this is X")
  const nameMatch = fullText.match(/(?:my name is|i am|this is|name:)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
  if (nameMatch) {
    partial.name = nameMatch[1].trim();
  }

  // Business Type
  const lower = fullText.toLowerCase();
  if (lower.includes("startup")) partial.businessType = "Startup";
  else if (lower.includes("enterprise") || lower.includes("corporate")) partial.businessType = "Enterprise";
  else if (lower.includes("agency")) partial.businessType = "Agency / Partner";
  else if (lower.includes("small business") || lower.includes("sme") || lower.includes("retail")) partial.businessType = "Small / Medium Business";

  // Budget
  const budgetMatch = fullText.match(/(?:budget\s*(?:is|of|around|:)?\s*)(₹?\s*[\d.]+\s*(?:lakh|lacs|lac|k|thousand|\b000\b)?)/i);
  if (budgetMatch) {
    partial.budget = budgetMatch[1].trim();
  } else if (lower.includes("> 1 lakh") || lower.includes("above 1 lakh") || lower.includes("more than 1 lakh")) {
    partial.budget = "> ₹1 Lakh";
  } else if (lower.includes("50k - 1 lakh") || lower.includes("50000 - 100000")) {
    partial.budget = "₹50k - ₹1 Lakh";
  } else if (lower.includes("below 50k") || lower.includes("under 50k") || lower.includes("< 50k")) {
    partial.budget = "< ₹50k";
  }

  // Timeline
  if (lower.includes("immediate") || lower.includes("2 weeks") || lower.includes("asap") || lower.includes("urgent")) {
    partial.timeline = "Immediate (< 2 weeks)";
  } else if (lower.includes("1-2 month") || lower.includes("1 to 2 month") || lower.includes("few weeks")) {
    partial.timeline = "1-2 Months";
  } else if (lower.includes("3-6 month") || lower.includes("quarter")) {
    partial.timeline = "3-6 Months";
  } else if (lower.includes("flexible")) {
    partial.timeline = "Flexible";
  }

  return partial;
}
