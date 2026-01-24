# Code Simplifier: Signal Clarifying Animation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the magic wand animation with a "noise dissolution" animation where unnecessary lines become static/glitchy and collapse away, naturally shrinking the code block.

**Architecture:** Each line of code will track whether it's "kept" or "removed". Removed lines progressively glitch (character scrambling, RGB split, scanlines) then collapse to zero height. The collapse happens incrementally during the animation, not as a separate phase afterward.

**Tech Stack:** React, CSS transitions, requestAnimationFrame for glitch effects

---

## Design Decisions

### Line Mapping Strategy
The before code has 63 lines, the after has 22. We need to map which before-lines "become" which after-lines and which ones dissolve away.

Approach: Define explicit line ranges that get removed vs transformed:
- Lines 1-4 (function signature + opacity/scale vars) → condense to lines 1-2
- Lines 6-40 (star branch) → dissolve completely, becomes SparkShapes.star (3 lines)
- Lines 42-58 (diamond branch) → dissolve, becomes SparkShapes.diamond (2 lines)
- Lines 60-76 (circle/default) → dissolve, becomes SparkShapes.circle (2 lines)
- Final return statement transforms

Simpler approach: Don't try to "morph" lines. Show all 63 lines, then specific lines get glitchy and collapse while others stay clean. After all collapses, swap to the new code block. The visual effect is: noise → collapse → clean result.

### Animation Phases

1. **Phase 1: Noise builds** (0-1.5s)
   - Lines marked for removal progressively get noisier
   - Noise effects: character jitter, RGB channel separation, scanline overlay, opacity flicker
   - Essential lines stay crystal clear (maybe even brighten slightly)

2. **Phase 2: Collapse cascade** (1.5s-3s)
   - Noisy lines collapse to 0 height in waves (top → bottom or scattered)
   - Each collapse is a smooth CSS transition (200-300ms per line)
   - Lines below slide up to fill gaps

3. **Phase 3: Crystallize** (3s-3.5s)
   - Remaining code snaps into the "after" version
   - Quick brightness pulse on the final code
   - Stats bar reveals

### Visual Effects Toolkit

**Character Scramble:**
```tsx
// Replace characters with random ASCII temporarily
const scramble = (char: string) => {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  return Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : char;
};
```

**RGB Split:**
```css
.glitching {
  text-shadow:
    -2px 0 rgba(255, 0, 0, 0.5),
    2px 0 rgba(0, 255, 255, 0.5);
}
```

**Scanlines:**
```css
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    transparent 0px,
    rgba(0, 0, 0, 0.3) 1px,
    transparent 2px
  );
  pointer-events: none;
}
```

**Collapse:**
```css
.collapsing {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 300ms ease-out, opacity 200ms ease-out;
}
```

---

## Tasks

### Task 1: Define Line Categories

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Add line categorization**

At the top of the file (after the BEFORE_CODE and AFTER_CODE constants), add:

```tsx
// Lines that will be removed (0-indexed)
// These are the lines that dissolve into noise
const REMOVED_LINES = new Set([
  // The star branch (lines 5-27 in the before code)
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  // The diamond branch (lines 29-45)
  29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  // The circle/default return (lines 47-62)
  47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
]);

// Lines that stay but transform
const TRANSFORM_LINES = new Set([0, 1, 2, 3, 4, 28, 46, 62]);
```

**Step 2: Verify the line mapping is reasonable**

The key insight is we don't need perfect 1:1 mapping. We show:
- ~70% of lines getting noisy and collapsing (the removed ones)
- ~30% staying clean
- Then swap to the new code

---

### Task 2: Create Glitch Effect Components

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Add glitch utility function**

After the line categorization, add:

```tsx
// Glitch effect: scramble characters
function scrambleText(text: string, intensity: number): string {
  const glitchChars = '!@#$%^&*<>[]{}|/\\~';
  return text
    .split('')
    .map((char) => {
      if (char === ' ' || char === '\n') return char;
      if (Math.random() < intensity * 0.4) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    })
    .join('');
}
```

**Step 2: Add GlitchLine component**

```tsx
interface GlitchLineProps {
  children: React.ReactNode;
  originalText: string;
  noiseLevel: number; // 0-1
  isCollapsing: boolean;
  isCollapsed: boolean;
}

function GlitchLine({ children, originalText, noiseLevel, isCollapsing, isCollapsed }: GlitchLineProps) {
  const [scrambledText, setScrambledText] = useState(originalText);

  useEffect(() => {
    if (noiseLevel > 0) {
      const interval = setInterval(() => {
        setScrambledText(scrambleText(originalText, noiseLevel));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setScrambledText(originalText);
    }
  }, [noiseLevel, originalText]);

  return (
    <div
      className="leading-relaxed overflow-hidden transition-all duration-300"
      style={{
        maxHeight: isCollapsed ? 0 : isCollapsing ? 0 : '1.5em',
        opacity: isCollapsed ? 0 : isCollapsing ? 0 : 1,
        textShadow: noiseLevel > 0.3
          ? `${-noiseLevel * 3}px 0 rgba(255, 0, 0, ${noiseLevel * 0.7}), ${noiseLevel * 3}px 0 rgba(0, 255, 255, ${noiseLevel * 0.7})`
          : 'none',
        filter: noiseLevel > 0 ? `brightness(${1 + noiseLevel * 0.5})` : 'none',
      }}
    >
      {noiseLevel > 0.5 ? (
        <span style={{ color: 'var(--text-secondary)' }}>{scrambledText}</span>
      ) : (
        children
      )}
    </div>
  );
}
```

