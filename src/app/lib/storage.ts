import crypto from "node:crypto";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

const configuredBlobToken = () => process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;
const blobStoreId = () => process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN_STORE_ID;
type BlobAccess = "public" | "private";

function preferredBlobAccess(): BlobAccess {
  if (process.env.BLOB_ACCESS === "private") return "private";
  if (process.env.BLOB_ACCESS === "public") return "public";
  return process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN ? "private" : "public";
}

function blobOptions() {
  const storeId = blobStoreId();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;
  if (oidcToken && storeId) return { oidcToken, storeId };
  return { token: configuredBlobToken(), storeId };
}

function isAccessError(error: unknown) {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return name === "BlobAccessError" || message.includes("forbidden") || message.includes("public blob") || message.includes("private blob");
}

async function withBlobAccess<T>(scope: string, action: (access: BlobAccess) => Promise<T>) {
  const primaryAccess = preferredBlobAccess();
  const secondaryAccess = primaryAccess === "private" ? "public" : "private";

  try {
    return { access: primaryAccess, result: await action(primaryAccess) };
  } catch (error) {
    if (error instanceof CmsContentConflictError || error instanceof CmsStorageOperationError) throw error;
    if (!isAccessError(error)) throw storageOperationError(scope, error);
    try {
      return { access: secondaryAccess, result: await action(secondaryAccess) };
    } catch (privateError) {
      throw storageOperationError(scope, privateError);
    }
  }
}

export class CmsStorageNotConfiguredError extends Error {
  readonly code = "CMS_STORAGE_NOT_CONFIGURED";

  constructor() {
    super("Configure o armazenamento do CMS antes de salvar em produção.");
    this.name = "CmsStorageNotConfiguredError";
  }
}

export class CmsContentConflictError extends Error {
  readonly code = "CMS_CONTENT_CONFLICT";

  constructor() {
    super("O conteúdo foi alterado em outra sessão. Recarregue a página e tente novamente.");
    this.name = "CmsContentConflictError";
  }
}

export type CmsStorageErrorCode = "CMS_BLOB_TOKEN" | "CMS_BLOB_STORE" | "CMS_BLOB_ACCESS" | "CMS_BLOB_UNAVAILABLE" | "CMS_BLOB_UNKNOWN";

export class CmsStorageOperationError extends Error {
  constructor(
    readonly code: CmsStorageErrorCode,
    message: string,
    readonly statusCode: 502 | 503,
    readonly reference: string
  ) {
    super(message);
    this.name = "CmsStorageOperationError";
  }
}

function safeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]").replace(/vercel_blob_[\w-]+/gi, "[redacted]");
}

export function logCmsError(scope: string, error: unknown) {
  const reference = crypto.randomUUID().slice(0, 8);
  const details = error instanceof Error ? { name: error.name, message: safeErrorMessage(error), stack: error.stack } : { name: "UnknownError", message: safeErrorMessage(error) };
  console.error(`[CMS ${scope}] ${reference}`, details);
  return reference;
}

function storageOperationError(scope: string, error: unknown) {
  if (error instanceof CmsStorageOperationError) return error;

  const reference = logCmsError(scope, error);
  const name = error instanceof Error ? error.name : "";
  const message = safeErrorMessage(error).toLowerCase();

  if (name === "BlobClientTokenExpiredError" || message.includes("token") || message.includes("unauthorized")) {
    return new CmsStorageOperationError(
      "CMS_BLOB_TOKEN",
      "O token do Vercel Blob foi rejeitado. Confirme se o token completo está na variável de Produção e não foi cadastrado como ********.",
      503,
      reference
    );
  }
  if (name === "BlobStoreNotFoundError" || name === "BlobStoreSuspendedError" || message.includes("store not found")) {
    return new CmsStorageOperationError(
      "CMS_BLOB_STORE",
      "A Blob Store não foi encontrada ou está suspensa. Confira o Store ID e se a variável está no projeto correto.",
      503,
      reference
    );
  }
  if (name === "BlobAccessError" || message.includes("forbidden") || message.includes("public")) {
    return new CmsStorageOperationError(
      "CMS_BLOB_ACCESS",
      "O Blob recusou o acesso. Confirme se o token pertence à Blob Store e se o tipo de acesso está correto (pública ou privada).",
      503,
      reference
    );
  }
  if (name === "BlobServiceNotAvailable" || name === "BlobServiceRateLimited" || message.includes("rate limit") || message.includes("temporarily")) {
    return new CmsStorageOperationError(
      "CMS_BLOB_UNAVAILABLE",
      "O Vercel Blob está temporariamente indisponível ou atingiu um limite. Tente novamente em alguns instantes.",
      503,
      reference
    );
  }
  return new CmsStorageOperationError(
    "CMS_BLOB_UNKNOWN",
    "Falha técnica ao acessar o Vercel Blob. Consulte os logs da Vercel para a referência informada.",
    502,
    reference
  );
}

export function hasBlobStorage() {
  return Boolean(configuredBlobToken() || (process.env.VERCEL_OIDC_TOKEN && blobStoreId()));
}

export function assertProductionStorage() {
  if (process.env.NODE_ENV === "production" && !hasBlobStorage()) {
    throw new CmsStorageNotConfiguredError();
  }
}

export async function readPublicBlob(pathname: string) {
  const blob = await withBlobAccess("storage.read", async (access) => {
    const result = await get(pathname, { access, ...blobOptions(), useCache: false });

    if (!result || result.statusCode !== 200) return null;
    return { text: await new Response(result.stream).text(), etag: result.blob.etag };
  });
  return blob.result;
}

export async function writePublicBlob(pathname: string, body: string, etag?: string) {
  const blob = await withBlobAccess("storage.write", async (access) => {
    try {
      return await put(pathname, body, {
        access,
        ...blobOptions(),
        contentType: "application/json; charset=utf-8",
        cacheControlMaxAge: 60,
        allowOverwrite: true,
        ...(etag ? { ifMatch: etag } : {})
      });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) throw new CmsContentConflictError();
      throw error;
    }
  });
  return blob.result;
}

export async function uploadPublicBlob(pathname: string, body: File) {
  const blob = await withBlobAccess("storage.upload", (access) => put(pathname, body, {
    access,
    ...blobOptions(),
    contentType: body.type,
    cacheControlMaxAge: 31536000,
    allowOverwrite: false
  }));

  return blob.access === "private"
    ? { ...blob.result, url: `/api/cms/media?pathname=${encodeURIComponent(blob.result.pathname)}` }
    : blob.result;
}

export async function readPrivateBlob(pathname: string) {
  try {
    const result = await get(pathname, { access: "private", ...blobOptions(), useCache: false });
    return result && result.statusCode === 200 ? result : null;
  } catch (error) {
    throw storageOperationError("storage.media", error);
  }
}
