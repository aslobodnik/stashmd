# Remotion Demo: 6-Second Packed Promo Video

**Goal:** Transform the current 3-second demo into a 6-second packed promo with terminal input, multiple scene transitions, and overwhelming visual energy.

**Architecture:** Same video player frame (16:9, timeline). 6 distinct scenes with 5 transitions between them. Every second has something happening.

**Tech Stack:** React, requestAnimationFrame, CSS transforms, no external libraries

---

## Scene Breakdown (6 seconds = 6000ms)

| Time | Scene | Content | Animation |
|------|-------|---------|-----------|
| 0-1200ms | Terminal | Fake terminal with typing command | Window fades in, characters type with cursor blink |
| 1200-1500ms | Transition 1 | Pixel dissolve | Terminal pixelates and fades |
| 1500-2200ms | Logo | "stash.md" (.md in gold) | Characters cascade with bouncy spring, slight rotation |
| 2200-2400ms | Transition 2 | Zoom punch | Scale 1→1.15→1 quick bounce |
| 2400-3400ms | Headline | "AI skills that prove themselves" | Characters rain from top, highlight wipe on payoff |
| 3400-3600ms | Transition 3 | Slide up | Content slides up and out |
| 3600-4500ms | Feature cards | 3 technique cards | Cards flip in sequentially |
| 4500-4700ms | Transition 4 | White flash | Quick opacity pulse |
| 4700-5500ms | CTA | "See the demos →" | Heavy spring slide up, glow pulse |
| 5500-6000ms | End card | Everything visible | Shimmer sweep, gold border |

---

## Scene Details

### Scene 1: Terminal (0-1200ms)

Fake macOS terminal window:
```
┌─────────────────────────────────────────┐
│ ● ● ●                        terminal   │
├─────────────────────────────────────────┤
│                                         │
│  $ npx remotion render --skill launch█  │
│                                         │
└─────────────────────────────────────────┘
```

**Animation:**
- 0-200ms: Terminal window fades in (opacity 0→1)
- 200-1000ms: Command types character-by-character (25ms per char)
- 1000-1200ms: Cursor blinks twice

**Styling:**
- Dark terminal bg: #1a1a1a
- Green prompt: #22c55e
- White text: #fafafa
- Cursor: block cursor, blinks every 400ms

---

### Transition 1: Pixel Dissolve (1200-1500ms)

Terminal breaks into pixels and fades:
- Overlay grid of 8x8px "pixels"
- Each pixel fades at random time within 300ms window
- Creates dissolve/disintegration effect

---

### Scene 2: Logo (1500-2200ms)

"stash" in white, ".md" in gold italic.

**Animation:**
- Each character springs in from below with rotation
- Stagger: 50ms between characters (8 chars = 400ms)
- Spring config: { damping: 8 } (bouncy)
- Each letter: translateY(40→0), rotate(-10→0), opacity(0→1)
- Hold for remaining time

---

### Transition 2: Zoom Punch (2200-2400ms)

Quick scale punch:
- 2200-2300ms: Scale 1 → 1.15
- 2300-2400ms: Scale 1.15 → 1
- Easing: ease-out

---

### Scene 3: Headline (2400-3400ms)

Two lines:
- "AI skills that" (white)
- "prove themselves" (gold italic)

**Animation timeline:**
- 2400-2800ms: "AI skills that" characters cascade from top
  - Each char: translateY(-30→0), opacity(0→1)
  - Stagger: 30ms per character
  - Spring: { damping: 12 }
- 2800-2850ms: Pause (anticipation)
- 2850-3100ms: "prove themselves" appears with scale punch (0→1.2→1)
- 3100-3400ms: Gold highlight wipe sweeps left→right behind text

---

### Transition 3: Slide Up (3400-3600ms)

Content slides up and out:
- translateY(0 → -100%), opacity(1→0)
- New content slides in from bottom: translateY(100% → 0)
- Easing: ease-in-out

---

### Scene 4: Feature Cards (3600-4500ms)

Three small cards showing techniques used:

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Spring     │ │  Character   │ │    Scene     │
│   physics    │ │   cascade    │ │ transitions  │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Animation:**
- Cards flip in sequentially (rotateY -90→0)
- Card 1: 3600-3800ms
- Card 2: 3800-4000ms (200ms delay)
- Card 3: 4000-4200ms (200ms delay)
- 4200-4500ms: Hold, subtle hover float

**Styling:**
- Dark card bg with subtle border
- Small text, muted color
- Gold accent line on bottom of each

---

### Transition 4: White Flash (4500-4700ms)

Quick flash transition:
- 4500-4600ms: White overlay opacity 0→0.8
- 4600-4700ms: White overlay opacity 0.8→0
- Creates "camera flash" effect

---

### Scene 5: CTA (4700-5500ms)

"See the demos →" button

**Animation:**
- 4700-5100ms: Slides up with heavy spring
  - translateY(60→-5→0)
  - Spring: { damping: 15, mass: 2 }
- 5100-5300ms: First glow pulse
- 5300-5500ms: Second glow pulse

**Styling:**
- Pill shape with gold border
- Gold text
- Glow: box-shadow pulses 0→20px→0

---

### Scene 6: End Card (5500-6000ms)

Everything settles:
- 5500-5800ms: Shimmer sweep across entire frame (left→right gradient)
- 5800-6000ms: Gold border fades in around video container

---

## Component Structure

```tsx
// Scene components
<TerminalScene progress={...} />      // 0-1200ms
<PixelDissolve progress={...} />      // 1200-1500ms
<LogoScene progress={...} />          // 1500-2200ms
<ZoomPunch progress={...} />          // 2200-2400ms (overlay effect)
<HeadlineScene progress={...} />      // 2400-3400ms
<SlideTransition progress={...} />    // 3400-3600ms
<FeatureCards progress={...} />       // 3600-4500ms
<WhiteFlash progress={...} />         // 4500-4700ms (overlay effect)
<CTAScene progress={...} />           // 4700-5500ms
<EndCard progress={...} />            // 5500-6000ms
```

---

## Updated UI

**Prompt:**
"Render my launch video with spring physics and scene transitions"

**Timeline:**
- Now 6 seconds total
- Timestamp: "0:00 / 0:06"

**Result indicator (after completion):**
"6 scenes • 5 transitions • Character cascade • Spring physics"

---

## Why This Works

1. **Overwhelming energy** - Something happens every 200-400ms
2. **Shows the workflow** - Terminal input → visual output
3. **Proves the techniques** - Feature cards literally list what was used
4. **Production value** - Multiple transition types = premium feel
5. **Twitter-ready** - Packed 6-second format perfect for social
