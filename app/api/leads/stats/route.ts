import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import Lead from "@/lib/db/models/Lead";
import { memoryStore } from "@/lib/db/inMemoryStore";
import { ILead, ILeadStats, CynbitService, LeadScore, LeadStatus } from "@/types";

export async function GET() {
  try {
    const { isUsingMemory } = await connectToDatabase();

    let allLeads: ILead[] = [];

    if (isUsingMemory) {
      allLeads = memoryStore.getLeads();
    } else {
      try {
        const docs = await Lead.find({}).sort({ createdAt: -1 }).lean();
        allLeads = docs.map((d: any) => ({ ...d, id: d._id.toString() }));
      } catch {
        allLeads = memoryStore.getLeads();
      }
    }

    const totalLeads = allLeads.length;

    // Priority counts
    const highPriorityCount = allLeads.filter((l) => l.leadScore === "High").length;
    const mediumPriorityCount = allLeads.filter((l) => l.leadScore === "Medium").length;
    const lowPriorityCount = allLeads.filter((l) => l.leadScore === "Low").length;

    // Pipeline value
    const estimatedPipelineValue = allLeads.reduce((acc, curr) => acc + (curr.budgetAmount || 0), 0);

    // Service distribution
    const services: CynbitService[] = [
      "AI Automation",
      "Web Development",
      "Mobile App Development",
      "Cloud Solutions",
      "Technical Consulting",
    ];

    const serviceDistribution = services.map((service) => {
      const count = allLeads.filter((l) => l.serviceRecommended === service).length;
      return {
        service,
        count,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
      };
    });

    // Score distribution
    const scores: LeadScore[] = ["High", "Medium", "Low"];
    const scoreDistribution = scores.map((score) => {
      const count = allLeads.filter((l) => l.leadScore === score).length;
      return {
        score,
        count,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
      };
    });

    // Timeline distribution
    const timelineMap: Record<string, number> = {};
    allLeads.forEach((l) => {
      const t = l.timeline || "Flexible";
      timelineMap[t] = (timelineMap[t] || 0) + 1;
    });
    const timelineDistribution = Object.entries(timelineMap).map(([timeline, count]) => ({
      timeline,
      count,
    }));

    // Status distribution
    const statuses: LeadStatus[] = ["New", "Contacted", "Proposal Sent", "Qualified", "Closed"];
    const statusDistribution = statuses.map((status) => ({
      status,
      count: allLeads.filter((l) => l.status === status).length,
    }));

    // Daily trends (last 7 days)
    const trendsMap: Record<string, number> = {};
    allLeads.forEach((l) => {
      const day = new Date(l.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      trendsMap[day] = (trendsMap[day] || 0) + 1;
    });

    const dailyTrends = Object.entries(trendsMap).map(([date, count]) => ({
      date,
      count,
    }));

    const stats: ILeadStats = {
      totalLeads,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
      estimatedPipelineValue,
      recentLeads: allLeads.slice(0, 5),
      serviceDistribution,
      scoreDistribution,
      timelineDistribution,
      statusDistribution,
      dailyTrends,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("API /api/leads/stats error:", error);
    return NextResponse.json({ error: "Failed to generate analytics stats" }, { status: 500 });
  }
}
