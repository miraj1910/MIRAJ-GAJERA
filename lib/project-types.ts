export type Project = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  techStack: string[];
  features: string[];
  liveUrl: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  slug?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images?: string[];
  techStack: string[];
  features: string[];
  liveUrl: string;
  githubUrl?: string;
};
