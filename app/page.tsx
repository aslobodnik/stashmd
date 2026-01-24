"use client";

import { useState } from "react";
import { BeforeAfterComparison } from "./components/BeforeAfterComparison";
import { CodeSimplifierDemo } from "./components/CodeSimplifierDemo";
import { RemotonDemo } from "./components/RemotonDemo";
import { CopyDoctorDemo } from "./components/CopyDoctorDemo";
import { InstallSection } from "./components/InstallSection";
import { SkillCard } from "./components/SkillCard";

type SkillId = "frontend-design" | "code-simplifier" | "remotion" | "copy-doctor";

interface Skill {
  id: SkillId;
  name: string;
  description: string;
  icon: string;
  isOfficial: boolean;
  githubUrl: string;
  repoUrl: string; // For npx skills add command
  installs?: string; // e.g. "12.4k"
}

const SKILLS: Skill[] = [
  {
    id: "frontend-design",
    name: "frontend-design",
    description: "Create distinctive sites.",
    icon: "✦",
    isOfficial: true,
    githubUrl: "https://github.com/anthropics/skills",
    repoUrl: "https://github.com/anthropics/skills",
    installs: "8.2k",
  },
  {
    id: "code-simplifier",
    name: "code-simplifier",
    description: "Less code is better code.",
    icon: "◇",
    isOfficial: true,
    githubUrl: "https://github.com/anthropics/skills",
    repoUrl: "https://github.com/anthropics/skills",
    installs: "5.1k",
  },
  {
    id: "remotion",
    name: "remotion",
    description: "Motion moves people.",
    icon: "▶",
    isOfficial: false,
    githubUrl: "https://github.com/remotion-dev/skills",
    repoUrl: "https://github.com/remotion-dev/skills",
    installs: "2.3k",
  },
  {
    id: "copy-doctor",
    name: "copy-doctor",
    description: "Words that sell.",
    icon: "✂",
    isOfficial: false,
    githubUrl: "https://github.com/slobo/skills",
    repoUrl: "https://github.com/slobo/skills",
    installs: "1.2k",
  },
];

export default function Home() {
  const [activeSkill, setActiveSkill] = useState<SkillId>("frontend-design");
  const currentSkill = SKILLS.find((s) => s.id === activeSkill)!;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dramatic background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(var(--border-subtle) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial gradient from top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px]"
          style={{
            background: "radial-gradient(ellipse at center top, rgba(251,191,36,0.07) 0%, transparent 60%)",
          }}
        />
        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--accent-gold) 50%, transparent 100%)",
            opacity: 0.3,
          }}
        />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1
            className="text-5xl md:text-7xl mb-8 leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            AI skills that{" "}
            <span
              className="italic inline-block pb-1"
              style={{
                background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              prove themselves
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Demo first. Install second.
          </p>
        </header>

        {/* Skill Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {SKILLS.map((skill) => (
              <SkillCard
                key={skill.id}
                id={skill.id}
                name={skill.name}
                description={skill.description}
                icon={skill.icon}
                isOfficial={skill.isOfficial}
                isActive={activeSkill === skill.id}
                onClick={() => setActiveSkill(skill.id)}
              />
            ))}
          </div>
        </section>

        {/* Featured Skill Demo */}
        <section className="mb-20">
          <div className="relative">
            {/* Card border gradient */}
            <div
              className="relative p-px rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--border) 0%, var(--border-subtle) 50%, var(--border) 100%)",
              }}
            >
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ background: "var(--bg-surface)" }}
              >
                {/* Skill header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{
                          background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
                          color: "var(--bg-deep)",
                        }}
                      >
                        {currentSkill.icon}
                      </div>
                      <div>
                        <h2
                          className="text-2xl md:text-3xl"
                          style={{ fontFamily: "var(--font-display), serif" }}
                        >
                          {currentSkill.name}
                        </h2>
                      </div>
                    </div>
                    <p
                      className="text-lg"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {currentSkill.description}
                    </p>
                  </div>

                  {currentSkill.isOfficial && (
                    <div
                      className="hidden md:flex items-center justify-center w-8 h-8 rounded-full"
                      style={{
                        background: "rgba(204, 120, 92, 0.1)",
                        border: "1px solid rgba(204, 120, 92, 0.3)",
                      }}
                      title="Anthropic Official"
                    >
                      <svg width="14" height="14" viewBox="0 0 256 176" fill="#cc785c">
                        <path d="M153.1 0h46.2L256 175.6h-46.2L153.1 0ZM56.7 0 0 175.6h47.3l11.6-31.4h59.2l11.5 31.4h47.3L120.2 0H56.7Zm7.2 108.3 21.5-58.6 21.5 58.6H63.9Z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Demo - conditionally rendered based on active skill */}
                {activeSkill === "frontend-design" && (
                  <BeforeAfterComparison
                    beforeSrc="/demos/frontend-design/before.html"
                    afterSrc="/demos/frontend-design/after.html"
                    beforeLabel="Without skill"
                    afterLabel="With skill"
                    prompt="Create a personal website for Benjamin Franklin based on his Wikipedia page"
                    promptWithSkill="Create a personal website for Benjamin Franklin based on his Wikipedia page using the frontend-design skill"
                  />
                )}

                {activeSkill === "code-simplifier" && (
                  <CodeSimplifierDemo />
                )}

                {activeSkill === "remotion" && (
                  <RemotonDemo />
                )}

                {activeSkill === "copy-doctor" && (
                  <CopyDoctorDemo />
                )}

                {/* Install section */}
                <InstallSection
                  skillName={currentSkill.name}
                  repoUrl={currentSkill.repoUrl}
                />

                {/* Social proof footer */}
                <div
                  className="mt-6 pt-6 flex items-center justify-center gap-6 text-xs"
                  style={{ borderTop: "1px solid var(--border-subtle)" }}
                >
                  {currentSkill.installs && (
                    <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{currentSkill.installs} installs</span>
                    </div>
                  )}
                  <a
                    href={currentSkill.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-[var(--text-secondary)]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>View source</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More skills coming */}
        <section className="text-center mb-20">
          <p style={{ color: "var(--text-muted)" }}>
            More skills coming soon —{" "}
            <a
              href="#"
              className="underline transition-colors hover:text-[var(--text-secondary)]"
            >
              submit yours
            </a>
          </p>
        </section>

        {/* Footer */}
        <footer
          className="pt-8 flex items-center justify-center gap-2 text-sm"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          <span style={{ color: "var(--accent-gold)" }}>&#10022;</span>
          <span>stashmd</span>
        </footer>
      </main>
    </div>
  );
}
