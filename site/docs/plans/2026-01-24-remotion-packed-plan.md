# Remotion Packed Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 3-second demo with a 6-second packed promo featuring terminal typing, multiple transitions, and overwhelming visual energy.

**Architecture:** Same VideoPlayer container, but with new scene components and transitions. Total duration 6000ms with 6 scenes and 5 transitions.

**Tech Stack:** React, useState, useRef, requestAnimationFrame, CSS transforms

---

## Tasks

### Task 1: Update Constants and Timing

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Update duration and scene timing**

Replace the existing constants at the top:

```tsx
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
```

---

### Task 2: Create TerminalScene Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add TerminalScene**

Replace LogoScene with TerminalScene (we'll add new LogoScene later):

```tsx
function TerminalScene({ progress, isActive }: SceneProps) {
  // 0-0.17: fade in terminal
  // 0.17-0.83: type command
  // 0.83-1: cursor blinks

  const terminalOpacity = Math.min(progress * 6, 1); // fade in first ~17%

  // Calculate how many characters to show
  const typeProgress = Math.max(0, Math.min((progress - 0.17) / 0.66, 1));
  const charsToShow = Math.floor(typeProgress * TERMINAL_COMMAND.length);
  const displayedCommand = TERMINAL_COMMAND.slice(0, charsToShow);

  // Cursor blink (every 400ms = ~0.067 of 6000ms scene... but we're in 1200ms scene)
  const cursorVisible = Math.floor(progress * 6) % 2 === 0;

  if (!isActive) return null;

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
          width: '80%',
          maxWidth: '500px',
        }}
      >
        {/* Terminal header */}
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

        {/* Terminal content */}
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
```

---

### Task 3: Create PixelDissolve Transition

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add PixelDissolve component**

```tsx
function PixelDissolve({ progress, isActive }: SceneProps) {
  if (!isActive || progress <= 0) return null;

  // Create grid of "pixels" that fade out at random times
  const gridSize = 12;
  const pixels = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Each pixel fades at a "random" time based on position
      const seed = (x * 7 + y * 13) % 17;
      const fadeStart = seed / 17;
      const pixelOpacity = Math.max(0, 1 - (progress - fadeStart) * 3);

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
```

---

### Task 4: Create New LogoScene Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace the old LogoScene with character cascade version**

```tsx
function LogoScene({ progress, isActive }: SceneProps) {
  const logoText = 'stash';
  const extText = '.md';
  const allChars = logoText + extText;

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-5xl font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
        {allChars.split('').map((char, i) => {
          // Stagger: each char starts 0.07 later (8 chars over ~0.56 of progress)
          const charStart = i * 0.07;
          const charProgress = Math.max(0, Math.min((progress - charStart) / 0.3, 1));

          // Bouncy spring simulation
          const bounce = charProgress < 1
            ? Math.sin(charProgress * Math.PI * 2) * (1 - charProgress) * 0.3
            : 0;

          const translateY = (1 - charProgress) * 40 + bounce * 20;
          const rotate = (1 - charProgress) * -15;
          const opacity = Math.min(charProgress * 2, 1);

          const isGold = i >= logoText.length; // .md part

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
```

---

### Task 5: Create ZoomPunch Overlay

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add ZoomPunch component**

```tsx
function ZoomPunch({ progress, isActive }: SceneProps) {
  if (!isActive) return 1;

  // 0-0.5: scale up to 1.15
  // 0.5-1: scale back to 1
  let scale = 1;
  if (progress < 0.5) {
    scale = 1 + (progress / 0.5) * 0.15;
  } else {
    scale = 1.15 - ((progress - 0.5) / 0.5) * 0.15;
  }

  return scale;
}
```

Note: This returns a scale value, not JSX. We'll apply it to the container.

---

### Task 6: Update HeadlineScene with Character Cascade

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace HeadlineScene with enhanced version**

```tsx
function HeadlineScene({ progress, isActive }: SceneProps) {
  const line1 = 'AI skills that';
  const line2 = 'prove themselves';

  if (!isActive) return null;

  // Timeline:
  // 0-0.4: line1 characters cascade from top
  // 0.4-0.45: pause
  // 0.45-0.7: line2 scale punch
  // 0.7-1: highlight wipe

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Line 1: Characters rain from top */}
      <div
        className="text-3xl mb-2 text-center"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {line1.split('').map((char, i) => {
          const charStart = i * 0.025; // stagger over 0-0.35
          const charProgress = Math.max(0, Math.min((progress - charStart) / 0.15, 1));

          const translateY = (1 - charProgress) * -30;
          const opacity = charProgress;

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
          // Punch animation (0.45-0.7)
          let scale = 0;
          let opacity = 0;
          if (progress >= 0.45) {
            const punchProgress = Math.min((progress - 0.45) / 0.25, 1);
            opacity = Math.min(punchProgress * 3, 1);
            // Overshoot
            if (punchProgress < 0.6) {
              scale = (punchProgress / 0.6) * 1.2;
            } else {
              scale = 1.2 - ((punchProgress - 0.6) / 0.4) * 0.2;
            }
          }

          // Highlight wipe (0.7-1)
          const highlightProgress = progress >= 0.7
            ? (progress - 0.7) / 0.3
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
              {/* Highlight bar behind text */}
              <span
                className="absolute inset-0 -z-10 rounded"
                style={{
                  background: 'var(--accent-gold)',
                  opacity: 0.2,
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
```

---

### Task 7: Create SlideTransition Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add SlideTransition**

```tsx
function SlideTransition({ progress }: SceneProps) {
  // Returns translateY offset for current content sliding out
  // and next content sliding in
  return {
    outY: -progress * 100, // slides up and out
    outOpacity: 1 - progress,
    inY: (1 - progress) * 100, // slides up from below
    inOpacity: progress,
  };
}
```

Note: This returns values, not JSX. We'll use it in VideoPlayer.

---

### Task 8: Create FeatureCards Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add FeatureCards**

```tsx
const FEATURES = ['Spring physics', 'Character cascade', 'Scene transitions'];

function FeatureCards({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4">
      {FEATURES.map((feature, i) => {
        // Each card flips in with 0.22 stagger
        const cardStart = i * 0.22;
        const cardProgress = Math.max(0, Math.min((progress - cardStart) / 0.25, 1));

        // Flip animation (rotateY from -90 to 0)
        const rotateY = (1 - cardProgress) * -90;
        const opacity = cardProgress;

        // Subtle float after flip
        const floatOffset = cardProgress >= 1
          ? Math.sin((progress - cardStart - 0.25) * 10) * 3
          : 0;

        return (
          <div
            key={feature}
            className="px-4 py-3 rounded-lg text-center"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderBottom: '2px solid var(--accent-gold)',
              transform: `perspective(500px) rotateY(${rotateY}deg) translateY(${floatOffset}px)`,
              opacity,
              minWidth: '120px',
            }}
          >
            <span
              className="text-sm font-medium"
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
```

---

### Task 9: Create WhiteFlash Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add WhiteFlash**

```tsx
function WhiteFlash({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  // Flash up then down
  let opacity = 0;
  if (progress < 0.5) {
    opacity = progress * 2 * 0.8; // up to 0.8
  } else {
    opacity = (1 - progress) * 2 * 0.8; // back down
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'white',
        opacity,
      }}
    />
  );
}
```

---

### Task 10: Update CTAScene with Heavy Spring

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace CTAScene**

```tsx
function CTAScene({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  // 0-0.5: slide up with heavy spring (overshoot)
  // 0.5-0.75: first glow pulse
  // 0.75-1: second glow pulse

  let translateY = 60;
  let opacity = 0;

  if (progress > 0) {
    opacity = Math.min(progress * 4, 1);

    // Heavy spring slide
    if (progress < 0.5) {
      const springProgress = progress / 0.5;
      // Overshoot to -8, then settle
      translateY = 60 * (1 - springProgress * 1.15);
      if (translateY < -8) {
        translateY = -8 + (springProgress - 0.43) * 20;
      }
    } else {
      translateY = 0;
    }
  }

  // Glow pulses
  let glowIntensity = 0;
  if (progress >= 0.5 && progress < 0.75) {
    glowIntensity = Math.sin(((progress - 0.5) / 0.25) * Math.PI);
  } else if (progress >= 0.75 && progress < 1) {
    glowIntensity = Math.sin(((progress - 0.75) / 0.25) * Math.PI);
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
            ? `0 0 ${30 * glowIntensity}px var(--glow-gold)`
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

### Task 11: Create EndCard Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add EndCard**

```tsx
function EndCard({ progress, isActive }: SceneProps) {
  if (!isActive) return null;

  // Shimmer sweep across frame
  const shimmerX = progress * 150 - 25; // -25% to 125%

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background: `linear-gradient(90deg,
          transparent ${shimmerX - 20}%,
          rgba(251, 191, 36, 0.1) ${shimmerX}%,
          transparent ${shimmerX + 20}%
        )`,
      }}
    />
  );
}
```

---

### Task 12: Update VideoPlayer to Orchestrate All Scenes

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Rewrite VideoPlayer component**

```tsx
function VideoPlayer({ currentTime, isPlaying, isComplete }: VideoPlayerProps) {
  const getProgress = (scene: { start: number; end: number }) => {
    if (currentTime < scene.start) return 0;
    if (currentTime > scene.end) return 1;
    return (currentTime - scene.start) / (scene.end - scene.start);
  };

  const isInScene = (scene: { start: number; end: number }) => {
    return currentTime >= scene.start && currentTime <= scene.end + 100;
  };

  // Get zoom punch scale
  const zoomScale = isInScene(SCENES.zoomPunch)
    ? (() => {
        const p = getProgress(SCENES.zoomPunch);
        return p < 0.5 ? 1 + (p / 0.5) * 0.15 : 1.15 - ((p - 0.5) / 0.5) * 0.15;
      })()
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
      {/* Scene container with zoom */}
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
          isActive={isInScene(SCENES.logo) && currentTime < SCENES.zoomPunch.end}
        />
        <HeadlineScene
          progress={getProgress(SCENES.headline)}
          isActive={isInScene(SCENES.headline) && currentTime < SCENES.slideTransition.end}
        />
        <FeatureCards
          progress={getProgress(SCENES.featureCards)}
          isActive={isInScene(SCENES.featureCards) && currentTime < SCENES.whiteFlash.end}
        />
        <CTAScene
          progress={getProgress(SCENES.cta)}
          isActive={currentTime >= SCENES.cta.start}
        />
      </div>

      {/* Overlay effects */}
      <WhiteFlash
        progress={getProgress(SCENES.whiteFlash)}
        isActive={isInScene(SCENES.whiteFlash)}
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
```

---

### Task 13: Update Prompt and Result Indicator

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Update terminal prompt text**

Find and update:
```tsx
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
```

**Step 2: Update result indicator**

Replace result indicator content:
```tsx
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
        6 scenes
      </span>
    </div>
    <div className="w-px h-4" style={{ background: "var(--border-subtle)" }} />
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        5 transitions
      </span>
    </div>
    <div className="w-px h-4" style={{ background: "var(--border-subtle)" }} />
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Character cascade
      </span>
    </div>
  </>
)}
```

---

### Task 14: Clean Up Old Components

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

Remove any old unused components:
- Old HEADLINE_INTRO, HEADLINE_PAYOFF constants (replaced with inline strings)
- Old SCENE_TIMING constant (replaced with SCENES)
- Any duplicate component definitions

---

### Task 15: Test and Commit

**Step 1: Verify in browser**

Test at http://localhost:3000:
- [ ] Terminal types command with blinking cursor
- [ ] Pixel dissolve transition works
- [ ] Logo characters cascade with bounce
- [ ] Zoom punch effect visible
- [ ] Headline characters rain from top
- [ ] Highlight wipe on "prove themselves"
- [ ] Feature cards flip in sequentially
- [ ] White flash transition
- [ ] CTA slides up with glow pulses
- [ ] End shimmer sweep
- [ ] Timeline shows 0:06 total
- [ ] Gold border on completion

**Step 2: Commit**

```bash
git add app/components/RemotonDemo.tsx docs/plans/
git commit -m "packed 6-second remotion demo with terminal, transitions, character cascade

- terminal typing with cursor blink
- pixel dissolve, zoom punch, slide, flash transitions
- character cascade with bouncy springs
- feature cards with 3D flip
- highlight wipe effect"
```
