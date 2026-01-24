"use client";

import { useState, useRef } from "react";

// Animation phases - Two-act structure
type AnimationPhase = 'idle' | 'h1intro' | 'punch' | 'shimmer' | 'pause' | 'h2reveal' | 'done';

// Words to animate
const H1_INTRO = ['AI', 'skills', 'that'];
const H1_PAYOFF = ['prove', 'themselves'];
const H2_LINE1 = ['See', 'the', 'difference', 'before', 'you', 'install.'];
const H2_LINE2 = ['Every', 'skill', 'demos', 'its', 'own', 'transformation.'];

interface AnimatedWordProps {
  word: string;
  isVisible: boolean;
  isGold?: boolean;
  isMuted?: boolean;
  scale?: number;
  shimmerProgress?: number;
}

function AnimatedWord({
  word,
  isVisible,
  isGold = false,
  isMuted = false,
  scale = 1,
  shimmerProgress = 0
}: AnimatedWordProps) {
  return (
    <span
      className="inline-block transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(0) scale(${scale})`
          : 'translateY(16px) scale(0.97)',
        fontStyle: isGold ? 'italic' : 'normal',
        color: isGold
          ? 'var(--accent-gold)'
          : isMuted
            ? 'var(--text-secondary)'
            : 'var(--text-primary)',
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {word}
      {/* Shimmer overlay for gold text */}
      {isGold && shimmerProgress > 0 && shimmerProgress < 1 && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background: `linear-gradient(90deg,
              transparent ${shimmerProgress * 100 - 20}%,
              rgba(255,255,255,0.7) ${shimmerProgress * 100}%,
              transparent ${shimmerProgress * 100 + 20}%
            )`,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </span>
  );
}

interface HeadlinePanelProps {
  label: string;
  isAnimated: boolean;
  showContent: boolean;
  h1IntroVisible: number; // How many H1 intro words visible (0-3)
  showPayoff: boolean;
  punchScale: number;
  shimmerProgress: number;
  h2Opacity: number; // 0-1 for gentle fade
  isComplete: boolean;
}

function HeadlinePanel({
  label,
  isAnimated,
  showContent,
  h1IntroVisible,
  showPayoff,
  punchScale,
  shimmerProgress,
  h2Opacity,
  isComplete,
}: HeadlinePanelProps) {

  return (
    <div
      className="flex-1 rounded-xl p-6 transition-all duration-500"
      style={{
        background: 'var(--bg-deep)',
        border: `1px solid ${isComplete && isAnimated ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
        boxShadow: isComplete && isAnimated ? '0 0 20px var(--glow-gold)' : 'none',
      }}
    >
      {/* Panel label */}
      <div
        className="text-xs mb-4 uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </div>

      {/* Content */}
      <div style={{ minHeight: '10rem' }}>
        {isAnimated ? (
          // Animated version - Two-act structure
          <>
            {/* Act 1: H1 with dramatic payoff */}
            {/* H1 Intro: "AI skills that" */}
            <div
              className="text-2xl leading-tight mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {H1_INTRO.map((word, i) => (
                <span key={`h1-${i}`}>
                  <AnimatedWord
                    word={word}
                    isVisible={showContent && h1IntroVisible > i}
                  />
                  {i < H1_INTRO.length - 1 && ' '}
                </span>
              ))}
            </div>

            {/* H1 Payoff: "prove themselves" - the dramatic moment */}
            <div
              className="text-2xl leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {H1_PAYOFF.map((word, i) => (
                <span key={`payoff-${i}`}>
                  <AnimatedWord
                    word={word}
                    isVisible={showPayoff}
                    isGold={true}
                    scale={punchScale}
                    shimmerProgress={shimmerProgress}
                  />
                  {i < H1_PAYOFF.length - 1 && ' '}
                </span>
              ))}
            </div>

            {/* Act 2: H2 with gentle fade */}
            <div
              className="transition-all duration-700 ease-out"
              style={{
                opacity: h2Opacity,
                transform: `translateY(${(1 - h2Opacity) * 10}px)`,
              }}
            >
              <div
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
              >
                {H2_LINE1.join(' ')}
              </div>
              <div
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
              >
                {H2_LINE2.join(' ')}
              </div>
            </div>
          </>
        ) : (
          // Static version - just appears instantly
          <div
            className="transition-opacity duration-100"
            style={{ opacity: showContent ? 1 : 0 }}
          >
            <div
              className="text-2xl leading-tight mb-1"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}
            >
              {H1_INTRO.join(' ')}
            </div>
            <div
              className="text-2xl leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontStyle: 'italic' }}
            >
              {H1_PAYOFF.join(' ')}
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
            >
              {H2_LINE1.join(' ')}
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
            >
              {H2_LINE2.join(' ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RemotonDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');

  // Act 1: Track H1 intro words visible (0-3)
  const [h1IntroVisible, setH1IntroVisible] = useState<number>(0);
  // Track if payoff should show
  const [showPayoff, setShowPayoff] = useState(false);
  // Track scale for "prove themselves" (0 to 1.18 to 1)
  const [punchScale, setPunchScale] = useState(0);
  // Track shimmer progress (0 to 1)
  const [shimmerProgress, setShimmerProgress] = useState(0);
  // Act 2: Track H2 opacity (0 to 1) for gentle fade
  const [h2Opacity, setH2Opacity] = useState(0);

  const animationRef = useRef<number | null>(null);

  const handleApply = () => {
    if (isApplied) {
      // Reset
      setIsApplied(false);
      setAnimationPhase('idle');
      setH1IntroVisible(0);
      setShowPayoff(false);
      setPunchScale(0);
      setShimmerProgress(0);
      setH2Opacity(0);
      return;
    }

    setIsAnimating(true);
    setAnimationPhase('h1intro');
    setH1IntroVisible(0);
    setShowPayoff(false);
    setPunchScale(0);
    setShimmerProgress(0);
    setH2Opacity(0);

    // Two-act timing configuration
    // Act 1: H1 intro words → punch → shimmer
    const h1WordInterval = 250; // ms between H1 intro words (slower)
    const h1IntroDuration = H1_INTRO.length * h1WordInterval + 300; // +300 for settle
    const punchDuration = 500; // ms for scale animation
    const shimmerDuration = 600; // ms for shimmer sweep
    const pauseBetweenActs = 400; // ms pause before Act 2

    // Act 2: H2 gentle fade
    const h2FadeDuration = 800; // ms for H2 to fade in

    // Calculate phase boundaries
    const punchStart = h1IntroDuration;
    const punchEnd = punchStart + punchDuration;
    const shimmerEnd = punchEnd + shimmerDuration;
    const h2Start = shimmerEnd + pauseBetweenActs;
    const totalDuration = h2Start + h2FadeDuration;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      // Act 1, Phase 1: H1 intro words slide in
      if (elapsed < h1IntroDuration) {
        const wordIndex = Math.min(
          Math.floor(elapsed / h1WordInterval) + 1,
          H1_INTRO.length
        );
        setH1IntroVisible(wordIndex);
        setAnimationPhase('h1intro');
      }
      // Act 1, Phase 2: Punch (scale overshoot for "prove themselves")
      else if (elapsed < punchEnd) {
        setH1IntroVisible(H1_INTRO.length);
        setAnimationPhase('punch');
        setShowPayoff(true);

        const punchElapsed = elapsed - punchStart;
        const punchProgress = Math.min(punchElapsed / punchDuration, 1);
        // Overshoot curve: 0 -> 1.2 -> 1
        let scale: number;
        if (punchProgress < 0.4) {
          // Fast rise to overshoot
          scale = (punchProgress / 0.4) * 1.2;
        } else {
          // Gentle settle back with slight bounce
          const settleProgress = (punchProgress - 0.4) / 0.6;
          scale = 1.2 - settleProgress * 0.2;
        }
        setPunchScale(scale);
      }
      // Act 1, Phase 3: Shimmer
      else if (elapsed < shimmerEnd) {
        setAnimationPhase('shimmer');
        setPunchScale(1);

        const shimmerElapsed = elapsed - punchEnd;
        setShimmerProgress(shimmerElapsed / shimmerDuration);
      }
      // Pause between acts
      else if (elapsed < h2Start) {
        setAnimationPhase('pause');
        setShimmerProgress(1);
      }
      // Act 2: H2 gentle fade in
      else if (elapsed < totalDuration) {
        setAnimationPhase('h2reveal');

        const h2Elapsed = elapsed - h2Start;
        const opacity = Math.min(h2Elapsed / h2FadeDuration, 1);
        // Ease out curve for gentler feel
        setH2Opacity(1 - Math.pow(1 - opacity, 2));
      }
      // Done
      else {
        setIsAnimating(false);
        setAnimationPhase('done');
        setIsApplied(true);
        setShowPayoff(true);
        setPunchScale(1);
        setShimmerProgress(1);
        setH2Opacity(1);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
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
            remotion
          </span>
        </div>

        <div className="p-4 text-sm">
          <div className="flex items-start gap-2">
            <span style={{ color: "var(--accent-gold)" }}>❯</span>
            <p style={{ color: "var(--text-primary)" }}>
              Create an animated hero section for my{" "}
              <span
                className="px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: "var(--glow-purple)",
                  color: "var(--accent-purple)",
                }}
              >
                Remotion
              </span>{" "}
              video
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
              {isApplied ? "Motion applied" : "Without motion"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {isApplied ? "Choreographed animation" : "Static text"}
            </p>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={isAnimating}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Try again</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Apply skill</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Side-by-side headline comparison */}
      <div className="flex gap-4">
        <HeadlinePanel
          label="Without motion"
          isAnimated={false}
          showContent={isAnimating || isApplied}
          h1IntroVisible={0}
          showPayoff={false}
          punchScale={0}
          shimmerProgress={0}
          h2Opacity={0}
          isComplete={isApplied}
        />
        <HeadlinePanel
          label="With motion"
          isAnimated={true}
          showContent={isAnimating || isApplied}
          h1IntroVisible={h1IntroVisible}
          showPayoff={showPayoff}
          punchScale={punchScale}
          shimmerProgress={shimmerProgress}
          h2Opacity={h2Opacity}
          isComplete={isApplied}
        />
      </div>

      {/* Result indicator */}
      <div
        className="mt-4 flex items-center justify-center gap-4 py-3 rounded-xl transition-all duration-500"
        style={{
          background: isApplied ? "var(--bg-surface)" : "transparent",
          border: isApplied ? "1px solid var(--border-subtle)" : "1px solid transparent",
        }}
      >
        {!isApplied ? (
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Same words, different impact
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Staggered timing
              </span>
            </div>
            <div className="w-px h-4" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Scale + overshoot
              </span>
            </div>
            <div className="w-px h-4" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Shimmer effect
              </span>
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
