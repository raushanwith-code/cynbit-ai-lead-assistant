import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import Lead from "@/lib/db/models/Lead";
import { memoryStore } from "@/lib/db/inMemoryStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isUsingMemory } = await connectToDatabase();

    if (isUsingMemory) {
      const lead = memoryStore.getLeadById(id);
      if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      return NextResponse.json(lead);
    }

    const lead = await Lead.findById(id).lean();
    if (!lead) {
      // Check memory store in case it was a demo lead
      const memLead = memoryStore.getLeadById(id);
      if (memLead) return NextResponse.json(memLead);
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ...(lead as any), id: (lead as any)._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch lead", details: error?.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const { isUsingMemory } = await connectToDatabase();

    if (isUsingMemory) {
      const updated = memoryStore.updateLead(id, updates);
      if (!updated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      return NextResponse.json(updated);
    }

    const updated = await Lead.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!updated) {
      const memUpdated = memoryStore.updateLead(id, updates);
      if (memUpdated) return NextResponse.json(memUpdated);
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ...(updated as any), id: (updated as any)._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update lead", details: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isUsingMemory } = await connectToDatabase();

    if (isUsingMemory) {
      const deleted = memoryStore.deleteLead(id);
      if (!deleted) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Lead removed" });
    }

    const res = await Lead.findByIdAndDelete(id);
    if (!res) {
      const memDeleted = memoryStore.deleteLead(id);
      if (memDeleted) return NextResponse.json({ success: true, message: "Lead removed" });
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead removed" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete lead", details: error?.message }, { status: 500 });
  }
}
