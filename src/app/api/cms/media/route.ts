import { NextResponse } from "next/server";
import { cmsErrorResponse } from "../../../lib/cms-errors";
import { readPrivateBlob } from "../../../lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const pathname = new URL(request.url).searchParams.get("pathname");
  if (!pathname || !pathname.startsWith("uploads/") || pathname.includes("..")) {
    return NextResponse.json({ error: "Imagem não encontrada.", code: "CMS_MEDIA_NOT_FOUND" }, { status: 404 });
  }

  try {
    const blob = await readPrivateBlob(pathname);
    if (!blob) return new NextResponse("Imagem não encontrada.", { status: 404 });
    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    return cmsErrorResponse("media", error, "Não foi possível carregar essa imagem.");
  }
}
