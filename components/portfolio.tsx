"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/project-types";
import {
  Github,
  Linkedin,
  Send,
  Twitter
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 }
};

const navItems = [
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "LOGS", href: "/logs" }
];

const profileLines = [
  <>
    I&apos;m a developer with an interest in both software and hardware, focused
    on building efficient and practical solutions.
  </>,
  <>
    I work with{" "}
    <span className="border-b border-shell-text/[0.70] text-shell-text">
      React and Next.js
    </span>{" "}
    to create modern web applications, while also exploring embedded systems,
    C/C++, RTOS concepts, and hardware fundamentals.
  </>,
  <>
    Interested in clean design, performance, and continuously learning how
    software interacts with real-world systems.
  </>
];

const status = [
  ["Role:", "L3_Software_Student"],
  ["Focus:", "Embedded_IoT"],
  ["Uptime:", "1+ Year Learning"],
  ["Base:", "Gujarat, India"]
];

const contactEmail = "mirajgajera1910@gmail.com";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}`;

function SectionTitle({
  icon,
  label,
  line = false
}: {
  icon?: React.ReactNode;
  label: string;
  line?: boolean;
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex min-w-0 shrink items-center gap-3 font-mono text-[16px] uppercase tracking-[0.18em] text-shell-green sm:text-[22px] sm:tracking-[0.28em]">
        {icon}
        <span className="break-words">{label}</span>
      </div>
      {line ? <div className="h-px flex-1 bg-white/[0.12]" /> : null}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isLogoOpen, setIsLogoOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.12] bg-shell-black/[0.92] backdrop-blur-xl">
      <nav className="content-rail" aria-label="Primary navigation">
        <div className="flex h-[70px] items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="focus-ring relative block size-8 overflow-hidden rounded-full bg-shell-green sm:size-9"
              aria-label="Open profile picture"
              onClick={() => setIsLogoOpen(true)}
            >
              <Image
                src="/uploads/logo.jpeg"
                alt="Miraj Gajera logo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </button>
            <Link href="/" className="focus-ring">
              <span className="font-mono text-lg font-bold tracking-[-0.02em] text-shell-text sm:text-xl">
                MIRAJ GAJERA
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <NavLinks pathname={pathname} />
          </div>
        </div>
        <div className="-mx-3 flex h-[42px] items-center gap-1 overflow-x-auto border-t border-white/[0.08] px-3 md:hidden">
          <NavLinks pathname={pathname} compact />
        </div>
      </nav>
      <AnimatePresence>
        {isLogoOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-shell-black/[0.86] px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Profile picture preview"
            onPointerDown={() => setIsLogoOpen(false)}
          >
            <motion.div
              className="relative size-[min(78vw,430px)] overflow-hidden rounded-full border border-shell-green/[0.35] bg-shell-black shadow-glow"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/uploads/logo.jpeg"
                alt="Miraj Gajera profile picture"
                fill
                sizes="430px"
                className="object-cover"
                priority
              />
              <button
                type="button"
                className="focus-ring absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-white/[0.18] bg-shell-black/[0.78] font-mono text-lg text-shell-text transition hover:border-shell-green hover:text-shell-green"
                aria-label="Close profile picture"
                onClick={() => setIsLogoOpen(false)}
              >
                x
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function NavLinks({
  pathname,
  compact = false
}: {
  pathname: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center ${compact ? "gap-5" : "gap-8"}`}>
      {navItems.map((item) => (
        <motion.div key={item.href} whileTap={{ scale: 0.94 }}>
          <Link
            href={item.href}
            className={`focus-ring whitespace-nowrap font-mono text-xs tracking-[0.32em] transition hover:text-shell-green ${
              pathname === item.href ? "text-shell-green" : "text-shell-muted"
            }`}
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="content-rail pt-[132px] md:pt-[84px]">
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
        className="max-w-[980px] py-0 md:py-2 lg:py-3"
      >
        <motion.h1
          variants={fadeUp}
          className="max-w-[980px] text-[clamp(2rem,11vw,4.72rem)] font-black leading-[0.98] tracking-normal text-shell-text sm:text-[clamp(2rem,5.2vw,4.72rem)]"
        >
          <span className="block sm:whitespace-nowrap">
            Designing <span className="text-shell-green">Efficient</span> Systems
          </span>
          <span className="block sm:whitespace-nowrap">for the Real World</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-2xl text-lg leading-8 tracking-[0.02em] text-shell-muted"
        >
          Web technologies, embedded systems, and performance-focused engineering.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center gap-7"
        >
          <a
            href="/projects"
            className="focus-ring inline-flex h-12 min-w-[204px] items-center justify-center rounded bg-shell-green px-8 font-mono text-base font-bold text-shell-black transition hover:shadow-glow active:scale-[0.98]"
          >
            SEE MY WORK
          </a>
          <div className="flex items-center gap-4 text-shell-muted">
            <a
              className="focus-ring transition hover:text-shell-green active:scale-90"
              href="https://github.com/miraj1910"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={22} />
            </a>
            <a
              className="focus-ring transition hover:text-shell-green active:scale-90"
              href="https://www.linkedin.com/in/miraj-gajera-b25888380?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={22} />
            </a>
            <a
              className="focus-ring transition hover:text-shell-green active:scale-90"
              href="https://x.com/GajeraMira72499"
              aria-label="X"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter size={22} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function SystemProfile() {
  return (
    <section id="about" className="content-rail pt-[150px] md:pt-[124px]">
      <SectionTitle label=">_ SYSTEM_PROFILE" line />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        transition={{ staggerChildren: 0.09 }}
        className="mt-12 grid gap-8 lg:grid-cols-[1fr_389px]"
      >
        <motion.article variants={fadeUp} className="terminal-border min-h-[333px] p-8 sm:p-10">
          <div className="mb-7 flex items-center gap-3">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs uppercase tracking-[0.35em] text-shell-muted">
              ABOUT_ME.SH
            </span>
          </div>
          <div className="space-y-5 font-mono text-[15px] leading-[1.75] text-[#d4d6db] sm:text-base">
            {profileLines.map((line, index) => (
              <p key={index} className="flex gap-2">
                <span className="shrink-0 text-shell-green">&gt;</span>
                <span>{line}</span>
              </p>
            ))}
            <span className="block pt-2 text-shell-green">_</span>
          </div>
        </motion.article>

        <motion.aside variants={fadeUp} className="space-y-4">
          <div className="terminal-border p-6">
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-shell-muted">
              CURRENT_STATUS
            </h2>
            <dl className="space-y-0">
              {status.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-b-0"
                >
                  <dt className="font-mono text-[10px] text-shell-muted">{label}</dt>
                  <dd className="text-right font-mono text-xs font-semibold text-shell-green">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="border border-shell-green/[0.35] bg-shell-green/[0.08] p-6">
            <h2 className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-shell-green">
              CORE_PHILOSOPHY
            </h2>
            <p className="font-mono text-xs italic leading-6 text-[#aeb5bd]">
              &quot;Optimization is not an afterthought; it is the foundation of
              excellence in the hardware world.&quot;
            </p>
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}

export function RepositoryTabs({ projects = [] }: { projects?: Project[] }) {
  return (
    <section id="projects" className="content-rail pt-[150px] md:pt-[122px]">
      <div className="flex items-end gap-10 border-b border-white/[0.12]">
        <h2 className="border-b-2 border-shell-green pb-4 font-mono text-lg font-bold text-shell-text">
          PROJ_REPOSITORY
        </h2>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="dashed-panel mt-12 min-h-[224px] rounded-sm"
      >
        {projects.length > 0 ? (
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="terminal-border overflow-hidden"
              >
                <div className="relative aspect-video border-b border-white/[0.12] bg-shell-black">
                  <Image
                    src={project.images[0]}
                    alt={`${project.title} thumbnail`}
                    fill
                    sizes="(min-width: 1280px) 390px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-mono text-lg font-bold text-shell-text">
                    {project.title}
                  </h2>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-shell-muted">
                    {project.shortDescription}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="focus-ring inline-flex h-9 items-center justify-center rounded bg-shell-green px-4 font-mono text-xs font-bold text-shell-black"
                    >
                      VIEW_PROJECT
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex h-[224px] items-center justify-center">
            <p className="px-4 text-center font-mono text-lg italic tracking-[0.08em] text-shell-muted">
              SYSTEM_MEMORY_EMPTY: NO_REPOS_FOUND
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}

export function ContactCta() {
  return (
    <section id="logs" className="content-rail py-[150px] md:py-[132px]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-160px" }}
        variants={fadeUp}
        className="terminal-border mx-auto flex min-h-[410px] max-w-[1232px] flex-col items-center justify-center bg-gradient-to-r from-shell-panel to-[#101814] px-6 text-center shadow-panel"
      >
        <h2 className="break-words font-mono text-[clamp(1.65rem,8vw,3.1rem)] font-black uppercase leading-tight tracking-[0.02em] text-shell-text sm:text-[clamp(2.35rem,4vw,3.1rem)]">
          INITIATE_TRANSMISSION?
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-shell-muted">
          &quot;Let&apos;s build something that matters. Hardware, software, or something
          in between.&quot;
        </p>
        <a
          href={gmailComposeUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-10 inline-flex h-[52px] min-w-[208px] items-center justify-center gap-2 rounded bg-shell-green px-8 font-mono text-base font-bold text-shell-black shadow-glow transition hover:brightness-110 active:scale-[0.98]"
        >
          <Send size={18} aria-hidden="true" />
          SEND_MESSAGE
        </a>
      </motion.div>
    </section>
  );
}
