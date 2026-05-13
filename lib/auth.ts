import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const cookieName = "miraj_admin_session";
const oneDay = 60 * 60 * 24;

function secret() {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (process.env.NODE_ENV !== "production") return "local-development-session-secret";
  throw new Error("ADMIN_SESSION_SECRET is required in production.");
}

function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "change-me";
  throw new Error("ADMIN_PASSWORD is required in production.");
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionCookie() {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(session?: string) {
  if (!session) return false;
  const parts = session.split(".");
  if (parts.length !== 3) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const signature = parts[2];
  const expected = sign(payload);

  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function isAdminRequest() {
  return isValidSession(cookies().get(cookieName)?.value);
}

export function verifyPassword(password: string) {
  const expected = Buffer.from(adminPassword());
  const actual = Buffer.from(password);
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

export function setAdminCookie(response: NextResponse, session: string) {
  response.cookies.set(cookieName, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: oneDay,
    path: "/"
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
}
