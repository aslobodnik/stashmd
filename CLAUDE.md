# stashmd - Project Guide

## What This Is

A curated directory of AI skills where every skill proves itself with before/after demos. The core insight: **show, don't tell**. One stunning demo beats a thousand star ratings.

## Design Philosophy: Magic Over Features

This project prioritizes **visceral delight** over feature completeness. Every interaction should make users say "holy shit."

### The Magic Hierarchy

1. **Transformation is the product** - The before/after demo IS the value proposition
2. **Animation serves meaning** - The wand sweep isn't decoration, it's showing the skill "transforming" the output
3. **Every element earns its place** - No generic components. If it's on screen, it should be sick
4. **Elevated > Functional** - A beautiful install section beats a working one-click button that doesn't exist yet

### What We Learned

**The wand animation**: Users don't want fades or sliders. They want to SEE the transformation happen - a magic wand sweeping across, leaving sparkles, physically changing the page. The animation IS the proof.

**Prompt visualization matters**: Show the exact prompt, show it changing when the skill is applied. Make it real, not abstract.

**Terminal aesthetics**: macOS window chrome (traffic lights), syntax highlighting, the gold `❯` prompt - these details signal quality.

**Copy interactions**: The copy button should feel satisfying - checkmark animation, golden glow, step indicator lighting up. Small moments of delight.

**Trust signals**: Official badge with Anthropic logo for first-party skills. Version numbers and GitHub stars come later when we have real data.

**Anti-AI-slop positioning**: The headline "Stop shipping AI slop" resonates. Each skill's copy should be punchy and problem-aware, not feature-listy.

## Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS + CSS variables for theming
- **Fonts**: Instrument Serif (display) + IBM Plex Mono (body/code)
- **Animations**: Custom requestAnimationFrame for wand/sparkles, CSS transitions elsewhere

## Color System

```css
--bg-deep: #0c0a09      /* Deepest background */
--bg-surface: #1c1917   /* Card backgrounds */
--bg-elevated: #292524  /* Elevated elements */
--accent-gold: #fbbf24  /* Primary accent - magic, CTAs */
--accent-amber: #f59e0b /* Gold gradient end */
--accent-purple: #a855f7 /* Secondary accent - skill highlights */
--text-primary: #fafaf9
--text-secondary: #a8a29e
--text-muted: #78716c
```

## Component Patterns

### BeforeAfterComparison
- Terminal-style prompt display with traffic lights
- Prompt transforms to show skill being added
- Status indicator with icon + subtitle
- "Apply skill" button with shimmer effect
- Browser viewport chrome around iframe
- Magic wand sweep with flying sparks (stars, diamonds, circles)
- Contextual footer hints

### InstallSection
- Header with icon + title + subtitle
- Command with syntax highlighting
- Copy button with success state (checkmark, glow)
- 3-step progress indicator

## File Structure

```
/site
  /app
    /components
      BeforeAfterComparison.tsx  # Visual output demo (iframes)
      CodeSimplifierDemo.tsx     # Code transformation demo
      RemotonDemo.tsx            # Correctness demo
      InstallSection.tsx         # Install command UI
      SkillCard.tsx              # Skill selector cards
    globals.css                  # Theme variables, base styles
    layout.tsx                   # Fonts, metadata
    page.tsx                     # Homepage with skill switching
  /public
    /demos
      /frontend-design
        before.html              # Generic Claude output
        after.html               # With skill applied
```

## Creating Unique Skill Demos

### The Framework

Every skill demo needs to answer: **What transformation does this skill create?**

The transformation type determines the demo approach:

| Transformation Type | Example Skill | Demo Approach |
|---------------------|---------------|---------------|
| Visual output | frontend-design | Before/after HTML in iframes |
| Code reduction | code-simplifier | Code with collapsing container + stats |
| Correctness | remotion | Code that "won't work" → code that works |
| Process | brainstorming | Thinking steps visualization |
| Quality | commit | Before/after text comparison |

### Demo Anatomy

Every demo has these layers:

1. **Terminal prompt** - Shows the user's request (typewriter effect when adding skill)
2. **Action bar** - Status indicator + "Apply skill" button
3. **Transformation viewport** - Where the magic happens
4. **Stats/result bar** - Quantified impact (lines, %, status indicators)

### The Magic Wand Pattern

The wand sweep is the signature interaction:
- Horizontal sweep from left to right (2-2.8s duration)
- `clip-path: inset(0 ${100-position}% 0 0)` reveals the "after"
- Sparks (stars, diamonds, circles) trail the wand
- Cubic ease-out for natural deceleration

### Making Each Demo Unique

**frontend-design**: iframe comparison
- Shows actual rendered HTML
- Wand reveals the transformed design
- Typewriter adds "using the frontend-design skill" to prompt

**code-simplifier**: code transformation
- Syntax-highlighted code blocks
- Container height COLLAPSES after transform (code literally shrinks)
- Stats: line count, % reduction, behavior changes

**remotion**: correctness transformation
- "Won't render" → "Will render" status badges
- Shows wrong pattern → correct pattern
- Highlights the API being used (useCurrentFrame, interpolate)

### Creating a New Demo Component

1. **Identify the "holy shit" moment** - What makes someone say "I need this"?

2. **Choose the before/after format**:
   - HTML iframes (visual output)
   - Code blocks (code transformation)
   - Text comparison (writing improvement)
   - Custom visualization (process skills)

3. **Add skill-specific stats**:
   - code-simplifier: line count, % reduction
   - remotion: "renders" / "won't render" status
   - frontend-design: implicit (visual is the stat)

4. **Wire the animation phases**:
   ```
   Click → [Typewriter if applicable] → Wand sweep → Stats reveal
   ```

5. **Test the 2-second rule**: Can someone understand the value in 2 seconds?

### Component Template

```tsx
export function NewSkillDemo() {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wandPosition, setWandPosition] = useState(0);

  // 1. Terminal prompt section
  // 2. Action bar (status + button)
  // 3. Transformation viewport with:
  //    - Before content (fades/hides after)
  //    - After content (revealed by clip-path)
  //    - Magic wand line (during animation)
  //    - Sparks overlay
  // 4. Stats bar (appears/expands after)
}
```

### Don't Forget

- Syntax highlighting for code (purple keywords, yellow strings, blue props)
- Traffic light dots on terminal headers
- Gold accent for CTAs and highlights
- Smooth transitions (500-700ms for state changes)
- The "Try again" reset button pattern

## What NOT to Build Yet

- User accounts / auth
- Ratings / reviews (no data yet)
- Categories / taxonomy
- Metrics infrastructure
- Testimonials (empty placeholders are worse than nothing)

Add these only when you feel the lack.

## Skills Implemented

1. **frontend-design** ✅ - Visual transformation, iframe comparison, typewriter prompt
2. **code-simplifier** ✅ - Code transformation, collapsing container, line stats
3. **remotion** ✅ - Correctness transformation, "won't render" → "will render"

## Next Skills to Demo

Priority order based on visual impact:

1. **brainstorming** - Show thinking steps expansion, accessible to non-devs
2. **commit** - Before/after commit message text comparison
3. **tdd** - Test-first workflow visualization
4. **wrap-up** - Cleanup checklist animation

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
```
