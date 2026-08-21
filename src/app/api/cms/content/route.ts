import { NextResponse } from "next/server";
import { hasCmsSession } from "../../../lib/auth";
import { getSiteContent, saveSiteContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await hasCmsSession())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  return NextResponse.json(await getSiteContent(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await hasCmsSession())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    const content = await saveSiteContent(body);
    return NextResponse.json({ ok: true, content }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar agora." }, { status: 500 });
  }
}
