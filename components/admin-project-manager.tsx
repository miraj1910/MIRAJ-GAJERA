"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/project-types";

type FormState = {
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string;
  features: string;
  liveUrl: string;
  githubUrl: string;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  shortDescription: "",
  fullDescription: "",
  techStack: "",
  features: "",
  liveUrl: "",
  githubUrl: ""
};

export function AdminProjectManager({
  initialProjects
}: {
  initialProjects: Project[];
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(form.id);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === form.id),
    [projects, form.id]
  );

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editProject(project: Project) {
    setForm({
      id: project.id,
      slug: project.slug,
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      techStack: project.techStack.join(", "),
      features: project.features.join("\n"),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl || ""
    });
    setImages([]);
    setMessage("");
  }

  function resetForm() {
    setForm(emptyForm);
    setImages([]);
    setMessage("");
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const formData = new FormData();
    formData.set("slug", form.slug);
    formData.set("title", form.title);
    formData.set("shortDescription", form.shortDescription);
    formData.set("fullDescription", form.fullDescription);
    formData.set("techStack", form.techStack);
    formData.set("features", form.features);
    formData.set("liveUrl", form.liveUrl);
    formData.set("githubUrl", form.githubUrl);
    images.forEach((image) => formData.append("images", image));

    const response = await fetch(isEditing ? `/api/projects/${form.id}` : "/api/projects", {
      method: isEditing ? "PUT" : "POST",
      body: formData
    });

    if (!response.ok) {
      const body = await response.json();
      setMessage(body.error || Object.values(body.errors || {}).join(" ") || "Save failed.");
      setIsSaving(false);
      return;
    }

    const saved = (await response.json()) as Project;
    setProjects((current) =>
      isEditing
        ? current.map((project) => (project.id === saved.id ? saved : project))
        : [saved, ...current]
    );
    resetForm();
    setMessage("PROJECT_RECORD_SAVED");
    setIsSaving(false);
    router.refresh();
  }

  async function removeProject(projectId: string) {
    const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("DELETE_FAILED");
      return;
    }

    setProjects((current) => current.filter((project) => project.id !== projectId));
    if (form.id === projectId) resetForm();
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <section className="content-rail pt-[150px] md:pt-[122px]">
      <div className="flex flex-col gap-6 border-b border-white/[0.12] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-shell-text">
            PROJECT_ADMIN
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-shell-muted">
            MANAGE_DYNAMIC_PROJECT_RECORDS
          </p>
        </div>
        <button
          className="focus-ring h-10 rounded border border-white/[0.15] px-4 font-mono text-xs text-shell-text transition hover:border-shell-green hover:text-shell-green"
          type="button"
          onClick={logout}
        >
          LOG_OUT
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[430px_1fr]">
        <form className="terminal-border p-6" onSubmit={saveProject}>
          <h2 className="font-mono text-lg font-bold text-shell-text">
            {isEditing ? "EDIT_PROJECT" : "ADD_PROJECT"}
          </h2>
          <div className="mt-6 grid gap-4">
            <AdminInput label="Title" value={form.title} onChange={(value) => updateField("title", value)} />
            <AdminInput label="Slug" value={form.slug} onChange={(value) => updateField("slug", value)} placeholder="portfolio-website" required={false} />
            <AdminTextarea label="Short Description" value={form.shortDescription} onChange={(value) => updateField("shortDescription", value)} />
            <AdminTextarea label="Full Description" value={form.fullDescription} onChange={(value) => updateField("fullDescription", value)} />
            <AdminInput label="Tech Stack" value={form.techStack} onChange={(value) => updateField("techStack", value)} placeholder="React, Next.js, RTOS" />
            <AdminTextarea label="Features" value={form.features} onChange={(value) => updateField("features", value)} required={false} placeholder="One feature per line" />
            <AdminInput label="Live URL" value={form.liveUrl} onChange={(value) => updateField("liveUrl", value)} placeholder="https://example.com" />
            <AdminInput label="GitHub URL" value={form.githubUrl} onChange={(value) => updateField("githubUrl", value)} placeholder="https://github.com/..." required={false} />
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-shell-muted">
                Project Images
              </span>
              <input
                className="mt-2 w-full border border-white/[0.12] bg-shell-black p-3 font-mono text-xs text-shell-muted file:mr-4 file:rounded file:border-0 file:bg-shell-green file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:text-shell-black"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                onChange={(event) => setImages(Array.from(event.target.files || []))}
              />
            </label>
            {activeProject ? (
              <div className="relative aspect-video overflow-hidden border border-white/[0.12]">
                <Image
                  src={activeProject.images[0]}
                  alt={`${activeProject.title} current thumbnail`}
                  fill
                  className="object-cover"
                  sizes="430px"
                />
              </div>
            ) : null}
          </div>

          {message ? (
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-shell-green">
              {message}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="focus-ring h-11 rounded bg-shell-green px-5 font-mono text-sm font-bold text-shell-black"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "SAVE_PROJECT"}
            </button>
            {isEditing ? (
              <button
                className="focus-ring h-11 rounded border border-white/[0.15] px-5 font-mono text-sm font-bold text-shell-text"
                type="button"
                onClick={resetForm}
              >
                CANCEL
              </button>
            ) : null}
          </div>
        </form>

        <div className="dashed-panel min-h-[420px] p-5">
          {projects.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id} className="terminal-border overflow-hidden">
                  <div className="relative aspect-video border-b border-white/[0.12]">
                    <Image
                      src={project.images[0]}
                      alt={`${project.title} thumbnail`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 360px, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-mono text-base font-bold text-shell-text">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-shell-muted">
                      {project.shortDescription}
                    </p>
                    <div className="mt-5 flex gap-3">
                      <button
                        className="focus-ring h-9 rounded bg-shell-green px-4 font-mono text-xs font-bold text-shell-black"
                        type="button"
                        onClick={() => editProject(project)}
                      >
                        EDIT
                      </button>
                      <button
                        className="focus-ring h-9 rounded border border-white/[0.15] px-4 font-mono text-xs font-bold text-shell-text transition hover:border-shell-green hover:text-shell-green"
                        type="button"
                        onClick={() => removeProject(project.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center">
              <p className="font-mono text-lg italic tracking-[0.08em] text-shell-muted">
                SYSTEM_MEMORY_EMPTY: NO_REPOS_FOUND
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  required = true
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-shell-muted">
        {label}
      </span>
      <input
        className="mt-2 h-11 w-full border border-white/[0.12] bg-shell-black px-3 font-mono text-sm text-shell-text outline-none focus:border-shell-green"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = true
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-shell-muted">
        {label}
      </span>
      <textarea
        className="mt-2 min-h-28 w-full resize-y border border-white/[0.12] bg-shell-black p-3 font-mono text-sm text-shell-text outline-none focus:border-shell-green"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}
