import { RepositoryTabs } from "@/components/portfolio";
import { getProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <RepositoryTabs projects={projects} />;
}
