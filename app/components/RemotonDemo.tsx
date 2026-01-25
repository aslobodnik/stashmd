"use client";

import { useState, useRef } from "react";

// Video player phases
type VideoPhase = 'idle' | 'playing' | 'done';

// Total duration: 6 seconds
const TOTAL_DURATION = 6000;

// Scene timing (ms)
const SCENES = {
  terminal: { start: 0, end: 1200 },
  pixelDissolve: { start: 1200, end: 1500 },
  logo: { start: 1500, end: 2200 },
  zoomPunch: { start: 2200, end: 2400 },
  headline: { start: 2400, end: 3400 },
  slideTransition: { start: 3400, end: 3600 },
  featureCards: { start: 3600, end: 4500 },
  whiteFlash: { start: 4500, end: 4700 },
  cta: { start: 4700, end: 5500 },
  endCard: { start: 5500, end: 6000 },
};

// Terminal command to type
const TERMINAL_COMMAND = 'npx remotion render --skill launch';

// Feature cards content
const FEATURES = ['Spring physics', 'Character cascade', 'Scene transitions'];

interface SceneProps {
  progress: number;
  isActive: boolean;
}

// Scene 1: Terminal with typing animation
function TerminalScene({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  const terminalOpacity = Math.min(progress * 6, 1);
  const typeProgress = Math.max(0, Math.min((progress - 0.17) / 0.66, 1));
  const charsToShow = Math.floor(typeProgress * TERMINAL_COMMAND.length);
  const displayedCommand = TERMINAL_COMMAND.slice(0, charsToShow);
  const cursorVisible = Math.floor(progress * 8) % 2 === 0;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: terminalOpacity }}
    >
      <div
        className="rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          width: '85%',
          maxWidth: '480px',
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: '#2a2a2a', borderBottom: '1px solid #333' }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#27ca40' }} />
          </div>
          <span className="text-xs ml-2" style={{ color: '#666' }}>terminal</span>
        </div>
        <div className="p-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
          <div className="flex">
            <span style={{ color: '#22c55e' }}>$ </span>
            <span style={{ color: '#fafafa' }}>{displayedCommand}</span>
            <span
              style={{
                color: '#fafafa',
                opacity: cursorVisible ? 1 : 0,
                marginLeft: '1px',
              }}
            >
              █
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Transition 1: Pixel dissolve
function PixelDissolve({ progress, isActive }: SceneProps) {
  if (!isActive || progress <= 0) return null;

  const gridSize = 10;
  const pixels = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const seed = (x * 7 + y * 13) % 17;
      const fadeStart = seed / 17;
      const pixelOpacity = Math.max(0, 1 - (progress - fadeStart) * 2.5);

      pixels.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: `${(x / gridSize) * 100}%`,
            top: `${(y / gridSize) * 100}%`,
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
            background: '#1a1a1a',
            opacity: pixelOpacity,
          }}
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pixels}
    </div>
  );
}

