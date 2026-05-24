import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import {
  deleteProject,
  projectInputFromRequest,
  updateProject
} from "@/lib/projects";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { input, errors } = await projectInputFromRequest(request);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const project = await updateProject(params.id, input);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const deleted = await deleteProject(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
