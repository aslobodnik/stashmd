"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface BeforeAfterComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  prompt?: string;
  promptWithSkill?: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: "star" | "circle" | "diamond";
}

export function BeforeAfterComparison({
  beforeSrc,
  afterSrc,
  beforeLabel = "Without skill",
  afterLabel = "With skill",
  prompt = "Create a personal website for Benjamin Franklin based on his Wikipedia page",
  promptWithSkill = "Create a personal website for Benjamin Franklin based on his Wikipedia page using the frontend-design skill",
}: BeforeAfterComparisonProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [wandPosition, setWandPosition] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const sparkIdRef = useRef(0);

  // The text that gets added when skill is applied
  const skillAddition = " using the frontend-design skill";
  const skillName = "frontend-design";

  const colors = ["#ffd700", "#fff", "#fbbf24", "#f59e0b", "#a855f7", "#c084fc", "#38bdf8"];

  const createSpark = useCallback((wandX: number): Spark => {
    const angle = (Math.random() - 0.5) * Math.PI;
    const speed = Math.random() * 8 + 4;
    const types: ("star" | "circle" | "diamond")[] = ["star", "circle", "diamond"];

    return {
      id: sparkIdRef.current++,
      x: wandX,
      y: Math.random() * 100,
      vx: Math.cos(angle) * speed + 2,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: Math.random() * 30 + 20,
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, []);

  const updateSparks = useCallback(() => {
    setSparks((prev) =>
      prev
        .map((spark) => ({
          ...spark,
          x: spark.x + spark.vx * 0.15,
          y: spark.y + spark.vy * 0.15,
          vy: spark.vy + 0.3,
          life: spark.life - 1 / spark.maxLife,
        }))
        .filter((spark) => spark.life > 0 && spark.x < 110 && spark.y < 110)
    );
  }, []);

  const handleApply = () => {
    if (isApplied) {
      setIsApplied(false);
      setIsTyping(false);
      setTypedChars(0);
      setWandPosition(0);
      setSparks([]);
      return;
    }

    // Phase 1: Type out the skill addition
    setIsTyping(true);
    setTypedChars(0);

    const typeSpeed = 25; // ms per character
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      charIndex++;
      setTypedChars(charIndex);

      if (charIndex >= skillAddition.length) {
        clearInterval(typeInterval);
        // Small pause after typing, then start wand animation
        setTimeout(() => {
          setIsTyping(false);
          startWandAnimation();
        }, 300);
      }
    }, typeSpeed);
  };

  const startWandAnimation = () => {
    setIsAnimating(true);
    setSparks([]);

    const duration = 2800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const position = eased * 100;

      setWandPosition(position);

      const sparkCount = Math.floor(Math.random() * 4) + 2;
      const newSparks: Spark[] = [];
      for (let i = 0; i < sparkCount; i++) {
        newSparks.push(createSpark(position));
      }
      setSparks((prev) => [...prev, ...newSparks]);
      updateSparks();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setIsApplied(true);
        const fadeOut = () => {
          setSparks((prev) => {
            const updated = prev
              .map((s) => ({ ...s, life: s.life - 0.05 }))
              .filter((s) => s.life > 0);
            if (updated.length > 0) {
              requestAnimationFrame(fadeOut);
            }
            return updated;
          });
        };
        fadeOut();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderSpark = (spark: Spark) => {
    const opacity = spark.life;
    const scale = spark.life * 0.5 + 0.5;

    if (spark.type === "star") {
      return (
        <svg
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size * 2,
            height: spark.size * 2,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${spark.id * 45}deg)`,
            opacity,
            filter: `drop-shadow(0 0 ${spark.size}px ${spark.color})`,
          }}
          viewBox="0 0 24 24"
          fill={spark.color}
        >
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
        </svg>
      );
    }

    if (spark.type === "diamond") {
      return (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size,
            height: spark.size,
            backgroundColor: spark.color,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(45deg)`,
            opacity,
            boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
          }}
        />
      );
    }

    return (
      <div
        key={spark.id}
        className="absolute pointer-events-none rounded-full"
        style={{
          left: `${spark.x}%`,
          top: `${spark.y}%`,
          width: spark.size,
          height: spark.size,
          backgroundColor: spark.color,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
        }}
      />
    );
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
        {/* Terminal header */}
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
            claude-sonnet-4-20250514
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-4 text-sm">
          <div className="flex items-start gap-2">
            <span style={{ color: "var(--accent-gold)" }}>❯</span>
            <div className="flex-1">
              <p style={{ color: "var(--text-primary)" }}>
                {prompt}
                {/* Typewriter addition */}
                {(isTyping || isAnimating || isApplied) && (
                  <span>
                    {(() => {
                      const typed = skillAddition.slice(0, typedChars);
                      const skillStart = skillAddition.indexOf(skillName);
                      const skillEnd = skillStart + skillName.length;

                      // Before skill name
                      const beforeSkill = typed.slice(0, skillStart);
                      // The skill name (partial or full)
                      const typedSkill = typed.slice(skillStart, Math.min(typed.length, skillEnd));
                      // After skill name
                      const afterSkill = typed.slice(skillEnd);

                      return (
                        <>
                          {beforeSkill}
                          {typedSkill && (
                            <span
                              className="px-1.5 py-0.5 rounded font-medium"
                              style={{
                                background: "var(--glow-gold)",
                                color: "var(--accent-gold)",
                              }}
                            >
                              {typedSkill}
                            </span>
                          )}
                          {afterSkill}
                        </>
                      );
                    })()}
                    {/* Blinking cursor while typing */}
                    {isTyping && (
                      <span
                        className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                        style={{
                          background: "var(--accent-gold)",
                          animation: "blink 0.8s infinite",
                        }}
                      />
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: isApplied ? "var(--glow-gold)" : "var(--bg-elevated)",
              border: `1px solid ${isApplied ? "var(--accent-gold)" : "var(--border-subtle)"}`,
            }}
          >
            {isApplied ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="var(--accent-gold)"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--text-muted)" }}
              />
            )}
            {isApplied && (
              <div
                className="absolute inset-0 rounded-lg animate-ping"
                style={{
                  background: "var(--accent-gold)",
                  opacity: 0.2,
                  animationDuration: "2s",
                }}
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {isApplied ? afterLabel : beforeLabel}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {isApplied ? "Skill active" : "Default Claude output"}
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleApply}
          disabled={isAnimating || isTyping}
          className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer w-full sm:w-auto"
          style={{
            background: isApplied
              ? "transparent"
              : "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
            color: isApplied ? "var(--text-muted)" : "var(--bg-deep)",
            border: isApplied ? "1px solid var(--border)" : "none",
            boxShadow: isApplied ? "none" : "0 4px 24px var(--glow-gold)",
            opacity: (isAnimating || isTyping) ? 0.7 : 1,
            cursor: (isAnimating || isTyping) ? "not-allowed" : "pointer",
          }}
        >
          {/* Shimmer effect on hover (only for Apply button) */}
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
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Try again</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Try it</span>
              <svg className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Demo viewport */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-elevated)",
          boxShadow: "0 0 0 1px var(--border-subtle), 0 20px 50px -10px rgba(0,0,0,0.5)",
        }}
      >
        {/* Viewport chrome */}
        <div
          className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-3 z-10"
          style={{
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40] opacity-80" />
          </div>
          <div
            className="flex-1 mx-4 h-5 rounded flex items-center justify-center text-xs"
            style={{
              background: "var(--bg-deep)",
              color: "var(--text-muted)",
            }}
          >
            localhost:3000
          </div>
        </div>

        {/* Before iframe */}
        <iframe
          src={beforeSrc}
          className="absolute inset-0 w-full h-full border-0 pt-8"
          title={beforeLabel}
        />

        {/* After iframe (revealed by clip-path) */}
        <div
          className="absolute inset-0 overflow-hidden pt-8"
          style={{
            clipPath:
              isApplied || isAnimating
                ? `inset(0 ${100 - wandPosition}% 0 0)`
                : "inset(0 100% 0 0)",
          }}
        >
          <iframe
            src={afterSrc}
            className="absolute inset-0 w-full h-full border-0"
            title={afterLabel}
          />
        </div>

        {/* Magic wand line */}
        {isAnimating && (
          <div
            className="absolute top-8 bottom-0 w-1 z-20 pointer-events-none"
            style={{
              left: `${wandPosition}%`,
              transform: "translateX(-50%)",
              background: "linear-gradient(to bottom, #a855f7, #ffd700, #38bdf8, #ffd700, #a855f7)",
              boxShadow: `
                0 0 10px 2px rgba(168, 85, 247, 0.8),
                0 0 20px 4px rgba(255, 215, 0, 0.6),
                0 0 40px 8px rgba(168, 85, 247, 0.4),
                0 0 60px 12px rgba(255, 215, 0, 0.2)
              `,
            }}
          />
        )}

        {/* Sparks */}
        <div className="absolute inset-0 pt-8 overflow-hidden pointer-events-none">
          {sparks.map(renderSpark)}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {isApplied ? "↑ Distinctive, memorable design" : "↑ Generic AI output"}
        </p>
        <a
          href={isApplied ? afterSrc : beforeSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs flex items-center gap-1 transition-colors hover:text-[var(--text-secondary)]"
          style={{ color: "var(--text-muted)" }}
        >
          Open full demo
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
