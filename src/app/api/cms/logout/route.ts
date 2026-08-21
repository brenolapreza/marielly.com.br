import { NextResponse } from "next/server";
import { clearCmsSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await clearCmsSession();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