// Scene 2: Logo with character cascade
function LogoScene({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  const logoText = 'stash';
  const extText = '.md';
  const allChars = logoText + extText;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-5xl font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
        {allChars.split('').map((char, i) => {
          const charStart = i * 0.08;
          const charProgress = Math.max(0, Math.min((progress - charStart) / 0.25, 1));

          // Bouncy spring
          const bounce = charProgress < 1
            ? Math.sin(charProgress * Math.PI * 2.5) * (1 - charProgress) * 0.4
            : 0;

          const translateY = (1 - charProgress) * 50 + bounce * 25;
          const rotate = (1 - charProgress) * -20 + bounce * 10;
          const opacity = Math.min(charProgress * 2.5, 1);
          const isGold = i >= logoText.length;

          return (
            <span
              key={i}
              className="inline-block"
              style={{
                transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
                opacity,
                color: isGold ? 'var(--accent-gold)' : 'var(--text-primary)',
                fontStyle: isGold ? 'italic' : 'normal',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Scene 3: Headline with character rain and highlight wipe
function HeadlineScene({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  const line1 = 'AI skills that';
  const line2 = 'prove themselves';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Line 1: Characters rain from top */}
      <div
        className="text-3xl mb-2 text-center"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {line1.split('').map((char, i) => {
          const charStart = i * 0.02;
          const charProgress = Math.max(0, Math.min((progress - charStart) / 0.12, 1));
          const bounce = charProgress >= 1 ? 0 : Math.sin(charProgress * Math.PI) * (1 - charProgress) * 0.3;
          const translateY = (1 - charProgress) * -40 + bounce * -15;
          const opacity = Math.min(charProgress * 3, 1);

          return (
            <span
              key={i}
              className="inline-block"
              style={{
                transform: `translateY(${translateY}px)`,
                opacity,
                color: 'var(--text-primary)',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>

      {/* Line 2: Scale punch + highlight wipe */}
      <div
        className="text-3xl text-center relative"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {(() => {
          let scale = 0;
          let opacity = 0;
          if (progress >= 0.35) {
            const punchProgress = Math.min((progress - 0.35) / 0.25, 1);
            opacity = Math.min(punchProgress * 3, 1);
            if (punchProgress < 0.5) {
              scale = (punchProgress / 0.5) * 1.25;
            } else {
              scale = 1.25 - ((punchProgress - 0.5) / 0.5) * 0.25;
            }
          }

          const highlightProgress = progress >= 0.65
            ? Math.min((progress - 0.65) / 0.3, 1)
            : 0;

          return (
            <span
              className="relative inline-block"
              style={{
                transform: `scale(${scale})`,
                opacity,
                color: 'var(--accent-gold)',
                fontStyle: 'italic',
              }}
            >
              <span
                className="absolute inset-y-0 -inset-x-2 -z-10 rounded"
                style={{
                  background: 'var(--accent-gold)',
                  opacity: 0.15,
                  transform: `scaleX(${highlightProgress})`,
                  transformOrigin: 'left center',
                }}
              />
              {line2}
            </span>
          );
        })()}
      </div>
    </div>
  );
}

// Scene 4: Feature cards with 3D flip
function FeatureCards({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
      {FEATURES.map((feature, i) => {
        const cardStart = i * 0.2;
        const cardProgress = Math.max(0, Math.min((progress - cardStart) / 0.22, 1));
        const rotateY = (1 - cardProgress) * -90;
        const opacity = cardProgress;
        const floatOffset = cardProgress >= 1
          ? Math.sin((progress - cardStart - 0.22) * 12) * 2
          : 0;

        return (
          <div
            key={feature}
            className="px-3 py-2 rounded-lg text-center"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderBottom: '2px solid var(--accent-gold)',
              transform: `perspective(600px) rotateY(${rotateY}deg) translateY(${floatOffset}px)`,
              opacity,
              minWidth: '100px',
            }}
          >
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {feature}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Transition: White flash
function WhiteFlash({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  let opacity = 0;
  if (progress < 0.5) {
    opacity = progress * 2 * 0.7;
  } else {
    opacity = (1 - progress) * 2 * 0.7;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'white', opacity }}
    />
  );
}

// Scene 5: CTA with heavy spring
function CTAScene({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  let translateY = 60;
  let opacity = 0;
  let glowIntensity = 0;

  if (progress > 0) {
    opacity = Math.min(progress * 4, 1);

    if (progress < 0.45) {
      const springProgress = progress / 0.45;
      translateY = 60 * (1 - springProgress * 1.2);
      if (translateY < -10) {
        translateY = -10 + (springProgress - 0.37) * 30;
      }
    } else {
      translateY = 0;
    }

    if (progress >= 0.5 && progress < 0.7) {
      glowIntensity = Math.sin(((progress - 0.5) / 0.2) * Math.PI);
    } else if (progress >= 0.75 && progress < 0.95) {
      glowIntensity = Math.sin(((progress - 0.75) / 0.2) * Math.PI);
    }
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        className="px-6 py-3 rounded-full text-base font-medium"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-gold)',
          border: '2px solid var(--accent-gold)',
          background: 'var(--bg-surface)',
          boxShadow: glowIntensity > 0
            ? `0 0 ${35 * glowIntensity}px var(--glow-gold)`
            : 'none',
        }}
      >
        See the demos →
      </div>
    </div>
  );
}

// Scene 6: End card shimmer
function EndCard({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  const shimmerX = progress * 150 - 25;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background: `linear-gradient(90deg,
          transparent ${shimmerX - 25}%,
          rgba(251, 191, 36, 0.12) ${shimmerX}%,
          transparent ${shimmerX + 25}%
        )`,
      }}
    />
  );
}

interface VideoPlayerProps {
  currentTime: number;
  isPlaying: boolean;
  isComplete: boolean;
}

function VideoPlayer({ currentTime, isPlaying, isComplete }: VideoPlayerProps) {
  const getProgress = (scene: { start: number; end: number }) => {
    if (currentTime < scene.start) return 0;
    if (currentTime > scene.end) return 1;
    return (currentTime - scene.start) / (scene.end - scene.start);
  };

  const isInScene = (scene: { start: number; end: number }, buffer = 100) => {
    return currentTime >= scene.start && currentTime <= scene.end + buffer;
  };

  // Zoom punch scale
  const zoomProgress = getProgress(SCENES.zoomPunch);
  const zoomScale = isInScene(SCENES.zoomPunch, 0)
    ? (zoomProgress < 0.5 ? 1 + (zoomProgress / 0.5) * 0.12 : 1.12 - ((zoomProgress - 0.5) / 0.5) * 0.12)
    : 1;

  const timelineProgress = currentTime / TOTAL_DURATION;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `0:0${seconds}`;
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        aspectRatio: '16/9',
        background: 'radial-gradient(ellipse at center, var(--bg-surface) 0%, var(--bg-deep) 100%)',
        border: `1px solid ${isComplete ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
        boxShadow: isComplete ? '0 0 30px var(--glow-gold)' : 'none',
        transition: 'border-color 500ms, box-shadow 500ms',
      }}
    >
      {/* Scene container */}
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${zoomScale})` }}
      >
        <TerminalScene
          progress={getProgress(SCENES.terminal)}
          isActive={isInScene(SCENES.terminal)}
        />
        <PixelDissolve
          progress={getProgress(SCENES.pixelDissolve)}
          isActive={isInScene(SCENES.pixelDissolve)}
        />
        <LogoScene
          progress={getProgress(SCENES.logo)}
          isActive={currentTime >= SCENES.logo.start && currentTime < SCENES.headline.start}
        />
        <HeadlineScene
          progress={getProgress(SCENES.headline)}
          isActive={currentTime >= SCENES.headline.start && currentTime < SCENES.featureCards.start}
        />
        <FeatureCards
          progress={getProgress(SCENES.featureCards)}
          isActive={currentTime >= SCENES.featureCards.start && currentTime < SCENES.cta.start}
        />
        <CTAScene
          progress={getProgress(SCENES.cta)}
          isActive={currentTime >= SCENES.cta.start}
        />
      </div>

      {/* Overlay effects */}
      <WhiteFlash
        progress={getProgress(SCENES.whiteFlash)}
        isActive={isInScene(SCENES.whiteFlash, 0)}
      />
      <EndCard
        progress={getProgress(SCENES.endCard)}
        isActive={isInScene(SCENES.endCard)}
      />

      {/* Timeline bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-3 gap-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
      >
        <div
          className="flex-1 h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${timelineProgress * 100}%`,
              background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-amber))',
              transition: 'width 50ms linear',
            }}
          />
        </div>
        <span
          className="text-xs tabular-nums"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
        </span>
      </div>
    </div>
  );
}

export function RemotonDemo() {
  const [phase, setPhase] = useState<VideoPhase>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  const handleTryIt = () => {
    if (phase === 'done') {
      setPhase('idle');
      setCurrentTime(0);
      return;
    }

    setPhase('playing');
    setCurrentTime(0);

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      setCurrentTime(Math.min(elapsed, TOTAL_DURATION));

      if (elapsed < TOTAL_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('done');
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
            remotion
          </span>
        </div>

        <div className="p-4 text-sm">
          <div className="flex items-start gap-2">
            <span style={{ color: "var(--accent-gold)" }}>❯</span>
            <p style={{ color: "var(--text-primary)" }}>
              Render my launch video with{" "}
              <span
                className="px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: "var(--glow-purple)",
                  color: "var(--accent-purple)",
                }}
              >
                spring physics
              </span>{" "}
              and scene transitions
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
              background: phase === 'done' ? "var(--glow-gold)" : "var(--bg-elevated)",
              border: `1px solid ${phase === 'done' ? "var(--accent-gold)" : "var(--border-subtle)"}`,
            }}
          >
            {phase === 'done' ? (
              <svg className="w-4 h-4" fill="none" stroke="var(--accent-gold)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--text-muted)" }} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {phase === 'done' ? "Video rendered" : "Static frames"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {phase === 'done' ? "6-scene composition" : "No animation"}
            </p>
          </div>
        </div>

        <button
          onClick={handleTryIt}
          disabled={phase === 'playing'}
          className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer w-full sm:w-auto"
          style={{
            background: phase === 'done'
              ? "transparent"
              : "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)",
            color: phase === 'done' ? "var(--text-muted)" : "var(--bg-deep)",
            border: phase === 'done' ? "1px solid var(--border)" : "none",
            boxShadow: phase === 'done' ? "none" : "0 4px 24px var(--glow-gold)",
            opacity: phase === 'playing' ? 0.7 : 1,
            cursor: phase === 'playing' ? "not-allowed" : "pointer",
          }}
        >
          {phase !== 'done' && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                animation: "shimmer 2s infinite",
              }}
            />
          )}
          {phase === 'done' ? (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Video Player */}
      <VideoPlayer
        currentTime={currentTime}
        isPlaying={phase === 'playing'}
        isComplete={phase === 'done'}
      />

      {/* Result indicator */}
      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-3 px-2 rounded-xl transition-all duration-500"
        style={{
          background: phase === 'done' ? "var(--bg-surface)" : "transparent",
          border: phase === 'done' ? "1px solid var(--border-subtle)" : "1px solid transparent",
        }}
      >
        {phase !== 'done' ? (
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Static frames only
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                6 scenes
              </span>
            </div>
            <div className="hidden sm:block w-px h-4" style={{ background: "var(--border-subtle)" }} />
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                5 transitions
              </span>
            </div>
            <div className="hidden sm:block w-px h-4" style={{ background: "var(--border-subtle)" }} />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Character cascade
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
