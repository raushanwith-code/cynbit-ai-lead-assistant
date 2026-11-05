import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import Lead from "@/lib/db/models/Lead";
import { memoryStore } from "@/lib/db/inMemoryStore";

export async function POST() {
  try {
    const { isUsingMemory } = await connectToDatabase();
    const demoLeads = memoryStore.seedDemoLeads();

    if (!isUsingMemory) {
      // Seed into MongoDB if not present
      for (const d of demoLeads) {
        const exists = await Lead.findOne({ email: d.email });
        if (!exists) {
          const payload = { ...d };
          delete payload.id;
          delete payload._id;
          await Lead.create(payload);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sample Cynbit leads successfully initialized",
      count: demoLeads.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to seed demo leads", details: error?.message }, { status: 500 });
  }
}
