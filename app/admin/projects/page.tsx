import { redirect } from "next/navigation";
import { AdminProjectManager } from "@/components/admin-project-manager";
import { isAdminRequest } from "@/lib/auth";
import { getProjects } from "@/lib/projects";

export default async function AdminProjectsPage() {
  if (!isAdminRequest()) {
    redirect("/admin/login");
  }

  const projects = await getProjects();

  return <AdminProjectManager initialProjects={projects} />;
}
