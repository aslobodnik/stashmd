# Remotion Demo: Side-by-Side Motion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace code-focused Remotion demo with visual proof - side-by-side panels showing static vs. animated headline.

**Architecture:** Complete rewrite of RemotonDemo.tsx. Remove code blocks, add two headline panels. Left shows text instantly. Right animates with slide+fade for "AI skills that" and scale punch + shimmer for "prove themselves".

**Tech Stack:** React, useState, useEffect, requestAnimationFrame, CSS transitions

---

## Tasks

### Task 1: Strip Old Code and Set Up New State

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Remove old code**

Delete everything between line 5 and line 123 (highlightCode function, BEFORE_CODE, AFTER_CODE, Spark interface). We don't need code display anymore.

**Step 2: Update imports and add new state**

Replace the component start with:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";

// Animation phases
type AnimationPhase = 'idle' | 'words' | 'punch' | 'shimmer' | 'done';

// Words to animate
const WORDS_LINE1 = ['AI', 'skills', 'that'];
const WORDS_LINE2 = ['prove', 'themselves'];

export function RemotonDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');

  // Track which words are visible (for staggered reveal)
  const [visibleWords, setVisibleWords] = useState<number>(0);
  // Track scale for "prove themselves" (0 to 1.1 to 1)
  const [punchScale, setPunchScale] = useState(0);
  // Track shimmer progress (0 to 1)
  const [shimmerProgress, setShimmerProgress] = useState(0);

  const animationRef = useRef<number | null>(null);
