# Remotion Video Player Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace side-by-side headline panels with a video player showing a 3-scene promo video composition.

**Architecture:** Single video player container with timeline bar. Three scene components (Logo, Headline, CTA) animate in sequence driven by a master timer. requestAnimationFrame tracks elapsed time, each scene receives normalized progress.

**Tech Stack:** React, useState, useRef, requestAnimationFrame, CSS transforms

---

## Tasks

### Task 1: Update State and Types

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace animation types and constants**

Remove lines 5-12 (old AnimationPhase type and word arrays). Replace with:

```tsx
// Video player phases
type VideoPhase = 'idle' | 'playing' | 'done';

// Scene timing (ms)
const TOTAL_DURATION = 3000;
const SCENE_TIMING = {
  logo: { start: 0, end: 1000 },
  headline: { start: 800, end: 2200 },
  cta: { start: 2000, end: 3000 },
};
```

**Step 2: Update state variables in RemotonDemo**

Replace lines 210-225 state declarations with:

```tsx
const [phase, setPhase] = useState<VideoPhase>('idle');
const [currentTime, setCurrentTime] = useState(0); // 0-3000ms
const animationRef = useRef<number | null>(null);
```

---

### Task 2: Create LogoScene Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add LogoScene component**

Add after the type definitions, before RemotonDemo:

```tsx
interface SceneProps {
  progress: number; // 0-1 normalized progress within scene
  isActive: boolean;
}

function LogoScene({ progress, isActive }: SceneProps) {
  // Fade in during first 50%, hold, fade out last 20%
  const fadeIn = Math.min(progress * 2, 1);
  const fadeOut = progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1;
  const opacity = isActive ? fadeIn * fadeOut : 0;
  const scale = 0.95 + (Math.min(progress, 0.5) * 2 * 0.05); // 0.95 -> 1

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: 'opacity 100ms ease-out',
      }}
    >
      <span
        className="text-5xl font-medium"
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-primary)',
        }}
      >
        stash
      </span>
    </div>
  );
}
```

---

### Task 3: Create HeadlineScene Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add HeadlineScene component**

Add after LogoScene:

```tsx
const HEADLINE_INTRO = ['AI', 'skills', 'that'];
const HEADLINE_PAYOFF = ['prove', 'themselves'];

function HeadlineScene({ progress, isActive }: SceneProps) {
  // Timeline within scene:
  // 0-0.4: words stagger in
  // 0.4-0.65: punch scale
  // 0.65-1.0: shimmer + hold

  // Words stagger (3 words over 0-0.4 progress)
  const wordsVisible = Math.min(Math.floor(progress / 0.13) + 1, 3);

  // Punch animation (0.4-0.65)
  let punchScale = 0;
  let showPayoff = false;
  if (progress >= 0.4) {
    showPayoff = true;
    const punchProgress = Math.min((progress - 0.4) / 0.25, 1);
    // Overshoot: 0 -> 1.15 -> 1
    if (punchProgress < 0.5) {
      punchScale = (punchProgress / 0.5) * 1.15;
    } else {
      punchScale = 1.15 - ((punchProgress - 0.5) / 0.5) * 0.15;
    }
  }

  // Shimmer (0.65-1.0)
  const shimmerProgress = progress >= 0.65
    ? Math.min((progress - 0.65) / 0.35, 1)
    : 0;

  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity: isActive ? 1 : 0 }}
    >
      {/* "AI skills that" */}
      <div
        className="text-3xl leading-tight mb-1 text-center"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {HEADLINE_INTRO.map((word, i) => (
          <span
            key={word}
            className="inline-block mx-1 transition-all duration-300 ease-out"
            style={{
              opacity: wordsVisible > i ? 1 : 0,
              transform: wordsVisible > i ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>{word}</span>
          </span>
        ))}
      </div>

      {/* "prove themselves" - the punch */}
      <div
        className="text-3xl leading-tight text-center"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {HEADLINE_PAYOFF.map((word, i) => (
          <span
            key={word}
            className="inline-block mx-1 transition-all duration-200 ease-out relative"
            style={{
              opacity: showPayoff ? 1 : 0,
              transform: `scale(${showPayoff ? punchScale : 0})`,
              color: 'var(--accent-gold)',
              fontStyle: 'italic',
            }}
          >
            {word}
            {/* Shimmer overlay */}
            {shimmerProgress > 0 && shimmerProgress < 1 && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg,
                    transparent ${shimmerProgress * 100 - 25}%,
                    rgba(255,255,255,0.6) ${shimmerProgress * 100}%,
                    transparent ${shimmerProgress * 100 + 25}%
                  )`,
                  mixBlendMode: 'overlay',
                }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 4: Create CTAScene Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add CTAScene component**

Add after HeadlineScene:

```tsx
function CTAScene({ progress, isActive }: SceneProps) {
  // Slide up with spring overshoot
  // 0-0.6: slide up with overshoot
  // 0.6-0.8: glow pulse
  // 0.8-1: hold

  let translateY = 30;
  let opacity = 0;
  let glowIntensity = 0;

  if (isActive && progress > 0) {
    opacity = Math.min(progress * 3, 1);

    // Spring overshoot for position
    if (progress < 0.6) {
      const springProgress = progress / 0.6;
      // Overshoot to -5, then settle to 0
      translateY = 30 * (1 - springProgress * 1.15);
      if (translateY < -5) translateY = -5 + (springProgress - 0.87) * 50;
    } else {
      translateY = 0;
    }

    // Glow pulse at 0.6-0.8
    if (progress >= 0.6 && progress < 0.8) {
      glowIntensity = Math.sin(((progress - 0.6) / 0.2) * Math.PI);
    }
  }

  return (
    <div
      className="absolute inset-x-0 bottom-12 flex justify-center"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: 'opacity 100ms ease-out',
      }}
    >
      <div
        className="px-5 py-2 rounded-full text-sm font-medium"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-gold)',
          border: '1px solid var(--accent-gold)',
          background: 'var(--bg-surface)',
          boxShadow: glowIntensity > 0
            ? `0 0 ${20 * glowIntensity}px var(--glow-gold)`
            : 'none',
        }}
      >
        See the demos →
      </div>
    </div>
  );
}
```

