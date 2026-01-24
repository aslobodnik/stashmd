# Remotion Demo: Side-by-Side Motion Comparison

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace code-focused demo with visual proof - show static vs. animated headline side-by-side.

**Architecture:** Two panels showing the same headline. Left appears instantly (static). Right has choreographed motion (slide+fade, scale punch, shimmer). User sees the impact of motion directly.

**Tech Stack:** React, CSS transitions, requestAnimationFrame for shimmer effect

---

## Layout

Standard skill demo wrapper (terminal prompt, status bar, Apply skill button) stays consistent. The creative viewport replaces code blocks with side-by-side headline panels.

```
┌─────────────────────────────────────────────────────────┐
│  Terminal: "Create an animated headline for my          │
│            Remotion component"                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│  Without motion         │  │  With motion            │
├─────────────────────────┤  ├─────────────────────────┤
│                         │  │                         │
│  AI skills that         │  │  AI skills that         │
│  prove themselves       │  │  prove themselves ✨    │
│                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘

[Status indicator]                    [Apply skill / Try again]
```

---

## Animation Sequence

**On "Apply skill" click:**

### Left Panel (Without motion)
- Text instantly appears, fully visible at t=0
- Static. No movement.

### Right Panel (With motion)

| Time | Element | Animation |
|------|---------|-----------|
| 0-400ms | "AI" | Slide up 20px + fade in |
| 150-550ms | "skills" | Slide up 20px + fade in (overlapped) |
| 300-700ms | "that" | Slide up 20px + fade in |
| 600ms | - | Brief pause (anticipation) |
| 700-1000ms | "prove themselves" | Scale 0% → 110% → 100% (overshoot bounce) |
| 1000-1400ms | "prove themselves" | Gold shimmer sweeps left → right |

**Easing:**
- Slide+fade: ease-out (fast start, gentle land)
- Scale punch: cubic-bezier for overshoot bounce
- Shimmer: linear sweep

---

## Visual Styling

### Typography
- "AI skills that" - Instrument Serif, white (#fafaf9), regular
- "prove themselves" - Instrument Serif, **italic**, gold (#fbbf24)

### Panel Treatment

**Left panel:**
- Background: var(--bg-deep)
- Border: 1px solid var(--border-subtle)
- Intentionally flat/static feeling

**Right panel:**
- Background: var(--bg-deep)
- Border: 1px solid var(--border-subtle) → gold on completion
- Box-shadow: gold glow when complete

### Shimmer Effect
```css
/* Pseudo-element with animated gradient mask */
background: linear-gradient(
  90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.4) 50%,
  transparent 100%
);
background-size: 200% 100%;
animation: shimmer 400ms ease-out forwards;

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
```

---

## State Management

```tsx
const [isApplied, setIsApplied] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);
const [animationPhase, setAnimationPhase] = useState<
  'idle' | 'words' | 'punch' | 'shimmer' | 'done'
>('idle');
```

**Phases:**
1. `idle` - Both panels empty/placeholder
2. `words` - "AI skills that" sliding in (0-700ms)
3. `punch` - "prove themselves" scale bounce (700-1000ms)
4. `shimmer` - Gold shimmer sweep (1000-1400ms)
5. `done` - Complete, show gold border

---

## Why This Design Works

1. **Shows, doesn't tell** - No "won't render" badges needed. You SEE the difference.
2. **Uses familiar copy** - The site's own headline, so users recognize it
3. **Meta proof** - "prove themselves" literally proves itself with fancy animation
4. **Undeniable contrast** - Static vs. motion, same words, completely different impact
5. **Matches Remotion's purpose** - It's a video tool; we show video-worthy motion
