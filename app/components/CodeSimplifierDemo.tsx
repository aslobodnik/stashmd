"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Syntax highlighting helper
function highlightCodeLines(code: string): { text: string; highlighted: React.ReactNode }[] {
  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Keywords
      const keywordMatch = remaining.match(/^(const|let|var|function|return|if|else|import|export|from|type|interface)\b/);
      if (keywordMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#c084fc' }}>{keywordMatch[0]}</span>);
        remaining = remaining.slice(keywordMatch[0].length);
        continue;
      }

      // JSX tags
      const jsxMatch = remaining.match(/^(<\/?)([\w]+)/);
      if (jsxMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#78716c' }}>{jsxMatch[1]}</span>);
        tokens.push(<span key={keyIdx++} style={{ color: '#f87171' }}>{jsxMatch[2]}</span>);
        remaining = remaining.slice(jsxMatch[0].length);
        continue;
      }

      // Strings
      const stringMatch = remaining.match(/^("[^"]*"|'[^']*'|`[^`]*`)/);
      if (stringMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#fbbf24' }}>{stringMatch[0]}</span>);
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^\d+(\.\d+)?/);
      if (numMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#f59e0b' }}>{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Properties/keys
      const propMatch = remaining.match(/^(\w+):/);
      if (propMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#38bdf8' }}>{propMatch[1]}</span>);
        tokens.push(<span key={keyIdx++}>:</span>);
        remaining = remaining.slice(propMatch[0].length);
        continue;
      }

      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#525252' }}>{commentMatch[0]}</span>);
        remaining = remaining.slice(commentMatch[0].length);
        continue;
      }

      // Default: single character
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return {
      text: line,
      highlighted: <>{tokens.length > 0 ? tokens : '\u00A0'}</>,
    };
  });
}

// Real code from BeforeAfterComparison.tsx - the actual renderSpark function
const BEFORE_CODE = `const renderSpark = (spark: Spark) => {
  const opacity = spark.life;
  const scale = spark.life * 0.5 + 0.5;

  if (spark.type === "star") {
    return (
      <svg
        key={spark.id}
        className="absolute pointer-events-none"
        style={{
          left: \`\${spark.x}%\`,
          top: \`\${spark.y}%\`,
          width: spark.size * 2,
          height: spark.size * 2,
          transform: \`translate(-50%, -50%) scale(\${scale})\`,
          opacity,
          filter: \`drop-shadow(0 0 \${spark.size}px \${spark.color})\`,
        }}
        viewBox="0 0 24 24"
        fill={spark.color}
      >
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7..." />
      </svg>
    );
  }

  if (spark.type === "diamond") {
    return (
      <div
        key={spark.id}
        className="absolute pointer-events-none"
        style={{
          left: \`\${spark.x}%\`,
          top: \`\${spark.y}%\`,
          width: spark.size,
          height: spark.size,
          backgroundColor: spark.color,
          transform: \`translate(-50%, -50%) rotate(45deg)\`,
          opacity,
          boxShadow: \`0 0 \${spark.size * 2}px \${spark.color}\`,
        }}
      />
    );
  }

  return (
    <div
      key={spark.id}
      className="absolute pointer-events-none rounded-full"
      style={{
        left: \`\${spark.x}%\`,
        top: \`\${spark.y}%\`,
        width: spark.size,
        height: spark.size,
        backgroundColor: spark.color,
        transform: \`translate(-50%, -50%) scale(\${scale})\`,
        opacity,
        boxShadow: \`0 0 \${spark.size * 2}px \${spark.color}\`,
      }}
    />
  );
};`;

const AFTER_CODE = `const SparkShapes = {
  star: (props: SparkProps) => (
    <svg viewBox="0 0 24 24" fill={props.color} style={props.style}>
      <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7..." />
    </svg>
  ),
  diamond: (props: SparkProps) => (
    <div style={{ ...props.style, transform: "rotate(45deg)" }} />
  ),
  circle: (props: SparkProps) => (
    <div className="rounded-full" style={props.style} />
  ),
};

const renderSpark = (spark: Spark) => {
  const Shape = SparkShapes[spark.type];
  return (
    <div key={spark.id} style={getSparkStyle(spark)}>
      <Shape {...spark} />
    </div>
  );
};`;

const beforeLines = highlightCodeLines(BEFORE_CODE);
const afterLines = highlightCodeLines(AFTER_CODE);

