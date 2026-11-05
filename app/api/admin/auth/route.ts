import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || "cynbit2026";

    if (!password) {
      return NextResponse.json({ error: "Password or Access PIN is required" }, { status: 400 });
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid Cynbit Admin credentials" }, { status: 401 });
    }

    // Return authenticated session token
    const token = `cynbit_auth_${Buffer.from(password + ":" + Date.now()).toString("base64")}`;

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      token,
      admin: {
        role: "SuperAdmin",
        email: process.env.ADMIN_EMAIL || "admin@cynbit.in",
        portal: "Cynbit Technologies Executive Control",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Authentication failed", details: error?.message }, { status: 500 });
  }
}
