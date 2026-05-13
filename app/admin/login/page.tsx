import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminRequest } from "@/lib/auth";

export default function AdminLoginPage() {
  if (isAdminRequest()) {
    redirect("/admin/projects");
  }

  return <AdminLoginForm />;
}
