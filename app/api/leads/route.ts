import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import Lead from "@/lib/db/models/Lead";
import { memoryStore } from "@/lib/db/inMemoryStore";
import { sendLeadNotificationEmail } from "@/lib/email/notifier";
import { ILead, LeadScore, CynbitService, LeadStatus } from "@/types";
import { parseBudgetString } from "@/lib/utils/formatters";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ILead>;

    if (!body.name || !body.email || !body.projectRequirement) {
      return NextResponse.json(
        { error: "Name, email, and project requirement are required fields" },
        { status: 400 }
      );
    }

    const { amount, score } = parseBudgetString(body.budget || "");

    const newLeadPayload = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || "",
      businessType: body.businessType || "Startup",
      budget: body.budget || "₹50k - ₹1 Lakh",
      budgetAmount: body.budgetAmount || amount,
      timeline: body.timeline || "1-2 Months",
      projectRequirement: body.projectRequirement.trim(),
      message: body.message || "",
      serviceRecommended: (body.serviceRecommended as CynbitService) || "AI Automation",
      leadScore: (body.leadScore as LeadScore) || score,
      scoreValue: body.scoreValue || (score === "High" ? 95 : score === "Medium" ? 75 : 55),
      status: "New" as LeadStatus,
      tags: body.tags || [score + " Priority", body.serviceRecommended || "AI"],
      aiAnalysis: body.aiAnalysis || {
        rationale: "Automatically qualified by Cynbit AI Assistant.",
      },
      chatHistory: body.chatHistory || [],
    };

    const { isUsingMemory } = await connectToDatabase();

    let savedLead: ILead;

    if (!isUsingMemory) {
      try {
        const leadDoc = await Lead.create(newLeadPayload);
        savedLead = leadDoc.toJSON() as unknown as ILead;
        if (savedLead._id) savedLead.id = savedLead._id.toString();
      } catch (dbErr) {
        console.warn("MongoDB save failed, persisting to memoryStore fallback:", dbErr);
        savedLead = memoryStore.createLead(newLeadPayload);
      }
    } else {
      savedLead = memoryStore.createLead(newLeadPayload);
    }

    // Trigger Lead Email Notification asynchronously (Bonus feature)
    sendLeadNotificationEmail(savedLead).catch((err) => {
      console.warn("Email notification dispatch error:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead successfully qualified and captured",
        lead: savedLead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API /api/leads POST error:", error);
    return NextResponse.json(
      { error: "Failed to process lead capture", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const score = searchParams.get("score") as LeadScore | undefined;
    const service = searchParams.get("service") as CynbitService | undefined;
    const status = searchParams.get("status") as LeadStatus | undefined;
    const search = searchParams.get("search") || undefined;

    const { isUsingMemory } = await connectToDatabase();

    if (isUsingMemory) {
      const leads = memoryStore.getLeads({ score, service, status, search });
      return NextResponse.json({
        leads,
        total: leads.length,
        source: "in-memory",
      });
    }

    // MongoDB query
    const query: Record<string, any> = {};

    if (score && score !== ("All" as any)) {
      query.leadScore = score;
    }
    if (service && service !== ("All" as any)) {
      query.serviceRecommended = service;
    }
    if (status && status !== ("All" as any)) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { projectRequirement: { $regex: search, $options: "i" } },
        { businessType: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

    const formattedLeads = leads.map((l: any) => ({
      ...l,
      id: l._id.toString(),
    }));

    return NextResponse.json({
      leads: formattedLeads,
      total: formattedLeads.length,
      source: "mongodb",
    });
  } catch (error: any) {
    console.error("API /api/leads GET error:", error);
    // Fallback on error to memoryStore
    const fallbackLeads = memoryStore.getLeads();
    return NextResponse.json({
      leads: fallbackLeads,
      total: fallbackLeads.length,
      source: "in-memory-fallback",
    });
  }
}