const BEFORE_LINES = BEFORE_CODE.split('\n').length;
const AFTER_LINES = AFTER_CODE.split('\n').length;
const REDUCTION = Math.round((1 - AFTER_LINES / BEFORE_LINES) * 100);

// Lines that will be removed (0-indexed)
// These are the lines that dissolve into noise
const REMOVED_LINES = new Set([
  // The star branch (lines 5-27 in the before code)
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  // The diamond branch (lines 29-45)
  29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  // The circle/default return (lines 47-62)
  47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
]);

// Lines that stay but transform
const TRANSFORM_LINES = new Set([0, 1, 2, 3, 4, 28, 46, 62]);

// Glitch effect: scramble characters
function scrambleText(text: string, intensity: number): string {
  const glitchChars = '!@#$%^&*<>[]{}|/\\~';
  return text
    .split('')
    .map((char) => {
      if (char === ' ' || char === '\n') return char;
      if (Math.random() < intensity * 0.4) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    })
    .join('');
}

interface GlitchLineProps {
  children: React.ReactNode;
  originalText: string;
  noiseLevel: number; // 0-1
  isCollapsing: boolean;
  isCollapsed: boolean;
}

function GlitchLine({ children, originalText, noiseLevel, isCollapsing, isCollapsed }: GlitchLineProps) {
  const [scrambledText, setScrambledText] = useState(originalText);

  useEffect(() => {
    if (noiseLevel > 0) {
      const interval = setInterval(() => {
        setScrambledText(scrambleText(originalText, noiseLevel));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setScrambledText(originalText);
    }
  }, [noiseLevel, originalText]);

  return (
    <div
      className="leading-relaxed overflow-hidden transition-all duration-300"
      style={{
        maxHeight: isCollapsed ? 0 : isCollapsing ? 0 : '1.5em',
        opacity: isCollapsed ? 0 : isCollapsing ? 0 : 1,
        textShadow: noiseLevel > 0.3
          ? `${-noiseLevel * 3}px 0 rgba(255, 0, 0, ${noiseLevel * 0.7}), ${noiseLevel * 3}px 0 rgba(0, 255, 255, ${noiseLevel * 0.7})`
          : 'none',
        filter: noiseLevel > 0 ? `brightness(${1 + noiseLevel * 0.5})` : 'none',
      }}
    >
      {noiseLevel > 0.5 ? (
        <span style={{ color: 'var(--text-secondary)' }}>{scrambledText}</span>
      ) : (
        children
      )}
    </div>
  );
}

export function CodeSimplifierDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'noise' | 'collapse' | 'done'>('idle');

  // Track noise level per line (0-1)
  const [lineNoiseMap, setLineNoiseMap] = useState<Map<number, number>>(new Map());
  // Track which lines are collapsing/collapsed
  const [collapsingLines, setCollapsingLines] = useState<Set<number>>(new Set());
  const [collapsedLines, setCollapsedLines] = useState<Set<number>>(new Set());

  const animationRef = useRef<number | null>(null);

  const handleApply = () => {
    if (isApplied) {
      // Reset
      setIsApplied(false);
      setAnimationPhase('idle');
      setLineNoiseMap(new Map());
      setCollapsingLines(new Set());
      setCollapsedLines(new Set());
      return;
    }

    setIsAnimating(true);
    setAnimationPhase('noise');

    const removedLinesArray = Array.from(REMOVED_LINES);
    const totalDuration = 3000;
    const noisePhaseEnd = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      if (elapsed < noisePhaseEnd) {
        // Phase 1: Build noise on removed lines
        const noiseProgress = elapsed / noisePhaseEnd;
        const newNoiseMap = new Map<number, number>();

        removedLinesArray.forEach((lineIdx, i) => {
          // Stagger noise buildup - earlier lines get noisy first
          const lineProgress = Math.max(0, noiseProgress - (i / removedLinesArray.length) * 0.3);
          const noise = Math.min(lineProgress * 1.5, 1);
          newNoiseMap.set(lineIdx, noise);
        });

        setLineNoiseMap(newNoiseMap);
      } else {
        // Phase 2: Collapse lines in waves
        const collapseProgress = (elapsed - noisePhaseEnd) / (totalDuration - noisePhaseEnd);

        // Determine which lines should be collapsing based on progress
        const linesToCollapse = Math.floor(collapseProgress * removedLinesArray.length);
        const newCollapsing = new Set<number>();
        const newCollapsed = new Set<number>();

        removedLinesArray.forEach((lineIdx, i) => {
          if (i < linesToCollapse - 3) {
            newCollapsed.add(lineIdx);
          } else if (i < linesToCollapse) {
            newCollapsing.add(lineIdx);
          }
        });

        setCollapsingLines(newCollapsing);
        setCollapsedLines(newCollapsed);
        setAnimationPhase('collapse');
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setIsAnimating(false);
        setAnimationPhase('done');
        setIsApplied(true);
        setLineNoiseMap(new Map());
        setCollapsingLines(new Set());
        setCollapsedLines(new Set());
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
            code-simplifier
          </span>
        </div>

        <div className="p-4 text-sm">
          <div className="flex items-start gap-2">
            <span style={{ color: "var(--accent-gold)" }}>❯</span>
            <p style={{ color: "var(--text-primary)" }}>
              Simplify{" "}
              <span
                className="px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: "var(--glow-gold)",
                  color: "var(--accent-gold)",
                }}
              >
                renderSpark
              </span>{" "}
              — conditional branches → lookup table
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
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
              {isApplied ? "Simplified" : "Before simplification"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {isApplied ? "Same behavior, less code" : `${BEFORE_LINES} lines of conditionals`}
            </p>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={isAnimating}
          className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer w-full sm:w-auto"
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

      {/* Code viewport with noise dissolution */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-700 ease-out"
        style={{
          background: "var(--bg-deep)",
          border: `1px solid ${isApplied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
          boxShadow: isApplied ? "0 0 30px var(--glow-gold)" : "none",
        }}
      >
        {/* Code header */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40] opacity-80" />
            </div>
            <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
              BeforeAfterComparison.tsx
            </span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded transition-all duration-300"
            style={{
              background: isApplied ? "rgba(39, 202, 64, 0.15)" : "var(--bg-elevated)",
              color: isApplied ? "#4ade80" : "var(--text-muted)",
            }}
          >
            {isApplied ? `${AFTER_LINES} lines` : `${BEFORE_LINES} lines`}
          </span>
        </div>

        {/* Code content area */}
        <div className="relative overflow-hidden">
          {/* Before code with glitch effects */}
          {!isApplied && (
            <div className="p-4">
              <code className="text-[11px] block" style={{ color: "var(--text-secondary)" }}>
                {beforeLines.map((line, idx) => {
                  const noiseLevel = lineNoiseMap.get(idx) || 0;
                  const isCollapsing = collapsingLines.has(idx);
                  const isCollapsed = collapsedLines.has(idx);
                  const isRemoved = REMOVED_LINES.has(idx);

                  return (
                    <GlitchLine
                      key={idx}
                      originalText={line.text}
                      noiseLevel={isRemoved ? noiseLevel : 0}
                      isCollapsing={isCollapsing}
                      isCollapsed={isCollapsed}
                    >
                      <div
                        className="leading-relaxed transition-all duration-300"
                        style={{
                          filter: !isRemoved && animationPhase !== 'idle'
                            ? 'brightness(1.2)'
                            : 'none',
                        }}
                      >
                        {line.highlighted}
                      </div>
                    </GlitchLine>
                  );
                })}
              </code>
            </div>
          )}

          {/* After code - shown when complete */}
          {isApplied && (
            <div className="p-4">
              <code className="text-[11px] block" style={{ color: "var(--text-secondary)" }}>
                {afterLines.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.highlighted}
                  </div>
                ))}
              </code>
            </div>
          )}

          {/* Scanline overlay during noise phase */}
          {isAnimating && animationPhase === 'noise' && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  rgba(0, 0, 0, 0.1) 1px,
                  transparent 2px,
                  transparent 4px
                )`,
                animation: 'scanlines 0.1s linear infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-2 rounded-xl transition-all duration-500"
        style={{
          background: isApplied ? "var(--bg-surface)" : "transparent",
          border: isApplied ? "1px solid var(--border-subtle)" : "1px solid transparent",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xl sm:text-2xl font-bold tabular-nums transition-colors duration-300"
            style={{ color: isApplied ? "var(--accent-gold)" : "var(--text-muted)" }}
          >
            {isApplied ? AFTER_LINES : BEFORE_LINES}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {isApplied ? "lines now" : "lines"}
          </span>
        </div>

        {isApplied && (
          <>
            <div className="hidden sm:block w-px h-6" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: "#4ade80" }}>
                -{REDUCTION}%
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>smaller</span>
            </div>
            <div className="hidden sm:block w-px h-6" style={{ background: "var(--border-subtle)" }} />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                0
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>behavior changes</span>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}