---

### Task 3: Add Animation State Management

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Update state in CodeSimplifierDemo**

Replace the existing state declarations with:

```tsx
export function CodeSimplifierDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'noise' | 'collapse' | 'done'>('idle');

  // Track noise level per line (0-1)
  const [lineNoiseMap, setLineNoiseMap] = useState<Map<number, number>>(new Map());
  // Track which lines are collapsing/collapsed
  const [collapsingLines, setCollapsingLines] = useState<Set<number>>(new Set());
  const [collapsedLines, setCollapsedLines] = useState<Set<number>>(new Set());

  const animationRef = useRef<number | null>(null);
```

**Step 2: Remove old wand/spark state**

Delete these lines (no longer needed):
- `const [wandPosition, setWandPosition] = useState(0);`
- `const [sparks, setSparks] = useState<Spark[]>([]);`
- `const sparkIdRef = useRef(0);`
- The entire `colors` array
- The `createSpark` callback
- The `updateSparks` callback
- The entire `renderSpark` function

---

### Task 4: Implement New Animation Logic

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Replace handleApply with new animation**

```tsx
const handleApply = () => {
  if (isApplied) {
    // Reset
    setIsApplied(false);
    setAnimationPhase('idle');
    setLineNoiseMap(new Map());
    setCollapsingLines(new Set());
    setCollapsedLines(new Set());
    return;
  }

  setIsAnimating(true);
  setAnimationPhase('noise');

  const removedLinesArray = Array.from(REMOVED_LINES);
  const totalDuration = 3000;
  const noisePhaseEnd = 1500;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);

    if (elapsed < noisePhaseEnd) {
      // Phase 1: Build noise on removed lines
      const noiseProgress = elapsed / noisePhaseEnd;
      const newNoiseMap = new Map<number, number>();

      removedLinesArray.forEach((lineIdx, i) => {
        // Stagger noise buildup - earlier lines get noisy first
        const lineProgress = Math.max(0, noiseProgress - (i / removedLinesArray.length) * 0.3);
        const noise = Math.min(lineProgress * 1.5, 1);
        newNoiseMap.set(lineIdx, noise);
      });

      setLineNoiseMap(newNoiseMap);
    } else {
      // Phase 2: Collapse lines in waves
      const collapseProgress = (elapsed - noisePhaseEnd) / (totalDuration - noisePhaseEnd);

      // Determine which lines should be collapsing based on progress
      const linesToCollapse = Math.floor(collapseProgress * removedLinesArray.length);
      const newCollapsing = new Set<number>();
      const newCollapsed = new Set<number>();

      removedLinesArray.forEach((lineIdx, i) => {
        if (i < linesToCollapse - 3) {
          newCollapsed.add(lineIdx);
        } else if (i < linesToCollapse) {
          newCollapsing.add(lineIdx);
        }
      });

      setCollapsingLines(newCollapsing);
      setCollapsedLines(newCollapsed);
      setAnimationPhase('collapse');
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      setIsAnimating(false);
      setAnimationPhase('done');
      setIsApplied(true);
      setLineNoiseMap(new Map());
      setCollapsingLines(new Set());
      setCollapsedLines(new Set());
    }
  };

  animationRef.current = requestAnimationFrame(animate);
};
```

---

### Task 5: Update the Render Method

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Create new highlightCodeWithGlitch function**

Replace the existing `highlightCode` function with one that supports per-line glitch:

```tsx
function highlightCodeLines(code: string): { text: string; highlighted: React.ReactNode }[] {
  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Keywords
      const keywordMatch = remaining.match(/^(const|let|var|function|return|if|else|import|export|from|type|interface)\b/);
      if (keywordMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#c084fc' }}>{keywordMatch[0]}</span>);
        remaining = remaining.slice(keywordMatch[0].length);
        continue;
      }

      // JSX tags
      const jsxMatch = remaining.match(/^(<\/?)([\w]+)/);
      if (jsxMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#78716c' }}>{jsxMatch[1]}</span>);
        tokens.push(<span key={keyIdx++} style={{ color: '#f87171' }}>{jsxMatch[2]}</span>);
        remaining = remaining.slice(jsxMatch[0].length);
        continue;
      }

      // Strings
      const stringMatch = remaining.match(/^("[^"]*"|'[^']*'|`[^`]*`)/);
      if (stringMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#fbbf24' }}>{stringMatch[0]}</span>);
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^\d+(\.\d+)?/);
      if (numMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#f59e0b' }}>{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Properties/keys
      const propMatch = remaining.match(/^(\w+):/);
      if (propMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#38bdf8' }}>{propMatch[1]}</span>);
        tokens.push(<span key={keyIdx++}>:</span>);
        remaining = remaining.slice(propMatch[0].length);
        continue;
      }

      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#525252' }}>{commentMatch[0]}</span>);
        remaining = remaining.slice(commentMatch[0].length);
        continue;
      }

      // Default: single character
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return {
      text: line,
      highlighted: <>{tokens.length > 0 ? tokens : '\u00A0'}</>,
    };
  });
}

