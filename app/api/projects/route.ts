import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import {
  createProject,
  getProjects,
  projectInputFromRequest
} from "@/lib/projects";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(request: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { input, errors } = await projectInputFromRequest(request);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json(await createProject(input), { status: 201 });
}
