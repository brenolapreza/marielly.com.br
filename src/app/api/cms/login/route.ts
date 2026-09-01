import { NextResponse } from "next/server";
import { cmsErrorResponse } from "../../../lib/cms-errors";
import { createCmsSession, isValidCmsCredentials } from "../../../lib/auth";

export const runtime = "nodejs";

type Attempt = { count: number; firstAttemptAt: number };
const attempts = new Map<string, Attempt>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function requestIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function POST(request: Request) {
  const ip = requestIp(request);
  const now = Date.now();
  const previous = attempts.get(ip);
  if (previous && now - previous.firstAttemptAt < WINDOW_MS && previous.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos.", code: "CMS_LOGIN_RATE_LIMIT" }, { status: 429, headers: { "Cache-Control": "no-store" } });
  }

  let body: { username?: unknown; password?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos.", code: "CMS_INVALID_JSON" }, { status: 400 });
  }

  if (!isValidCmsCredentials(body.username, body.password)) {
    const current = previous && now - previous.firstAttemptAt < WINDOW_MS ? previous : { count: 0, firstAttemptAt: now };
    attempts.set(ip, { count: current.count + 1, firstAttemptAt: current.firstAttemptAt });
    return NextResponse.json({ error: "Usuário ou senha incorretos.", code: "CMS_INVALID_CREDENTIALS" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  attempts.delete(ip);
  try {
    await createCmsSession();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return cmsErrorResponse("auth.login", error, "Não foi possível iniciar a sessão.");
  }
}
