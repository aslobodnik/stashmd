"use client";

import { useState } from "react";

interface InstallSectionProps {
  skillName: string;
  repoUrl: string;
}

export function InstallSection({ skillName, repoUrl }: InstallSectionProps) {
  const [copied, setCopied] = useState(false);

  const command = `npx skills add ${repoUrl} --skill ${skillName}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="mt-10 rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-deep)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Content */}
      <div className="p-6">
        {/* Command box */}
        <div
          className="relative group rounded-xl p-4 transition-all duration-300"
          style={{
            background: "var(--bg-surface)",
            border: `1px solid ${copied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
            boxShadow: copied ? "0 0 20px var(--glow-gold)" : "none",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <code className="flex-1 text-xs md:text-sm flex flex-wrap items-center gap-1.5 overflow-x-auto">
              <span style={{ color: "var(--accent-gold)" }}>$</span>
              <span style={{ color: "var(--text-muted)" }}>npx</span>
              <span style={{ color: "var(--text-muted)" }}>skills</span>
              <span style={{ color: "var(--text-muted)" }}>add</span>
              <span style={{ color: "var(--text-secondary)" }}>{repoUrl}</span>
              <span style={{ color: "var(--text-muted)" }}>--skill</span>
              <span
                className="px-2 py-0.5 rounded"
                style={{
                  background: "var(--glow-gold)",
                  color: "var(--accent-gold)",
                  fontWeight: 600,
                }}
              >
                {skillName}
              </span>
            </code>

            <button
              onClick={handleCopy}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shrink-0 cursor-pointer"
              style={{
                background: copied
                  ? "var(--accent-gold)"
                  : "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
                color: "var(--bg-deep)",
                boxShadow: "0 2px 10px var(--glow-gold)",
              }}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Success animation */}
          {copied && (
            <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background: "radial-gradient(circle at center, var(--glow-gold) 0%, transparent 70%)",
                  opacity: 0.3,
                }}
              />
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 pt-5 mt-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <Step number={1} text="Copy command" done={copied} />
          <Connector />
          <Step number={2} text="Paste in terminal" />
          <Connector />
          <Step number={3} text="Start using" />
        </div>
      </div>
    </div>
  );
}

function Step({ number, text, done }: { number: number; text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
        style={{
          background: done ? "var(--accent-gold)" : "var(--bg-elevated)",
          color: done ? "var(--bg-deep)" : "var(--text-muted)",
          border: done ? "none" : "1px solid var(--border-subtle)",
        }}
      >
        {done ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span
        className="text-xs transition-colors duration-300"
        style={{ color: done ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        {text}
      </span>
    </div>
  );
}

function Connector() {
  return (
    <div
      className="flex-1 h-px max-w-[40px]"
      style={{ background: "var(--border-subtle)" }}
    />
  );
}
