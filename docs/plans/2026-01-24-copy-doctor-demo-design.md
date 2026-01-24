# Copy Doctor Demo Design

## The Transformation

**Core tension:** Weak copy → Punchy copy

**Metaphor:** Word surgery (track changes style)

**What makes someone say "I need this":** Seeing verbose, feature-focused copy get surgically reduced to tight, benefit-driven messaging in real-time.

---

## Content

Three real transformations from this project:

| # | Before | After | Words |
|---|--------|-------|-------|
| 1 | "See the difference before you install. Every skill demos its own transformation." | "Demo first. Install second." | 14→4 |
| 2 | "Refine code for clarity and maintainability without changing behavior." | "Less code is better code." | 9→5 |
| 3 | "Best practices for video creation in React. Avoid common pitfalls." | "Motion moves people." | 10→3 |

**Total reduction:** 33 → 12 words (-64%)

---

## Animation Sequence

### Overall Flow

```
[Show all 3 "before" lines stacked]
     ↓
[Line 1: surgery animation]
     ↓
[Line 2: surgery animation]
     ↓
[Line 3: surgery animation]
     ↓
[Stats bar reveals]
```

### Per-Line Surgery Animation

```
Phase 1: Highlight (0.3s)
   └─ Weak words get subtle background highlight (amber glow)
   └─ Signals "these are the problem areas"

Phase 2: Strike-through sweep (0.5s)
   └─ Red/muted strike-through animates left-to-right
   └─ Uses clip-path or width animation for sweep effect
   └─ Struck text color fades to muted

Phase 3: Replacement appears (0.4s)
   └─ Gold text fades in ABOVE the struck line
   └─ Slight upward motion (translateY) for polish
   └─ Gold glow on new text

Phase 4: Pause (0.3s)
   └─ Let user read the change before next line
```

**Timing per line:** ~1.5s
**Total animation:** ~4.5s + stats reveal

---

## Visual Treatment

### Before State (idle)

```
┌─────────────────────────────────────────────────────────────┐
│ ● ● ●  copy-doctor                                          │
├─────────────────────────────────────────────────────────────┤
│ ❯ Review this landing page copy                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ○ Before surgery                                    [Try it]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ "See the difference before you install. Every skill demos  │
│  its own transformation."                                   │
│                                                             │
│ "Refine code for clarity and maintainability without       │
│  changing behavior."                                        │
│                                                             │
│ "Best practices for video creation in React. Avoid common  │
│  pitfalls."                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### After Surgery (complete)

```
┌─────────────────────────────────────────────────────────────┐
│ ✓ Surgery complete                              [Try again] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Demo first. Install second.      [GOLD]  │
│ "See the difference before you install. Every skill demos  │
│  its own transformation."                           [STRUCK]│
│                                                             │
│                    Less code is better code.        [GOLD]  │
│ "Refine code for clarity and maintainability without       │
│  changing behavior."                                [STRUCK]│
│                                                             │
│                    Motion moves people.             [GOLD]  │
│ "Best practices for video creation in React. Avoid common  │
│  pitfalls."                                         [STRUCK]│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│      33 words        →        12 words        -64%          │
│                      "Cut ruthlessly"                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Color Palette

| Element | Color | CSS Variable |
|---------|-------|--------------|
| Struck text | Muted red | `rgba(239, 68, 68, 0.6)` |
| Strike-through line | Red | `#ef4444` |
| Replacement text | Gold | `var(--accent-gold)` |
| Replacement glow | Gold glow | `var(--glow-gold)` |
| Highlight (phase 1) | Amber | `rgba(251, 191, 36, 0.15)` |

---

## Stats Bar

Appears after all surgery complete:

- **Word count:** "33 → 12 words"
- **Reduction:** "-64%" (in green)
- **Principle:** "Cut ruthlessly" (muted, italic)

---

## Component Structure

```tsx
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
```

### State Machine

```
idle → animating (line 0) → animating (line 1) → animating (line 2) → done
  ↑                                                                      │
  └──────────────────────── reset ───────────────────────────────────────┘
```

### Animation State Per Line

```typescript
type LineState = 'pending' | 'highlighting' | 'striking' | 'replacing' | 'complete';
```

---

## Implementation Notes

1. **No Remotion** - This is a DOM animation, not video. Use requestAnimationFrame like CodeSimplifierDemo.

2. **Staggered timing** - Each line waits for previous to complete before starting.

3. **Strike-through effect** - Use a pseudo-element or separate div with `scaleX(0)` → `scaleX(1)` animation, `transform-origin: left`.

4. **Replacement positioning** - Absolute positioned above the struck line, centered or left-aligned to match.

5. **Quote marks** - Keep the quotes on the before text to show it's copy being reviewed.

---

## Success Criteria

- [ ] Surgery animation clearly shows what's being cut
- [ ] Replacement text is obviously better (shorter, punchier)
- [ ] Stats reinforce the value (64% reduction)
- [ ] Animation feels satisfying, not rushed
- [ ] 2-second rule: value obvious immediately after animation