```

---

### Task 2: Implement the Animation Handler

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add handleApply function**

After the state declarations, add:

```tsx
const handleApply = () => {
  if (isApplied) {
    // Reset
    setIsApplied(false);
    setAnimationPhase('idle');
    setVisibleWords(0);
    setPunchScale(0);
    setShimmerProgress(0);
    return;
  }

  setIsAnimating(true);
  setAnimationPhase('words');
  setVisibleWords(0);
  setPunchScale(0);
  setShimmerProgress(0);

  const totalWords = WORDS_LINE1.length; // 3 words
  const wordDuration = 150; // ms between words
  const pauseBeforePunch = 100; // ms
  const punchDuration = 300; // ms
  const shimmerDuration = 400; // ms

  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;

    // Phase 1: Words slide in (0-700ms)
    // Words at 0, 150, 300ms + 400ms each to complete = ~700ms total
    const wordsPhaseEnd = totalWords * wordDuration + 400;

    if (elapsed < wordsPhaseEnd) {
      const wordIndex = Math.min(
        Math.floor(elapsed / wordDuration) + 1,
        totalWords
      );
      setVisibleWords(wordIndex);
      setAnimationPhase('words');
    }
    // Phase 2: Punch (700-1000ms)
    else if (elapsed < wordsPhaseEnd + pauseBeforePunch + punchDuration) {
      setVisibleWords(totalWords);
      setAnimationPhase('punch');

      const punchElapsed = elapsed - wordsPhaseEnd - pauseBeforePunch;
      if (punchElapsed > 0) {
        const punchProgress = Math.min(punchElapsed / punchDuration, 1);
        // Overshoot: 0 -> 1.1 -> 1
        // Use a bounce curve
        const scale = punchProgress < 0.6
          ? (punchProgress / 0.6) * 1.1
          : 1.1 - (punchProgress - 0.6) / 0.4 * 0.1;
        setPunchScale(scale);
      }
    }
    // Phase 3: Shimmer (1000-1400ms)
    else if (elapsed < wordsPhaseEnd + pauseBeforePunch + punchDuration + shimmerDuration) {
      setAnimationPhase('shimmer');
      setPunchScale(1);

      const shimmerElapsed = elapsed - wordsPhaseEnd - pauseBeforePunch - punchDuration;
      setShimmerProgress(shimmerElapsed / shimmerDuration);
    }
    // Done
    else {
      setIsAnimating(false);
      setAnimationPhase('done');
      setIsApplied(true);
      setPunchScale(1);
      setShimmerProgress(1);
      return;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  animationRef.current = requestAnimationFrame(animate);
};
```

---

### Task 3: Create AnimatedWord Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add AnimatedWord component before RemotonDemo**

```tsx
interface AnimatedWordProps {
  word: string;
  isVisible: boolean;
  delay: number;
  isGold?: boolean;
  scale?: number;
  shimmerProgress?: number;
}

function AnimatedWord({
  word,
  isVisible,
  delay,
  isGold = false,
  scale = 1,
  shimmerProgress = 0
}: AnimatedWordProps) {
  return (
    <span
      className="inline-block transition-all duration-400 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(0) scale(${scale})`
          : 'translateY(20px) scale(0.95)',
        transitionDelay: `${delay}ms`,
        fontStyle: isGold ? 'italic' : 'normal',
        color: isGold ? 'var(--accent-gold)' : 'var(--text-primary)',
        position: 'relative',
      }}
    >
      {word}
      {/* Shimmer overlay for gold text */}
      {isGold && shimmerProgress > 0 && shimmerProgress < 1 && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg,
              transparent ${shimmerProgress * 100 - 30}%,
              rgba(255,255,255,0.4) ${shimmerProgress * 100}%,
              transparent ${shimmerProgress * 100 + 30}%
            )`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        />
      )}
    </span>
  );
}
```

---

### Task 4: Create HeadlinePanel Component

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Add HeadlinePanel component**

```tsx
interface HeadlinePanelProps {
  label: string;
  isAnimated: boolean;
  showContent: boolean;
  visibleWords: number;
  punchScale: number;
  shimmerProgress: number;
  isComplete: boolean;
}

function HeadlinePanel({
  label,
  isAnimated,
  showContent,
  visibleWords,
  punchScale,
  shimmerProgress,
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

      {/* Headline */}
      <div
        className="text-2xl leading-tight"
        style={{
          fontFamily: 'var(--font-serif)',
          minHeight: '4rem',
        }}
      >
        {isAnimated ? (
          // Animated version
          <>
            <div className="mb-1">
              {WORDS_LINE1.map((word, i) => (
                <span key={word}>
                  <AnimatedWord
                    word={word}
                    isVisible={showContent && visibleWords > i}
                    delay={0}
                    isGold={false}
                  />
                  {i < WORDS_LINE1.length - 1 && ' '}
                </span>
              ))}
            </div>
            <div>
              {WORDS_LINE2.map((word, i) => (
                <span key={word}>
                  <AnimatedWord
                    word={word}
                    isVisible={showContent && punchScale > 0}
                    delay={0}
                    isGold={true}
                    scale={punchScale}
                    shimmerProgress={shimmerProgress}
                  />
                  {i < WORDS_LINE2.length - 1 && ' '}
                </span>
              ))}
            </div>
          </>
        ) : (
          // Static version - just appears instantly
          <div style={{ opacity: showContent ? 1 : 0 }}>
            <div className="mb-1" style={{ color: 'var(--text-primary)' }}>
              {WORDS_LINE1.join(' ')}
            </div>
            <div style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
              {WORDS_LINE2.join(' ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Task 5: Update the Render JSX - Terminal and Action Bar

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Update the terminal prompt text**

Find the terminal prompt section and update the text:

```tsx
<div className="p-4 text-sm">
  <div className="flex items-start gap-2">
    <span style={{ color: "var(--accent-gold)" }}>❯</span>
    <p style={{ color: "var(--text-primary)" }}>
      Create an animated headline for my{" "}
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
```

**Step 2: Update status labels**

Change status text from "Best practice applied" / "CSS animation" to:

```tsx
<p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
  {isApplied ? "Motion applied" : "Without motion"}
</p>
<p className="text-xs" style={{ color: "var(--text-muted)" }}>
  {isApplied ? "Choreographed animation" : "Static text"}
</p>
```

---

### Task 6: Replace Code Viewport with Headline Panels

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace the entire code viewport section**

Delete from `{/* Code viewport with magic wand */}` through the closing div of that section (including all the code display, wand, sparks). Replace with:

```tsx
{/* Side-by-side headline comparison */}
<div className="flex gap-4">
  <HeadlinePanel
    label="Without motion"
    isAnimated={false}
    showContent={isAnimating || isApplied}
    visibleWords={0}
    punchScale={0}
    shimmerProgress={0}
    isComplete={isApplied}
  />
  <HeadlinePanel
    label="With motion"
    isAnimated={true}
    showContent={isAnimating || isApplied}
    visibleWords={visibleWords}
    punchScale={punchScale}
    shimmerProgress={shimmerProgress}
    isComplete={isApplied}
  />
</div>
```

---

### Task 7: Update the Result Indicator

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Replace result indicator content**

```tsx
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
```

---

### Task 8: Clean Up Unused Code

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Remove unused state and functions**

Delete these (if they still exist):
- `wandPosition` state
- `sparks` state
- `sparkIdRef` ref
- `colors` array
- `createSpark` callback
- `updateSparks` callback
- `renderSpark` function

**Step 2: Remove useCallback from imports if not used**

Change import to just:
```tsx
import { useState, useRef } from "react";
```

---

### Task 9: Test and Polish

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/RemotonDemo.tsx`

**Step 1: Verify in browser**

Run dev server and test:
- [ ] Click "Apply skill" - left panel shows text instantly, right animates
- [ ] Words slide up in sequence
- [ ] "prove themselves" punches in with overshoot
- [ ] Shimmer sweeps across gold text
- [ ] Right panel gets gold border on completion
- [ ] "Try again" resets properly

**Step 2: Adjust timing if needed**

Fine-tune these values based on feel:
- `wordDuration`: 150ms between words
- `punchDuration`: 300ms for scale animation
- `shimmerDuration`: 400ms for sweep

---

### Task 10: Commit

**Step 1: Stage and commit**

```bash
git add app/components/RemotonDemo.tsx
git commit -m "replace remotion demo with side-by-side motion comparison"
```
