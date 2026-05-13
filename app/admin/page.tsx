import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminProjectManager } from "@/components/admin-project-manager";
import { isAdminRequest } from "@/lib/auth";
import { getProjects } from "@/lib/projects";

export default async function AdminPage() {
  if (!isAdminRequest()) {
    return <AdminLoginForm />;
  }

  const projects = await getProjects();
  return <AdminProjectManager initialProjects={projects} />;
}
