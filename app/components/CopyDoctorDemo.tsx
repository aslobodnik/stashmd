"use client";

import { useState, useRef } from "react";

interface CopyTransform {
  before: string;
  after: string;
}

const TRANSFORMS: CopyTransform[] = [
  {
    before: "See the difference before you install. Every skill demos its own transformation.",
    after: "Demo first. Install second.",
  },
  {
    before: "Refine code for clarity and maintainability without changing behavior.",
    after: "Less code is better code.",
  },
  {
    before: "Best practices for video creation in React. Avoid common pitfalls.",
    after: "Motion moves people.",
  },
];

type LineState = "pending" | "highlighting" | "striking" | "replacing" | "complete";

// Calculate word counts
const BEFORE_WORDS = TRANSFORMS.reduce((sum, t) => sum + t.before.split(/\s+/).length, 0);
const AFTER_WORDS = TRANSFORMS.reduce((sum, t) => sum + t.after.split(/\s+/).length, 0);
const REDUCTION = Math.round((1 - AFTER_WORDS / BEFORE_WORDS) * 100);

export function CopyDoctorDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lineStates, setLineStates] = useState<LineState[]>(
    TRANSFORMS.map(() => "pending")
  );
  const [strikeProgress, setStrikeProgress] = useState<number[]>(
    TRANSFORMS.map(() => 0)
  );
  const animationRef = useRef<number | null>(null);

  const handleApply = () => {
    if (isApplied) {
      // Reset
      setIsApplied(false);
      setLineStates(TRANSFORMS.map(() => "pending"));
      setStrikeProgress(TRANSFORMS.map(() => 0));
      return;
    }

    setIsAnimating(true);

    const PHASE_DURATION = {
      highlight: 300,
      strike: 500,
      replace: 400,
      pause: 300,
    };
    const LINE_TOTAL = PHASE_DURATION.highlight + PHASE_DURATION.strike + PHASE_DURATION.replace + PHASE_DURATION.pause;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      // Determine which line we're on and its phase
      const newStates: LineState[] = TRANSFORMS.map((_, idx) => {
        const lineStart = idx * LINE_TOTAL;
        const lineElapsed = elapsed - lineStart;

        if (lineElapsed < 0) return "pending";
        if (lineElapsed < PHASE_DURATION.highlight) return "highlighting";
        if (lineElapsed < PHASE_DURATION.highlight + PHASE_DURATION.strike) return "striking";
        if (lineElapsed < PHASE_DURATION.highlight + PHASE_DURATION.strike + PHASE_DURATION.replace) return "replacing";
        return "complete";
      });

      setLineStates(newStates);

      // Calculate strike-through progress for each line
      const newStrikeProgress = TRANSFORMS.map((_, idx) => {
        const lineStart = idx * LINE_TOTAL;
        const lineElapsed = elapsed - lineStart;
        const strikeStart = PHASE_DURATION.highlight;
        const strikeEnd = strikeStart + PHASE_DURATION.strike;

        if (lineElapsed < strikeStart) return 0;
        if (lineElapsed > strikeEnd) return 1;
        return (lineElapsed - strikeStart) / PHASE_DURATION.strike;
      });

      setStrikeProgress(newStrikeProgress);

      const totalDuration = TRANSFORMS.length * LINE_TOTAL;
      if (elapsed < totalDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setIsApplied(true);
        setLineStates(TRANSFORMS.map(() => "complete"));
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="w-full">
      {/* Terminal prompt */}
      <div
        className="mb-6 rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-deep)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            copy-doctor
          </span>
        </div>

        <div className="p-4 text-sm">
          <div className="flex items-start gap-2">
            <span style={{ color: "var(--accent-gold)" }}>❯</span>
            <p style={{ color: "var(--text-primary)" }}>
              Review this landing page copy
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: isApplied ? "var(--glow-gold)" : "var(--bg-elevated)",
              border: `1px solid ${isApplied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
            }}
          >
            {isApplied ? (
              <svg className="w-4 h-4" fill="none" stroke="var(--accent-gold)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--text-muted)" }} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {isApplied ? "Copy refined" : "Before refinement"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {isApplied ? "Punchy and memorable" : `${BEFORE_WORDS} words across ${TRANSFORMS.length} headlines`}
            </p>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={isAnimating}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer"
          style={{
            background: isApplied
              ? "transparent"
              : "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
            color: isApplied ? "var(--text-muted)" : "var(--bg-deep)",
            border: isApplied ? "1px solid var(--border)" : "none",
            boxShadow: isApplied ? "none" : "0 4px 24px var(--glow-gold)",
            opacity: isAnimating ? 0.7 : 1,
            cursor: isAnimating ? "not-allowed" : "pointer",
          }}
        >
          {!isApplied && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                animation: "shimmer 2s infinite",
              }}
            />
          )}
          {isApplied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try again</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Try it</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Copy viewport */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-700 ease-out"
        style={{
          background: "var(--bg-deep)",
          border: `1px solid ${isApplied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
          boxShadow: isApplied ? "0 0 30px var(--glow-gold)" : "none",
        }}
      >
        <div className="p-6 space-y-6">
          {TRANSFORMS.map((transform, idx) => {
            const state = lineStates[idx];
            const isComplete = state === "complete";

            return (
              <div key={idx} className="relative">
                {/* After text - shown above when complete */}
                <div
                  className="text-lg font-medium mb-2 transition-all duration-500"
                  style={{
                    color: isComplete ? "var(--accent-gold)" : "transparent",
                    textShadow: isComplete ? "0 0 20px var(--glow-gold)" : "none",
                    opacity: isComplete ? 1 : 0,
                    transform: isComplete ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  {transform.after}
                </div>

                {/* Before text - in quotes, muted, line-through when complete */}
                <p
                  className="text-sm transition-all duration-500"
                  style={{
                    color: "var(--text-muted)",
                    textDecoration: isComplete ? "line-through" : "none",
                    opacity: isComplete ? 0.5 : 0.8,
                  }}
                >
                  &ldquo;{transform.before}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="mt-4 flex items-center justify-center gap-6 py-3 rounded-xl transition-all duration-500"
        style={{
          background: isApplied ? "var(--bg-surface)" : "transparent",
          border: isApplied ? "1px solid var(--border-subtle)" : "1px solid transparent",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold tabular-nums transition-colors duration-300"
            style={{ color: isApplied ? "var(--accent-gold)" : "var(--text-muted)" }}
          >
            {isApplied ? AFTER_WORDS : BEFORE_WORDS}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {isApplied ? "words now" : "words"}
          </span>
        </div>

        {isApplied && (
          <>
            <div className="w-px h-6" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums" style={{ color: "#4ade80" }}>
                -{REDUCTION}%
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>smaller</span>
            </div>
            <div className="w-px h-6" style={{ background: "var(--border-subtle)" }} />
            <div className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
              &ldquo;Cut ruthlessly&rdquo;
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
