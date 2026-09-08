import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export type WorkspaceRole = "ADMIN" | "FACULTY" | "STUDENT";

const tokenName = "attendai_auth";
const secret = process.env.AUTH_SECRET ?? "development-only-secret-change-in-production";

function cookieValue(request: Request, name: string) {
  return request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function createSessionToken(role: WorkspaceRole, name: string) {
  return jwt.sign({ role, name }, secret, { expiresIn: "24h" });
}

export function requireEditor(request: Request): NextResponse | null {
  const token = cookieValue(request, tokenName);
  if (!token) return NextResponse.json({ success: false, error: "Sign in as an Administrator or Faculty member to change records." }, { status: 401 });
  try {
    const payload = jwt.verify(token, secret) as { role?: WorkspaceRole };
    if (payload.role === "ADMIN" || payload.role === "FACULTY") return null;
  } catch {
    // An invalid or expired session is treated as unauthenticated.
  }
  return NextResponse.json({ success: false, error: "Only Administrators and Faculty members can create, edit, or delete records." }, { status: 403 });
}

export const sessionCookie = { name: tokenName, options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 } };
