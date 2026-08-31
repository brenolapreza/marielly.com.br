import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;
const blobStoreId = () => process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN_STORE_ID;

function blobOptions() {
  return {
    token: blobToken(),
    storeId: blobStoreId()
  };
}

export class CmsStorageNotConfiguredError extends Error {
  constructor() {
    super("Configure o armazenamento do CMS antes de salvar em produção.");
    this.name = "CmsStorageNotConfiguredError";
  }
}

export class CmsContentConflictError extends Error {
  constructor() {
    super("O conteúdo foi alterado em outra sessão. Recarregue a página e tente novamente.");
    this.name = "CmsContentConflictError";
  }
}

export function hasBlobStorage() {
  return Boolean(blobToken());
}

export function assertProductionStorage() {
  if (process.env.NODE_ENV === "production" && !hasBlobStorage()) {
    throw new CmsStorageNotConfiguredError();
  }
}

export async function readPublicBlob(pathname: string) {
  const result = await get(pathname, {
    access: "public",
    ...blobOptions(),
    useCache: false
  });

  if (!result || result.statusCode !== 200) return null;
  return { text: await new Response(result.stream).text(), etag: result.blob.etag };
}

export async function writePublicBlob(pathname: string, body: string, etag?: string) {
  try {
    return await put(pathname, body, {
      access: "public",
      ...blobOptions(),
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
      allowOverwrite: true,
      ...(etag ? { ifMatch: etag } : {})
    });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) {
      throw new CmsContentConflictError();
    }
    throw error;
  }
}

export async function uploadPublicBlob(pathname: string, body: File) {
  return put(pathname, body, {
    access: "public",
    ...blobOptions(),
    contentType: body.type,
    cacheControlMaxAge: 31536000,
    allowOverwrite: false
  });
}
