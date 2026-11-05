import { GoogleGenerativeAI } from "@google/generative-ai";
import { IChatApiRequest, IChatApiResponse, ILead } from "@/types";
import { classifyCynbitService, extractLeadDetailsFromConversation } from "./leadClassifier";

const CYNBIT_SYSTEM_PROMPT = `
You are the Senior AI Solution Consultant for Cynbit Technologies (website: https://cynbit.in).
Cynbit Technologies is a premier software engineering & AI innovation firm specializing in:
1. AI Automation: LLM workflows, custom RAG systems, AI agents, document automation, enterprise chatbots.
2. Web Development: High-performance Next.js full-stack applications, SaaS platforms, bespoke web design, e-commerce.
3. Mobile App Development: Native and cross-platform (React Native, Flutter) mobile applications for iOS & Android.
4. Cloud Solutions: Cloud migration, AWS/Azure/GCP DevOps, Kubernetes orchestration, serverless architecture, CI/CD.
5. Technical Consulting: System architecture reviews, AI readiness audits, security & compliance, technical roadmapping.

YOUR GOAL:
Guide the website visitor through an engaging, consultative conversation to understand their requirements, qualify them as a lead, and recommend the best Cynbit service.

LEAD QUALIFICATION FLOW:
Naturally gather these 6 key details during the conversation without interrogating them all at once:
1. Name
2. Email address (required for sending proposals)
3. Business Type (Startup, Small/Medium Business, Enterprise, Agency, Individual)
4. Budget (Helpful ranges: < ₹50k, ₹50k - ₹1 Lakh, > ₹1 Lakh)
5. Project Requirement (What they want to build or solve)
6. Timeline (Immediate < 2 weeks, 1-2 Months, 3-6 Months, Flexible)

SCORING RULES:
- High Priority Lead: Budget > ₹1 Lakh (> 100,000 INR)
- Medium Priority Lead: Budget between ₹50,000 and ₹1,00,000 INR
- Low Priority Lead: Budget below ₹50,000 INR

SERVICE CLASSIFICATION OPTIONS:
- "AI Automation"
- "Web Development"
- "Mobile App Development"
- "Cloud Solutions"
- "Technical Consulting"

RESPONSE FORMAT:
Respond with a JSON object ONLY, formatted like this:
{
  "reply": "Your friendly, consultative conversational message to the user here. Keep it concise (2-4 sentences max), enthusiastic, and ask the next natural question or confirm findings.",
  "extractedLead": {
    "name": "User name if provided",
    "email": "User email if provided",
    "businessType": "Startup / Enterprise / etc if provided",
    "budget": "Budget string if provided",
    "timeline": "Timeline if provided",
    "projectRequirement": "Summary of their core requirement"
  },
  "isQualified": true_or_false,
  "recommendedService": "AI Automation" | "Web Development" | "Mobile App Development" | "Cloud Solutions" | "Technical Consulting",
  "suggestions": ["Quick reply suggestion 1", "Quick reply suggestion 2", "Quick reply suggestion 3"]
}

Important:
- "isQualified" should become true when at least: (1) projectRequirement is clear, (2) budget or budget range is provided, and (3) email or name is shared, OR when the user has enough info for Cynbit to generate a proposal.
- Always output raw valid JSON without markdown fences if possible, or within \`\`\`json \`\`\`.
`;