const beforeLines = highlightCodeLines(BEFORE_CODE);
const afterLines = highlightCodeLines(AFTER_CODE);
```

**Step 2: Update the code viewport JSX**

Replace the code content area (lines ~489-560 in original) with:

```tsx
{/* Code content area */}
<div className="relative overflow-hidden">
  {/* Before code with glitch effects */}
  {!isApplied && (
    <div className="p-4">
      <code className="text-[11px] block" style={{ color: "var(--text-secondary)" }}>
        {beforeLines.map((line, idx) => {
          const noiseLevel = lineNoiseMap.get(idx) || 0;
          const isCollapsing = collapsingLines.has(idx);
          const isCollapsed = collapsedLines.has(idx);
          const isRemoved = REMOVED_LINES.has(idx);

          return (
            <GlitchLine
              key={idx}
              originalText={line.text}
              noiseLevel={isRemoved ? noiseLevel : 0}
              isCollapsing={isCollapsing}
              isCollapsed={isCollapsed}
            >
              <div
                className="leading-relaxed transition-all duration-300"
                style={{
                  filter: !isRemoved && animationPhase !== 'idle'
                    ? 'brightness(1.2)'
                    : 'none',
                }}
              >
                {line.highlighted}
              </div>
            </GlitchLine>
          );
        })}
      </code>
    </div>
  )}

  {/* After code - shown when complete */}
  {isApplied && (
    <div
      className="p-4 animate-in fade-in duration-500"
    >
      <code className="text-[11px] block" style={{ color: "var(--text-secondary)" }}>
        {afterLines.map((line, idx) => (
          <div key={idx} className="leading-relaxed">
            {line.highlighted}
          </div>
        ))}
      </code>
    </div>
  )}
</div>
```

---

### Task 6: Remove Old Animation Elements

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Remove the magic wand line JSX**

Delete this entire block:
```tsx
{/* Magic wand line */}
{isAnimating && (
  <div
    className="absolute top-0 bottom-0 w-1 z-20 pointer-events-none"
    ...
  />
)}
```

**Step 2: Remove the sparks overlay JSX**

Delete this entire block:
```tsx
{/* Sparks */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {sparks.map(renderSpark)}
</div>
```

**Step 3: Remove the Spark interface**

Delete the `interface Spark { ... }` definition.

---

### Task 7: Add Scanline Overlay Effect

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Add scanline overlay during animation**

In the code viewport section, add after the code content:

```tsx
{/* Scanline overlay during noise phase */}
{isAnimating && animationPhase === 'noise' && (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: `repeating-linear-gradient(
        0deg,
        transparent 0px,
        rgba(0, 0, 0, 0.1) 1px,
        transparent 2px,
        transparent 4px
      )`,
      animation: 'scanlines 0.1s linear infinite',
    }}
  />
)}
```

**Step 2: Add scanline keyframe animation**

Add to the `<style jsx>` block at the bottom:

```css
@keyframes scanlines {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}
```

---

### Task 8: Polish and Test

**Files:**
- Modify: `/Users/slobo/Documents/coding/stashmd/site/app/components/CodeSimplifierDemo.tsx`

**Step 1: Adjust timing for smoothness**

Fine-tune these values based on visual testing:
- Total duration: 3000ms (adjust if needed)
- Noise phase: first 1500ms
- Collapse phase: remaining 1500ms
- Per-line collapse transition: 300ms

**Step 2: Add subtle glow to "kept" lines**

During animation, lines that stay should have a subtle brightness increase to contrast with the noisy lines.

**Step 3: Ensure reset works cleanly**

Verify the "Try again" button fully resets all state.

**Step 4: Test in browser**

Run `npm run dev` and verify:
- [ ] Animation triggers on button click
- [ ] Removed lines get progressively glitchy
- [ ] Kept lines stay clean (slightly brighter)
- [ ] Lines collapse smoothly, pulling content up
- [ ] After code appears cleanly at the end
- [ ] Stats update correctly
- [ ] Reset button works

---

### Task 9: Commit

**Step 1: Stage and commit**

```bash
git add app/components/CodeSimplifierDemo.tsx
git commit -m "replace wand animation with noise dissolution for code-simplifier"
```

---

## Summary

The new animation:
1. Shows all 63 lines initially
2. Lines marked for removal get progressively glitchy (character scramble + RGB split)
3. Lines that stay get subtly brighter (signal emerging from noise)
4. Glitchy lines collapse to zero height in a cascade, naturally shrinking the container
5. Final "after" code appears, clean and crystalline

This solves the original problem: the collapse IS the animation, not a separate awkward step afterward.
