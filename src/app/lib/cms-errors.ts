import { NextResponse } from "next/server";
import { CmsAuthConfigurationError, hasCmsSession } from "./auth";
import {
  CmsStorageNotConfiguredError,
  CmsStorageOperationError,
  logCmsError
} from "./storage";

export async function requireCmsSession() {
  try {
    if (await hasCmsSession()) return null;
    return NextResponse.json(
      { error: "Sua sessão expirou. Entre novamente no painel.", code: "CMS_UNAUTHORIZED" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return cmsErrorResponse("auth.session", error, "Não foi possível validar a sessão do CMS.");
  }
}

export function cmsErrorResponse(scope: string, error: unknown, fallback: string) {
  if (error instanceof CmsAuthConfigurationError) {
    return NextResponse.json(
      { error: "Configure CMS_SESSION_SECRET na Vercel e faça um novo deploy.", code: error.code },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (error instanceof CmsStorageNotConfiguredError) {
    return NextResponse.json(
      { error: "Configure o Vercel Blob na Vercel e faça um novo deploy.", code: error.code },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (error instanceof CmsStorageOperationError) {
    return NextResponse.json(
      { error: error.message, code: error.code, reference: error.reference },
      { status: error.statusCode, headers: { "Cache-Control": "no-store" } }
    );
  }

  const reference = logCmsError(scope, error);
  return NextResponse.json(
    { error: `${fallback} Consulte os logs da Vercel. Referência: ${reference}.`, code: "CMS_INTERNAL_ERROR", reference },
    { status: 500, headers: { "Cache-Control": "no-store" } }
  );
}