export async function processChatWithGemini(request: IChatApiRequest): Promise<IChatApiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If Gemini API Key is available, use Gemini
  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-1.5-flash or gemini-2.0-flash
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,
          responseMimeType: "application/json",
        },
      });

      const conversationHistoryText = request.history
        .map((m) => `${m.role === "user" ? "Visitor" : "Cynbit AI"}: ${m.content}`)
        .join("\n");

      const prompt = `
${CYNBIT_SYSTEM_PROMPT}

CURRENT STATE OF EXTRACTED LEAD:
${JSON.stringify(request.currentLeadData || {}, null, 2)}

RECENT CONVERSATION HISTORY:
${conversationHistoryText}

LATEST VISITOR MESSAGE:
Visitor: "${request.message}"

Now output the updated JSON analysis and next response:
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean markdown code blocks if present
      const cleanedJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleanedJson);

      // Merge with deterministic classifier
      const combinedRequirement = (request.currentLeadData?.projectRequirement || "") + " " + (parsed.extractedLead?.projectRequirement || "") + " " + request.message;
      const combinedBudget = parsed.extractedLead?.budget || request.currentLeadData?.budget || "";

      const classification = classifyCynbitService(combinedRequirement, combinedBudget);

      const mergedLead: Partial<ILead> = {
        ...request.currentLeadData,
        ...parsed.extractedLead,
        budgetAmount: classification.budgetAmount,
        leadScore: classification.leadScore,
        serviceRecommended: parsed.recommendedService || classification.service,
        aiAnalysis: {
          rationale: classification.rationale,
          suggestedTechStack: classification.suggestedTechStack,
          keyNeeds: classification.keyNeeds,
        },
      };

      return {
        reply: parsed.reply || "Thanks for sharing those details! Cynbit's engineering team can certainly build this for you.",
        extractedLead: mergedLead,
        isQualified: Boolean(parsed.isQualified) || Boolean(mergedLead.email && mergedLead.budget && mergedLead.projectRequirement),
        recommendedService: parsed.recommendedService || classification.service,
        leadScore: classification.leadScore,
        suggestions: parsed.suggestions || ["View Proposed Scope", "Confirm & Request Proposal", "Ask About Timeline"],
      };
    } catch (err) {
      console.warn("⚠️ Gemini API execution error, falling back to rule-based dialog engine:", err);
    }
  }

  // Resilient rule-based fallback dialog engine
  return fallbackDialogEngine(request);
}

function fallbackDialogEngine(request: IChatApiRequest): IChatApiResponse {
  const userMsg = request.message.trim();

  const current = { ...(request.currentLeadData || {}) };
  const history = [...request.history, { role: "user" as const, content: userMsg }];

  // Extract any newly provided details
  const extracted = extractLeadDetailsFromConversation(history);
  if (extracted.name && !current.name) current.name = extracted.name;
  if (extracted.email && !current.email) current.email = extracted.email;
  if (extracted.phone && !current.phone) current.phone = extracted.phone;
  if (extracted.businessType && !current.businessType) current.businessType = extracted.businessType;
  if (extracted.budget && !current.budget) current.budget = extracted.budget;
  if (extracted.timeline && !current.timeline) current.timeline = extracted.timeline;

  if (!current.projectRequirement && userMsg.length > 15 && !userMsg.includes("@")) {
    current.projectRequirement = userMsg;
  }

  // Classify current state
  const combinedText = (current.projectRequirement || userMsg) + " " + userMsg;
  const classification = classifyCynbitService(combinedText, current.budget || "");

  current.serviceRecommended = classification.service;
  current.leadScore = classification.leadScore;
  current.budgetAmount = classification.budgetAmount;
  current.aiAnalysis = {
    rationale: classification.rationale,
    suggestedTechStack: classification.suggestedTechStack,
    keyNeeds: classification.keyNeeds,
  };

  let reply = "";
  let suggestions: string[] = [];

  // Dialog step progression
  if (!current.projectRequirement) {
    reply = "Welcome to Cynbit Technologies! I'm your AI Solutions Architect. Could you tell me a little about what project or system you're looking to build?";
    suggestions = ["Build an AI Automation Agent", "Develop a Modern Web SaaS", "Create a Mobile App", "Cloud & DevOps Solutions"];
  } else if (!current.budget) {
    reply = `Got it! That sounds like an ideal fit for our **${classification.service}** practice. What budget range are you planning for this project?`;
    suggestions = ["> ₹1 Lakh (High Priority)", "₹50k - ₹1 Lakh", "< ₹50k (Lean MVP)", "Custom Estimate"];
  } else if (!current.timeline) {
    reply = `Understood. Our engineering team can definitely deliver within that tier. What is your preferred launch timeline?`;
    suggestions = ["Immediate (< 2 weeks)", "1-2 Months", "3-6 Months", "Flexible Roadmap"];
  } else if (!current.name) {
    reply = `Excellent. Who am I speaking with today? May I have your name and the type of company (Startup, Enterprise, Agency)?`;
    suggestions = ["Startup Founder", "Enterprise Tech Lead", "Small Business Owner"];
  } else if (!current.email) {
    reply = `Nice to connect with you, ${current.name}! What is the best email address to send your tailored proposal and architecture blueprint to?`;
    suggestions = ["Confirm proposal", "Add special requirements"];
  } else {
    // Fully qualified!
    reply = `Fantastic news! Based on your requirements, Cynbit's **${classification.service}** solution is the perfect match. We've scored this as a **${classification.leadScore} Priority** initiative. Click below to review and confirm your proposal!`;
    suggestions = ["Confirm & Request Proposal", "Chat with Cynbit Engineer", "Explore Case Studies"];
  }

  const isQualified = Boolean(current.email && current.budget && (current.projectRequirement || userMsg.length > 15));

  return {
    reply,
    extractedLead: current,
    isQualified,
    recommendedService: classification.service,
    leadScore: classification.leadScore,
    suggestions,
  };
}
