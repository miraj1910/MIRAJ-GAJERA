import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Project, ProjectInput } from "@/lib/project-types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "projects.json");
const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }
}

export async function getProjects(): Promise<Project[]> {
  await ensureStorage();
  const raw = await fs.readFile(dataFile, "utf8");
  const projects = (JSON.parse(raw) as unknown[]).map(normalizeProject);

  return projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
}

async function writeProjects(projects: Project[]) {
  await ensureStorage();
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2), "utf8");
}

export function validateProjectInput(input: ProjectInput) {
  const errors: Record<string, string> = {};

  if (!input.title.trim()) errors.title = "Title is required.";
  if (!input.shortDescription.trim()) errors.shortDescription = "Short description is required.";
  if (!input.fullDescription.trim()) errors.fullDescription = "Full description is required.";
  if (!input.techStack.length) errors.techStack = "Add at least one technology.";
  if (!isValidUrl(input.liveUrl)) errors.liveUrl = "Live URL must be valid.";
  if (input.githubUrl && !isValidUrl(input.githubUrl)) {
    errors.githubUrl = "GitHub URL must be valid.";
  }
  if (input.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens.";
  }

  return errors;
}

export async function saveUploadedImages(files: File[]): Promise<string[]> {
  const uploads = await Promise.all(files.map((file) => saveUploadedImage(file)));
  return uploads.filter(Boolean) as string[];
}

async function saveUploadedImage(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, or GIF images are allowed.");
  }

  await ensureStorage();
  const extension = getExtension(file.name, file.type);
  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(uploadDir, fileName), bytes);
  return `/uploads/projects/${fileName}`;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const projects = await getProjects();
  const now = new Date().toISOString();
  const slug = uniqueSlug(input.slug || slugify(input.title), projects);
  const project: Project = {
    id: crypto.randomUUID(),
    slug,
    title: input.title,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    images: input.images?.length ? input.images : ["/uploads/projects/placeholder.svg"],
    techStack: input.techStack,
    features: input.features,
    liveUrl: input.liveUrl,
    githubUrl: input.githubUrl,
    createdAt: now,
    updatedAt: now
  };

  await writeProjects([project, ...projects]);
  return project;
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return null;
  const otherProjects = projects.filter((project) => project.id !== id);

  const updated: Project = {
    ...projects[index],
    slug: uniqueSlug(input.slug || slugify(input.title), otherProjects),
    title: input.title,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    images: input.images?.length
      ? [...projects[index].images, ...input.images]
      : projects[index].images,
    techStack: input.techStack,
    features: input.features,
    liveUrl: input.liveUrl,
    githubUrl: input.githubUrl,
    updatedAt: new Date().toISOString()
  };

  projects[index] = updated;
  await writeProjects(projects);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const nextProjects = projects.filter((project) => project.id !== id);
  if (nextProjects.length === projects.length) return false;

  await writeProjects(nextProjects);
  return true;
}

export function projectInputFromForm(formData: FormData, images?: string[]): ProjectInput {
  const techStack = String(formData.get("techStack") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const features = String(formData.get("features") || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    slug: String(formData.get("slug") || "").trim() || undefined,
    title: String(formData.get("title") || "").trim(),
    shortDescription: String(formData.get("shortDescription") || "").trim(),
    fullDescription: String(formData.get("fullDescription") || "").trim(),
    images,
    techStack,
    features,
    liveUrl: String(formData.get("liveUrl") || "").trim(),
    githubUrl: String(formData.get("githubUrl") || "").trim() || undefined
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getExtension(fileName: string, mimeType: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return extension;
  }

  return mimeType.split("/")[1] || "png";
}

function uniqueSlug(slug: string, projects: Project[]) {
  const base = slugify(slug);
  let candidate = base;
  let count = 2;

  while (projects.some((project) => project.slug === candidate)) {
    candidate = `${base}-${count}`;
    count += 1;
  }

  return candidate;
}

function normalizeProject(project: any): Project {
  const title = String(project.title || "Untitled Project");
  const firstImage = project.imageUrl || project.images?.[0] || "/uploads/projects/placeholder.svg";
  const createdAt = project.createdAt || new Date().toISOString();
  const updatedAt = project.updatedAt || createdAt;

  return {
    id: String(project.id || crypto.randomUUID()),
    slug: String(project.slug || slugify(title)),
    title,
    shortDescription: String(project.shortDescription || project.description || ""),
    fullDescription: String(project.fullDescription || project.description || ""),
    images: Array.isArray(project.images) && project.images.length ? project.images : [firstImage],
    techStack: Array.isArray(project.techStack) ? project.techStack : project.technologies || [],
    features: Array.isArray(project.features) ? project.features : [],
    liveUrl: String(project.liveUrl || ""),
    githubUrl: project.githubUrl || undefined,
    createdAt,
    updatedAt
  };
}
