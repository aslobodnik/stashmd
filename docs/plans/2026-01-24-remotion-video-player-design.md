# Remotion Demo: Video Player with Multi-Scene Composition

**Goal:** Replace side-by-side text panels with a video player that shows a 3-scene promo video. Proves Remotion's value by looking like actual video output.

**Architecture:** Single video player container with timeline bar. Three scenes play in sequence: logo → headline → CTA. Animation is driven by requestAnimationFrame tracking elapsed time.

**Tech Stack:** React, useState, requestAnimationFrame, CSS transforms

---

## Layout

```
┌─────────────────────────────────────────────────────────┐
│  Terminal: "Create a promo video for my product launch" │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Video Content]                      │
│                                                         │
│                   16:9 aspect ratio                     │
│                   Dark gradient bg                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░    0:01/0:03 │
└─────────────────────────────────────────────────────────┘

[Status indicator]                         [Try it / Try again]
```

**Video container:**
- 16:9 aspect ratio
- Dark radial gradient background (darker edges, lighter center)
- Rounded corners (xl) with subtle border

**Timeline bar:**
- 4px height at bottom of video container
- Gold fill animates left→right as video plays
- Timestamp: "0:00 / 0:03" format, updates each second
- No interactive scrubber (visual only)

---

## Scene Breakdown

Total duration: 3000ms (3 seconds)

| Scene | Time | Content | Animation |
|-------|------|---------|-----------|
| **Logo** | 0-1000ms | "stash" wordmark | Fade in (0→1) + scale (0.95→1), ease-out |
| **Headline** | 800-2200ms | "AI skills that prove themselves" | Stagger words in, punch "prove themselves" with shimmer |
| **CTA** | 2000-3000ms | "See the demos →" pill button | Slide up with spring physics, gold glow pulse |

**Scene transitions:**
- Logo begins fading out at 800ms as headline starts (200ms overlap)
- Headline holds position while CTA slides in below
- Final frame (2500-3000ms): headline + CTA both visible as "end card"

---

## Visual Styling

### Typography

| Element | Font | Size | Color |
|---------|------|------|-------|
| Logo "stash" | Instrument Serif | 48px | white |
| "AI skills that" | Instrument Serif | 32px | white |
| "prove themselves" | Instrument Serif italic | 32px | gold (#fbbf24) |
| CTA button | IBM Plex Mono | 14px | gold with border |

### Background
- Radial gradient: `radial-gradient(ellipse at center, #1c1917 0%, #0c0a09 100%)`
- Optional: very subtle noise texture for depth

### Player Chrome
- Container: `bg-deep` with 1px `border-subtle`
- Timeline track: `bg-surface` (dark)
- Timeline fill: gold gradient, animates width 0%→100%
- Timestamp: `text-muted`, monospace

---

## States

### Idle (before click)
- Video shows static "freeze frame" - all elements visible but no animation
- Timeline at 0%, timestamp "0:00 / 0:03"
- Looks like a paused video thumbnail

### Playing (during animation)
- Timeline fills left→right over 3s
- Timestamp counts: 0:00 → 0:01 → 0:02 → 0:03
- Scenes animate in sequence
- Button disabled

### Done (after complete)
- Timeline full (100%)
- Timestamp "0:03 / 0:03"
- Gold border appears around video container
- Button shows "Try again"

---

## State Management

```tsx
type VideoPhase = 'idle' | 'playing' | 'done';

const [phase, setPhase] = useState<VideoPhase>('idle');
const [currentTime, setCurrentTime] = useState(0); // 0-3000ms
```

**Animation loop:**
```tsx
const handleTryIt = () => {
  setPhase('playing');
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    setCurrentTime(Math.min(elapsed, 3000));

    if (elapsed < 3000) {
      requestAnimationFrame(animate);
    } else {
      setPhase('done');
    }
  };

  requestAnimationFrame(animate);
};
```

---

## Scene Components

Each scene receives normalized progress (0→1) for its time window:

```tsx
function LogoScene({ progress }: { progress: number }) {
  // progress: 0→1 during 0-1000ms
  const opacity = Math.min(progress * 2, 1); // fade in first 500ms
  const scale = 0.95 + (progress * 0.05);    // 0.95 → 1
  // Also fade out: if progress > 0.8, start fading
  const fadeOut = progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1;

  return (
    <div style={{ opacity: opacity * fadeOut, transform: `scale(${scale})` }}>
      stash
    </div>
  );
}

function HeadlineScene({ progress }: { progress: number }) {
  // progress: 0→1 during 800-2200ms
  // Stagger "AI", "skills", "that" in first 40% (0-0.4)
  // Punch "prove themselves" from 0.4-0.7
  // Shimmer from 0.7-1.0
}

function CTAScene({ progress }: { progress: number }) {
  // progress: 0→1 during 2000-3000ms
  // Slide up with spring overshoot
  // Gold glow pulse at end
}
```

---

## Animation Details

### Logo (0-1000ms)
- Fade in: 0-500ms, ease-out
- Scale: 0.95→1, ease-out
- Hold: 500-800ms
- Fade out: 800-1000ms (overlaps with headline start)

### Headline (800-2200ms)
**Words stagger (800-1400ms):**
- "AI" at 800ms
- "skills" at 950ms
- "that" at 1100ms
- Each: translateY 20→0, opacity 0→1, 300ms duration

**Punch (1400-1700ms):**
- "prove themselves" appears
- Scale: 0→1.15→1 with spring bounce
- Easing: custom spring curve

**Shimmer (1700-2100ms):**
- Gold gradient sweeps left→right across "prove themselves"
- Linear progress, 400ms duration

### CTA (2000-3000ms)
- Slide up: translateY 30→0
- Spring physics: overshoot to -5px, settle to 0
- Gold border glow: pulse once at 2800ms
- Final state: visible, stable

---

## Result Indicator

**Before (idle):**
"Static frames"

**After (done):**
"Sequenced scenes - Spring physics - 3s runtime"

(Three items separated by bullet/divider, matching existing pattern)

---

## Button Text

- Idle: "Try it"
- Playing: "Try it" (disabled)
- Done: "Try again"

---

## Why This Works

1. **Looks like video** - Player chrome + timeline makes it undeniably "video"
2. **Shows sequencing** - Three distinct scenes prove Remotion's composition value
3. **Twitter-ready** - 16:9 aspect ratio, would look great as a video thumbnail
4. **Self-referential** - The video promotes "stash" using Remotion techniques
5. **Clear contrast** - Idle state shows static thumbnail, playing shows choreographed motion
