import { NextResponse } from "next/server";
import { cmsErrorResponse, requireCmsSession } from "../../../lib/cms-errors";
import { getSiteContent, saveSiteContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const sessionError = await requireCmsSession();
  if (sessionError) return sessionError;
  return NextResponse.json(await getSiteContent(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const sessionError = await requireCmsSession();
  if (sessionError) return sessionError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Os dados enviados pelo painel estão inválidos. Recarregue a página e tente novamente.", code: "CMS_INVALID_JSON" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const content = await saveSiteContent(body);
    return NextResponse.json({ ok: true, content }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return cmsErrorResponse("content.save", error, "Não foi possível salvar as alterações.");
  }
}
