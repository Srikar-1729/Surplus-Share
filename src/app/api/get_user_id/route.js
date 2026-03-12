import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 404 });
  }

  return NextResponse.json({ userId });
}
