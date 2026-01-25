"use client";

import { useState } from "react";

interface InstallSectionProps {
  skillName: string;
  installType: "plugin" | "npx" | "marketplace";
  pluginCommand?: string;
  npxRepo?: string;
  marketplaceRepo?: string;
}

export function InstallSection({
  skillName,
  installType,
  pluginCommand,
  npxRepo,
  marketplaceRepo,
}: InstallSectionProps) {
  const [copied, setCopied] = useState(false);
  const [copiedStep, setCopiedStep] = useState<1 | 2 | null>(null);

  const getCommand = () => {
    if (installType === "plugin" && pluginCommand) {
      return pluginCommand;
    }
    if (installType === "npx" && npxRepo) {
      return `npx skills add ${npxRepo}`;
    }
    return "";
  };

  const command = getCommand();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Marketplace install (stash.md hosted)
  if (installType === "marketplace" && marketplaceRepo) {
    const marketplaceCommand = `/plugin marketplace add ${marketplaceRepo}`;
    const installCommand = `/plugin install ${skillName}`;

    const handleCopyMarketplace = async (step: 1 | 2) => {
      const cmd = step === 1 ? marketplaceCommand : installCommand;
      await navigator.clipboard.writeText(cmd);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
    };

    return (
      <div className="mt-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Install from stash.md
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Add our marketplace, then install the plugin
            </p>
          </div>
        </div>

        {/* Terminal card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--bg-deep)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "var(--bg-surface)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
              Claude Code
            </span>
          </div>

          {/* Step 1 */}
          <div
            className="p-4 transition-all duration-300"
            style={{
              borderBottom: "1px solid var(--border-subtle)",
              background: copiedStep === 1 ? "rgba(16, 185, 129, 0.05)" : "transparent",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: copiedStep === 1 ? "#10b981" : "var(--bg-elevated)",
                  color: copiedStep === 1 ? "white" : "var(--text-muted)",
                  border: copiedStep === 1 ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                {copiedStep === 1 ? "✓" : "1"}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Add marketplace (one time)
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <code className="flex-1 text-sm flex items-center gap-1">
                <span style={{ color: "#10b981", fontWeight: 600 }}>/</span>
                <span style={{ color: "var(--text-secondary)" }}>plugin marketplace add</span>
                <span
                  className="ml-1 px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontWeight: 600,
                  }}
                >
                  {marketplaceRepo}
                </span>
              </code>
              <button
                onClick={() => handleCopyMarketplace(1)}
                className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: copiedStep === 1 ? "#10b981" : "var(--bg-elevated)",
                  color: copiedStep === 1 ? "white" : "var(--text-muted)",
                  border: copiedStep === 1 ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                {copiedStep === 1 ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="p-4 transition-all duration-300"
            style={{
              background: copiedStep === 2 ? "rgba(16, 185, 129, 0.05)" : "transparent",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: copiedStep === 2 ? "#10b981" : "var(--bg-elevated)",
                  color: copiedStep === 2 ? "white" : "var(--text-muted)",
                  border: copiedStep === 2 ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                {copiedStep === 2 ? "✓" : "2"}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Install the plugin
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <code className="flex-1 text-sm flex items-center gap-1">
                <span style={{ color: "#10b981", fontWeight: 600 }}>/</span>
                <span style={{ color: "var(--text-secondary)" }}>plugin install</span>
                <span
                  className="ml-1 px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontWeight: 600,
                  }}
                >
                  {skillName}
                </span>
              </code>
              <button
                onClick={() => handleCopyMarketplace(2)}
                className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: copiedStep === 2 ? "#10b981" : "var(--bg-elevated)",
                  color: copiedStep === 2 ? "white" : "var(--text-muted)",
                  border: copiedStep === 2 ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                {copiedStep === 2 ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Hint */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{
              background: "rgba(16, 185, 129, 0.05)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#10b981" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Step 1 only needed once — then install any stash.md plugin
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Plugin install (Claude Code official)
  if (installType === "plugin") {
    return (
      <div className="mt-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Install in Claude Code
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Run this command in any Claude Code session
            </p>
          </div>
        </div>

        {/* Terminal card */}
        <div
          className="rounded-xl overflow-hidden transition-all duration-300"
          style={{
            background: "var(--bg-deep)",
            border: `1px solid ${copied ? "#a855f7" : "var(--border-subtle)"}`,
            boxShadow: copied ? "0 0 30px rgba(168, 85, 247, 0.3)" : "none",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "var(--bg-surface)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
              Claude Code
            </span>
          </div>

          {/* Command */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <code className="flex-1 text-sm flex items-center gap-1">
                <span style={{ color: "#a855f7", fontWeight: 600 }}>/</span>
                <span style={{ color: "var(--text-secondary)" }}>plugin install</span>
                <span
                  className="ml-1 px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(168, 85, 247, 0.15)",
                    color: "#a855f7",
                    fontWeight: 600,
                  }}
                >
                  {skillName}
                </span>
              </code>

              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: copied
                    ? "#a855f7"
                    : "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(168, 85, 247, 0.3)",
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
          </div>

          {/* Hint */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{
              background: "rgba(168, 85, 247, 0.05)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#a855f7" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Official plugin — works globally across all your projects
            </span>
          </div>
        </div>
      </div>
    );
  }

  // NPX install (skills.sh)
  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="var(--bg-deep)" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Install via skills.sh
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Run in your terminal, works with any AI agent
          </p>
        </div>
      </div>

      {/* Terminal card */}
      <div
        className="rounded-xl overflow-hidden transition-all duration-300"
        style={{
          background: "var(--bg-deep)",
          border: `1px solid ${copied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
          boxShadow: copied ? "0 0 30px var(--glow-gold)" : "none",
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            Terminal
          </span>
        </div>

        {/* Command */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <code className="flex-1 text-sm flex items-center gap-1.5 flex-wrap">
              <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>$</span>
              <span style={{ color: "var(--text-muted)" }}>npx skills add</span>
              <span
                className="px-2 py-0.5 rounded"
                style={{
                  background: "var(--glow-gold)",
                  color: "var(--accent-gold)",
                  fontWeight: 600,
                }}
              >
                {npxRepo}
              </span>
            </code>

            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              style={{
                background: copied
                  ? "var(--accent-gold)"
                  : "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
                color: "var(--bg-deep)",
                boxShadow: "0 4px 20px var(--glow-gold)",
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
        </div>

        {/* Hint */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{
            background: "rgba(251, 191, 36, 0.05)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="var(--accent-gold)" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Compatible with Claude Code, Cursor, Cline, and more
          </span>
        </div>
      </div>
    </div>
  );
}
