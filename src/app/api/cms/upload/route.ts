import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasCmsSession } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif"
};

export async function POST(request: Request) {
  if (!(await hasCmsSession())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const formData = await request.formData();
    const upload = formData.get("image");

    if (!upload || typeof upload === "string" || !extensions[upload.type]) {
      return NextResponse.json({ error: "Escolha uma imagem JPG, PNG, WebP, GIF ou AVIF." }, { status: 400 });
    }
    if (upload.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "A imagem precisa ter no máximo 8 MB." }, { status: 400 });
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDirectory, { recursive: true });
    const filename = `imagem-${crypto.randomUUID()}.${extensions[upload.type]}`;
    await fs.writeFile(path.join(uploadDirectory, filename), Buffer.from(await upload.arrayBuffer()), { mode: 0o644 });

    return NextResponse.json({ ok: true, url: `/uploads/${filename}`, filename }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar essa imagem agora." }, { status: 500 });
  }
}
