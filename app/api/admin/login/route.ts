import { NextResponse } from "next/server";
import { createSessionCookie, setAdminCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
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
