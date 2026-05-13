import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getProjects } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found | Miraj Gajera"
    };
  }

  return {
    title: `${project.title} | Miraj Gajera`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.images[0] ? [project.images[0]] : undefined
    }
  };
}

export default async function ProjectDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="content-rail pt-[150px] md:pt-[122px]">
      <div className="flex flex-col gap-6 border-b border-white/[0.12] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-shell-green">
            PROJECT_DETAIL
          </p>
          <h1 className="mt-4 font-mono text-[clamp(2.2rem,5vw,4.3rem)] font-black uppercase leading-tight text-shell-text">
            {project.title}
          </h1>
        </div>
        <Link
          href="/projects"
          className="focus-ring inline-flex h-10 items-center justify-center rounded border border-white/[0.15] px-4 font-mono text-xs font-bold text-shell-text transition hover:border-shell-green hover:text-shell-green"
        >
          BACK_TO_PROJECTS
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article className="terminal-border overflow-hidden">
          <div className="relative aspect-video border-b border-white/[0.12] bg-shell-black">
            <Image
              src={project.images[0]}
              alt={`${project.title} primary screenshot`}
              fill
              priority
              sizes="(min-width: 1024px) 850px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="font-mono text-lg font-bold text-shell-text">
              FULL_DESCRIPTION
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-shell-muted">
              {project.fullDescription}
            </p>
          </div>
        </article>

        <aside className="space-y-5">
          <div className="terminal-border p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-shell-muted">
              TECH_STACK
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((technology) => (
                <span
                  key={technology}
                  className="border border-shell-green/[0.25] bg-shell-green/[0.08] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-shell-green"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="terminal-border p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-shell-muted">
              FEATURES
            </h2>
            {project.features.length ? (
              <ul className="mt-5 space-y-3 font-mono text-sm leading-6 text-shell-muted">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-shell-green">&gt;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 font-mono text-sm italic text-shell-muted">
                NO_FEATURE_LOGS_FOUND
              </p>
            )}
          </div>

          <div className="terminal-border p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-shell-muted">
              LINKS
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex h-10 items-center justify-center rounded bg-shell-green px-4 font-mono text-xs font-bold text-shell-black"
              >
                LIVE_DEMO
              </a>
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex h-10 items-center justify-center rounded border border-white/[0.15] px-4 font-mono text-xs font-bold text-shell-text transition hover:border-shell-green hover:text-shell-green"
                >
                  GITHUB_REPO
                </a>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      {project.images.length > 1 ? (
        <div className="mt-10 dashed-panel p-5">
          <h2 className="mb-5 font-mono text-lg font-bold text-shell-text">
            SCREENSHOTS
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {project.images.slice(1).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-video overflow-hidden border border-white/[0.12] bg-shell-black"
              >
                <Image
                  src={image}
                  alt={`${project.title} screenshot ${index + 2}`}
                  fill
                  sizes="(min-width: 1280px) 390px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
