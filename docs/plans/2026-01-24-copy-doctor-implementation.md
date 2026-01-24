# Copy Doctor Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add copy-doctor skill with word surgery animation showing track-changes style editing.

**Architecture:** New CopyDoctorDemo component with staggered per-line animations. Each line shows strike-through on old text with gold replacement appearing above. Uses requestAnimationFrame for smooth timing like CodeSimplifierDemo.

**Tech Stack:** React, TypeScript, CSS animations, requestAnimationFrame

---

## Task 1: Add copy-doctor to SKILLS array and types

**Files:**
- Modify: `app/page.tsx:10` (SkillId type)
- Modify: `app/page.tsx:23-54` (SKILLS array)

**Step 1: Update SkillId type**

Change line 10 from:
```typescript
type SkillId = "frontend-design" | "code-simplifier" | "remotion";
```
to:
```typescript
type SkillId = "frontend-design" | "code-simplifier" | "remotion" | "copy-doctor";
```

**Step 2: Add copy-doctor to SKILLS array**

After the remotion entry (line 53), add:
```typescript
  {
    id: "copy-doctor",
    name: "copy-doctor",
    description: "Words that sell.",
    icon: "✂",
    isOfficial: false,
    githubUrl: "https://github.com/slobo/skills",
    repoUrl: "https://github.com/slobo/skills",
    installs: "1.2k",
  },
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds (demo component not wired yet, that's ok)

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "add copy-doctor to skills array"
```

---

## Task 2: Create CopyDoctorDemo component skeleton

**Files:**
- Create: `app/components/CopyDoctorDemo.tsx`

**Step 1: Create the component file**

```typescript
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

const BEFORE_WORDS = TRANSFORMS.reduce((sum, t) => sum + t.before.split(/\s+/).length, 0);
const AFTER_WORDS = TRANSFORMS.reduce((sum, t) => sum + t.after.split(/\s+/).length, 0);
const REDUCTION = Math.round((1 - AFTER_WORDS / BEFORE_WORDS) * 100);

type LineState = "pending" | "highlighting" | "striking" | "replacing" | "complete";

export function CopyDoctorDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lineStates, setLineStates] = useState<LineState[]>(
    TRANSFORMS.map(() => "pending")
  );

  const animationRef = useRef<number | null>(null);

  const handleApply = () => {
    if (isApplied) {
      // Reset
      setIsApplied(false);
      setLineStates(TRANSFORMS.map(() => "pending"));
      return;
    }

    setIsAnimating(true);
    // Animation logic will be added in Task 3

    // Placeholder: immediately complete
    setLineStates(TRANSFORMS.map(() => "complete"));
    setIsApplied(true);
    setIsAnimating(false);
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
              {isApplied ? "Surgery complete" : "Before surgery"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {isApplied ? "Cut ruthlessly" : `${BEFORE_WORDS} words of copy`}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
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
          {TRANSFORMS.map((transform, idx) => (
            <div key={idx} className="relative">
              {/* Replacement text (above) */}
              <div
                className="mb-1 transition-all duration-400"
                style={{
                  opacity: lineStates[idx] === "complete" ? 1 : 0,
                  transform: lineStates[idx] === "complete" ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <span
                  className="text-lg font-medium"
                  style={{
                    color: "var(--accent-gold)",
                    textShadow: "0 0 20px var(--glow-gold)",
                  }}
                >
                  {transform.after}
                </span>
              </div>

              {/* Original text (struck) */}
              <div className="relative">
                <span
                  className="text-base leading-relaxed transition-all duration-300"
                  style={{
                    color: lineStates[idx] === "complete"
                      ? "rgba(239, 68, 68, 0.5)"
                      : "var(--text-secondary)",
                    textDecoration: lineStates[idx] === "complete" ? "line-through" : "none",
                    textDecorationColor: "#ef4444",
                  }}
                >
                  &ldquo;{transform.before}&rdquo;
                </span>
              </div>
            </div>
          ))}
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
            <div className="flex items-center gap-2">
              <span
                className="text-sm italic"
                style={{ color: "var(--text-muted)" }}
              >
                &ldquo;Cut ruthlessly&rdquo;
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
```

**Step 2: Verify file created**

Run: `ls app/components/CopyDoctorDemo.tsx`
Expected: File exists

**Step 3: Commit**

```bash
git add app/components/CopyDoctorDemo.tsx
git commit -m "add copy-doctor demo component skeleton"
```

---

## Task 3: Wire up CopyDoctorDemo in page.tsx

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add import**

After line 6 (`import { RemotonDemo }`), add:
```typescript
import { CopyDoctorDemo } from "./components/CopyDoctorDemo";
```

**Step 2: Add conditional render**

After line 216 (`{activeSkill === "remotion" && (<RemotonDemo />)}`), add:
```typescript
                {activeSkill === "copy-doctor" && (
                  <CopyDoctorDemo />
                )}
```

**Step 3: Update grid to 4 columns**