---

### Task 5: Create VideoPlayer Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add VideoPlayer component**

Add after CTAScene:

```tsx
interface VideoPlayerProps {
  currentTime: number;
  isPlaying: boolean;
  isComplete: boolean;
}

function VideoPlayer({ currentTime, isPlaying, isComplete }: VideoPlayerProps) {
  // Calculate scene progress
  const getSceneProgress = (scene: { start: number; end: number }) => {
    if (currentTime < scene.start) return 0;
    if (currentTime > scene.end) return 1;
    return (currentTime - scene.start) / (scene.end - scene.start);
  };

  const logoProgress = getSceneProgress(SCENE_TIMING.logo);
  const headlineProgress = getSceneProgress(SCENE_TIMING.headline);
  const ctaProgress = getSceneProgress(SCENE_TIMING.cta);

  // Timeline progress
  const timelineProgress = currentTime / TOTAL_DURATION;

  // Format timestamp
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
      <div className="absolute inset-0">
        <LogoScene
          progress={logoProgress}
          isActive={currentTime >= SCENE_TIMING.logo.start && currentTime <= SCENE_TIMING.logo.end + 200}
        />
        <HeadlineScene
          progress={headlineProgress}
          isActive={currentTime >= SCENE_TIMING.headline.start}
        />
        <CTAScene
          progress={ctaProgress}
          isActive={currentTime >= SCENE_TIMING.cta.start}
        />
      </div>

      {/* Timeline bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-3 gap-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
      >
        {/* Progress track */}
        <div
          className="flex-1 h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${timelineProgress * 100}%`,
              background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-amber))',
            }}
          />
        </div>

        {/* Timestamp */}
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
```

---

### Task 6: Update handleApply Function

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace handleApply**

Replace the entire handleApply function with:

```tsx
const handleTryIt = () => {
  if (phase === 'done') {
    // Reset
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
```

---

### Task 7: Update Terminal Prompt

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Update prompt text**

Find the terminal prompt section and update the text content:

```tsx
<p style={{ color: "var(--text-primary)" }}>
  Create a promo video for my{" "}
  <span
    className="px-1.5 py-0.5 rounded font-medium"
    style={{
      background: "var(--glow-purple)",
      color: "var(--accent-purple)",
    }}
  >
    product launch
  </span>
</p>
```

---

### Task 8: Update Action Bar and Button

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Update status text**

Replace status text with:

```tsx
<p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
  {phase === 'done' ? "Video rendered" : "Static frames"}
</p>
<p className="text-xs" style={{ color: "var(--text-muted)" }}>
  {phase === 'done' ? "3-scene composition" : "No animation"}
</p>
```

**Step 2: Update button**

Change `onClick={handleApply}` to `onClick={handleTryIt}`.

Update button disabled state:
```tsx
disabled={phase === 'playing'}
```

Update button styling conditions - replace `isApplied` with `phase === 'done'` and `isAnimating` with `phase === 'playing'`.

Update button text:
```tsx
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
```

---

### Task 9: Replace Main Content Area

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Remove old HeadlinePanel components and imports**

Delete the AnimatedWord component (lines 14-66).
Delete the HeadlinePanel component (lines 68-207).
Delete the HeadlinePanelProps interface.
Delete the AnimatedWordProps interface.

**Step 2: Replace the side-by-side section**

Replace the `{/* Side-by-side headline comparison */}` section with:

```tsx
{/* Video Player */}
<VideoPlayer
  currentTime={currentTime}
  isPlaying={phase === 'playing'}
  isComplete={phase === 'done'}
/>
```

---

### Task 10: Update Result Indicator

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace result indicator**

Replace the result indicator section with:

```tsx
{/* Result indicator */}
<div
  className="mt-4 flex items-center justify-center gap-4 py-3 rounded-xl transition-all duration-500"
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
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Sequenced scenes
        </span>
      </div>
      <div className="w-px h-4" style={{ background: "var(--border-subtle)" }} />
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Spring physics
        </span>
      </div>
      <div className="w-px h-4" style={{ background: "var(--border-subtle)" }} />
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          3s runtime
        </span>
      </div>
    </>
  )}
</div>
```

---

### Task 11: Test and Verify

**Step 1: Run dev server**

```bash
cd /Users/slobo/Documents/coding/stashmd/site && npm run dev
```

**Step 2: Verify in browser**

Open http://localhost:3000 and test:
- [ ] Video player shows 16:9 container with dark gradient
- [ ] Timeline at bottom shows "0:00 / 0:03"
- [ ] Click "Try it" - logo fades in and scales
- [ ] Logo fades out, headline words stagger in
- [ ] "prove themselves" punches with scale overshoot
- [ ] Shimmer sweeps across gold text
- [ ] CTA slides up with spring bounce and glow pulse
- [ ] Timeline fills left to right over 3 seconds
- [ ] Timestamp counts up: 0:01, 0:02, 0:03
- [ ] Gold border appears around player when done
- [ ] "Try again" resets to idle state

---

### Task 12: Commit

**Step 1: Stage and commit**

```bash
git add app/components/RemotonDemo.tsx docs/plans/
git commit -m "replace remotion demo with video player composition

- 3-scene video: logo fade, headline punch, cta slide
- timeline bar with timestamp
- 16:9 aspect ratio, looks like real video output"
```
