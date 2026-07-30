import { NextResponse } from "next/server";
import { destroyMemberSession } from "@/lib/member-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await destroyMemberSession();
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  return NextResponse.json({ ok: true, base });
}