Change line 122 from:
```typescript
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
```
to:
```typescript
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

**Step 4: Verify**

Run: `npm run dev`
Expected: Site loads, copy-doctor card appears, clicking it shows the demo

**Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "wire up copy-doctor demo in page"
```

---

## Task 4: Add staggered surgery animation

**Files:**
- Modify: `app/components/CopyDoctorDemo.tsx`

**Step 1: Replace the handleApply function**

Replace the existing `handleApply` function with:

```typescript
  const handleApply = () => {
    if (isApplied) {
      // Reset
      setIsApplied(false);
      setLineStates(TRANSFORMS.map(() => "pending"));
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
```

**Step 2: Add strike-through progress state**

After the `lineStates` useState, add:
```typescript
  const [strikeProgress, setStrikeProgress] = useState<number[]>(
    TRANSFORMS.map(() => 0)
  );
```

**Step 3: Update animation to track strike progress**

In the animate function, after setting newStates, add:
```typescript
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
```

**Step 4: Update the reset to clear strike progress**

In the reset block, add:
```typescript
      setStrikeProgress(TRANSFORMS.map(() => 0));
```

**Step 5: Verify**

Run: `npm run dev`
Expected: Clicking "Try it" animates through lines one at a time

**Step 6: Commit**

```bash
git add app/components/CopyDoctorDemo.tsx
git commit -m "add staggered surgery animation timing"
```

---

## Task 5: Add animated strike-through line

**Files:**
- Modify: `app/components/CopyDoctorDemo.tsx`

**Step 1: Update the original text render**

Replace the "Original text (struck)" div with:
```typescript
              {/* Original text with animated strike-through */}
              <div className="relative inline-block">
                <span
                  className="text-base leading-relaxed transition-colors duration-300"
                  style={{
                    color: lineStates[idx] === "complete" || lineStates[idx] === "striking" || lineStates[idx] === "replacing"
                      ? "rgba(239, 68, 68, 0.5)"
                      : lineStates[idx] === "highlighting"
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    background: lineStates[idx] === "highlighting"
                      ? "rgba(251, 191, 36, 0.15)"
                      : "transparent",
                    padding: lineStates[idx] === "highlighting" ? "0 4px" : "0",
                    borderRadius: "4px",
                  }}
                >
                  &ldquo;{transform.before}&rdquo;
                </span>
                {/* Animated strike-through line */}
                <div
                  className="absolute left-0 top-1/2 h-0.5 bg-red-500 pointer-events-none"
                  style={{
                    width: `${strikeProgress[idx] * 100}%`,
                    transform: "translateY(-50%)",
                    opacity: strikeProgress[idx] > 0 ? 1 : 0,
                  }}
                />
              </div>
```

**Step 2: Verify**

Run: `npm run dev`
Expected: Strike-through line animates across text during surgery

**Step 3: Commit**

```bash
git add app/components/CopyDoctorDemo.tsx
git commit -m "add animated strike-through line effect"
```

---

## Task 6: Polish replacement text animation

**Files:**
- Modify: `app/components/CopyDoctorDemo.tsx`

**Step 1: Update replacement text visibility logic**

Replace the "Replacement text (above)" div with:
```typescript
              {/* Replacement text (above) */}
              <div
                className="mb-1 transition-all duration-400 ease-out"
                style={{
                  opacity: lineStates[idx] === "replacing" || lineStates[idx] === "complete" ? 1 : 0,
                  transform: lineStates[idx] === "replacing" || lineStates[idx] === "complete"
                    ? "translateY(0)"
                    : "translateY(8px)",
                  height: lineStates[idx] === "replacing" || lineStates[idx] === "complete" ? "auto" : 0,
                  overflow: "hidden",
                }}
              >
                <span
                  className="text-lg font-medium inline-block"
                  style={{
                    color: "var(--accent-gold)",
                    textShadow: lineStates[idx] === "complete" ? "0 0 20px var(--glow-gold)" : "none",
                  }}
                >
                  {transform.after}
                </span>
              </div>
```

**Step 2: Verify**

Run: `npm run dev`
Expected: Replacement text fades in smoothly above struck text

**Step 3: Commit**

```bash
git add app/components/CopyDoctorDemo.tsx
git commit -m "polish replacement text animation"
```

---

## Task 7: Test and final commit

**Step 1: Full test**

Run: `npm run dev`
Test:
- [ ] Click copy-doctor card - demo appears
- [ ] Click "Try it" - animation runs through 3 lines
- [ ] Each line: highlights → strikes → replacement appears
- [ ] Stats bar shows word reduction after complete
- [ ] Click "Try again" - resets to initial state
- [ ] Animation timing feels good (~4.5s total)

**Step 2: Build check**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Final commit**

```bash
git add -A
git commit -m "complete copy-doctor demo with word surgery animation"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add copy-doctor to SKILLS array |
| 2 | Create CopyDoctorDemo component skeleton |
| 3 | Wire up in page.tsx |
| 4 | Add staggered animation timing |
| 5 | Add animated strike-through line |
| 6 | Polish replacement text animation |
| 7 | Test and final commit |

**Total estimated implementation:** ~30 minutes
