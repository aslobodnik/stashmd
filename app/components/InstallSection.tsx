"use client";

import { useState } from "react";

interface InstallSectionProps {
  skillName: string;
  installType: "npx" | "local";
  repoUrl?: string;
  rawFileUrl?: string;
}

export function InstallSection({ skillName, installType, repoUrl, rawFileUrl }: InstallSectionProps) {
  const [copied, setCopied] = useState(false);

  const command = repoUrl ? `npx skills add ${repoUrl} --skill ${skillName}` : "";
  const localPath = `~/.claude/skills/${skillName}.md`;

  const handleCopy = async () => {
    if (installType === "npx") {
      await navigator.clipboard.writeText(command);
    } else {
      await navigator.clipboard.writeText(localPath);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (installType === "local") {
    return (
      <div
        className="mt-10 rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-deep)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="p-6">
          {/* Local install instructions */}
          <div
            className="relative group rounded-xl p-4 transition-all duration-300"
            style={{
              background: "var(--bg-surface)",
              border: `1px solid ${copied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
              boxShadow: copied ? "0 0 20px var(--glow-gold)" : "none",
            }}
          >
            <div className="flex flex-col gap-4">
              {/* Path display */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    Save to:
                  </p>
                  <code className="text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                    <span style={{ color: "var(--text-secondary)" }}>~/.claude/skills/</span>
                    <span
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: "var(--glow-gold)",
                        color: "var(--accent-gold)",
                        fontWeight: 600,
                      }}
                    >
                      {skillName}.md
                    </span>
                  </code>
                </div>
                <button
                  onClick={handleCopy}
                  className="relative flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shrink-0 cursor-pointer"
                  style={{
                    background: copied ? "var(--accent-gold)" : "var(--bg-elevated)",
                    color: copied ? "var(--bg-deep)" : "var(--text-muted)",
                    border: copied ? "none" : "1px solid var(--border-subtle)",
                  }}
                >
                  {copied ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy path
                    </>
                  )}
                </button>
              </div>

              {/* Download button */}
              <a
                href={rawFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer w-full"
                style={{
                  background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
                  color: "var(--bg-deep)",
                  boxShadow: "0 2px 10px var(--glow-gold)",
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download skill file
              </a>
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
          <div className="flex items-center justify-between sm:justify-start sm:gap-4 pt-5 mt-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <Step number={1} text="Download" fullText="Download file" />
            <Connector />
            <Step number={2} text="Save" fullText="Save to path" />
            <Connector />
            <Step number={3} text="Use" fullText="Start using" />
          </div>
        </div>
      </div>
    );
  }

  // NPX install type
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <code className="flex-1 text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
              <span style={{ color: "var(--accent-gold)" }}>$</span>
              <span style={{ color: "var(--text-muted)" }}>npx</span>
              <span style={{ color: "var(--text-muted)" }}>skills</span>
              <span style={{ color: "var(--text-muted)" }}>add</span>
              <span className="break-all" style={{ color: "var(--text-secondary)" }}>{repoUrl}</span>
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
              className="relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shrink-0 cursor-pointer w-full sm:w-auto"
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
        <div className="flex items-center justify-between sm:justify-start sm:gap-4 pt-5 mt-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <Step number={1} text="Copy" fullText="Copy command" done={copied} />
          <Connector />
          <Step number={2} text="Paste" fullText="Paste in terminal" />
          <Connector />
          <Step number={3} text="Use" fullText="Start using" />
        </div>
      </div>
    </div>
  );
}

function Step({ number, text, fullText, done }: { number: number; text: string; fullText?: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shrink-0"
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
        <span className="sm:hidden">{text}</span>
        <span className="hidden sm:inline">{fullText || text}</span>
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
