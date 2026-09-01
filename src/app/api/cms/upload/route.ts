import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { cmsErrorResponse, requireCmsSession } from "../../../lib/cms-errors";
import { assertProductionStorage, hasBlobStorage, uploadPublicBlob } from "../../../lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif"
};

export async function POST(request: Request) {
  const sessionError = await requireCmsSession();
  if (sessionError) return sessionError;

  try {
    const formData = await request.formData();
    const upload = formData.get("image");

    if (!upload || typeof upload === "string" || !extensions[upload.type]) {
      return NextResponse.json({ error: "Escolha uma imagem JPG, PNG, WebP, GIF ou AVIF." }, { status: 400 });
    }
    if (upload.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "A imagem precisa ter no máximo 8 MB." }, { status: 400 });
    }

    assertProductionStorage();
    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    const filename = `imagem-${crypto.randomUUID()}.${extensions[upload.type]}`;

    if (hasBlobStorage()) {
      const blob = await uploadPublicBlob(`uploads/${filename}`, upload);
      return NextResponse.json({ ok: true, url: blob.url, filename }, { headers: { "Cache-Control": "no-store" } });
    }

    await fs.mkdir(uploadDirectory, { recursive: true });
    await fs.writeFile(path.join(uploadDirectory, filename), Buffer.from(await upload.arrayBuffer()), { mode: 0o644 });

    return NextResponse.json({ ok: true, url: `/uploads/${filename}`, filename }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return cmsErrorResponse("upload", error, "Não foi possível enviar essa imagem.");
  }
}
