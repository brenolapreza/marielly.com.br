import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "marielly_cms_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const CMS_USERNAME = "mlapreza";
const PASSWORD_HASH = "scrypt$16384$8$1$0qxATrWDbikhWozyoX355A$hI33BjpPsC8-y-OkGc2NMRO_GR_lqeJVJJrckFyjRouLIGwMTT1VBnFyPSvfzSFdYj3cdgw02vyZbPQnoojubA";
const FALLBACK_SECRET = "marielly-cms-local-session-secret-change-in-production";

function sessionSecret() {
  if (process.env.NODE_ENV === "production" && !process.env.CMS_SESSION_SECRET) {
    throw new Error("CMS_SESSION_SECRET precisa ser configurada em produção.");
  }
  return process.env.CMS_SESSION_SECRET || FALLBACK_SECRET;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function verifyPassword(password: string) {
  const [, n, r, p, salt, encodedHash] = PASSWORD_HASH.split("$");
  const expected = Buffer.from(encodedHash, "base64url");
  const actual = crypto.scryptSync(password, Buffer.from(salt, "base64url"), expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 32 * 1024 * 1024
  });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export function isValidCmsCredentials(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string") return false;
  const usernameMatches = username.length === CMS_USERNAME.length && crypto.timingSafeEqual(Buffer.from(username), Buffer.from(CMS_USERNAME));
  return usernameMatches && verifyPassword(password);
}

export async function hasCmsSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [timestamp, token, signature] = value.split(".");
  const payload = `${timestamp}.${token}`;
  if (!timestamp || !token || !signature || !/^\d+$/.test(timestamp)) return false;
  if (Date.now() - Number(timestamp) > SESSION_TTL_SECONDS * 1000 || Date.now() - Number(timestamp) < 0) return false;
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function createCmsSession() {
  const cookieStore = await cookies();
  const payload = `${Date.now()}.${crypto.randomBytes(18).toString("base64url")}`;
  cookieStore.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearCmsSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}
