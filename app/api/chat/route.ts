import { NextRequest, NextResponse } from "next/server";
import { processChatWithGemini } from "@/lib/ai/gemini";
import { IChatApiRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IChatApiRequest;

    if (!body || !body.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await processChatWithGemini(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error in chat processing",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
