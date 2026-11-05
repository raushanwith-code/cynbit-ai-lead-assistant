import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import Lead from "@/lib/db/models/Lead";
import { memoryStore } from "@/lib/db/inMemoryStore";
import { exportLeadsToCSV } from "@/lib/utils/csvExporter";
import { ILead, LeadScore, CynbitService } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const score = searchParams.get("score") as LeadScore | undefined;
    const service = searchParams.get("service") as CynbitService | undefined;

    const { isUsingMemory } = await connectToDatabase();

    let leads: ILead[] = [];

    if (isUsingMemory) {
      leads = memoryStore.getLeads({ score, service });
    } else {
      try {
        const query: Record<string, any> = {};
        if (score && score !== ("All" as any)) query.leadScore = score;
        if (service && service !== ("All" as any)) query.serviceRecommended = service;
        const docs = await Lead.find(query).sort({ createdAt: -1 }).lean();
        leads = docs.map((d: any) => ({ ...d, id: d._id.toString() }));
      } catch {
        leads = memoryStore.getLeads({ score, service });
      }
    }

    const csvData = exportLeadsToCSV(leads);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `cynbit-leads-${timestamp}.csv`;

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("API /api/leads/export error:", error);
    return NextResponse.json({ error: "Failed to export leads" }, { status: 500 });
  }
}
