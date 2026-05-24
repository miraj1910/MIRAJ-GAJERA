import { NextResponse } from "next/server";
import {
  createSessionCookie,
  getAdminConfigError,
  setAdminCookie,
  verifyPassword
} from "@/lib/auth";

export async function POST(request: Request) {
  const configError = getAdminConfigError();
  if (process.env.NODE_ENV === "production" && configError) {
    return NextResponse.json(
      { error: "Admin login is not configured on this deployment." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/admin/projects", request.url), {
    status: 303
  });
  setAdminCookie(response, createSessionCookie());
  return response;
}
