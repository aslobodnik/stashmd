# Demo Design Framework

How to design skill demos that prove their value through animation.

---

## The Core Principle

**The animation must embody what the skill does, not just decorate it.**

A magic wand sweep is generic "magic". It doesn't tell you anything about what the skill actually does. The animation should BE the transformation.

---

## The Framework

Ask these questions in order:

### 1. What transformation does the skill create?

Not features - the core shift. Examples:
- code-simplifier: Complex → Simple (63 lines → 22)
- remotion: Static → Motion (same content, different impact)
- frontend-design: Generic → Polished (AI slop → professional)

### 2. What metaphor represents that transformation?

Find a visual concept that maps directly to the skill's action:

| Skill | Transformation | Metaphor |
|-------|---------------|----------|
| code-simplifier | Reduce complexity | Signal clarifying from noise |
| remotion | Add motion | Static vs. cinematic side-by-side |
| frontend-design | Elevate quality | Before/after visual output |

### 3. What DOM changes need to happen?

How does the before→after differ structurally?
- Lines disappearing (code-simplifier)
- Two panels showing different states (remotion)
- Iframe content swapping (frontend-design)

### 4. How does the animation embody the change?

**Critical:** The animation should BE the transformation, not reveal it afterward.

**Bad:** Wand sweeps, then container collapses (two separate actions)
**Good:** Lines get noisy and collapse AS the animation (one unified action)

**Bad:** Show code, badge says "will render"
**Good:** Show the actual output - static vs. animated side-by-side

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|--------------|--------------|-----|
| Generic wand/sparkles | Doesn't relate to what skill does | Match animation to transformation |
| "Before" badge / "After" badge | User has to trust you | Show the actual difference |
| Reveal then collapse | Feels like two steps, awkward | Collapse AS the reveal |
| Showing code for visual skills | Proves nothing about output | Show the output |

---

## Process & Skills Used

This is the workflow that produced good demos:

### 1. Brainstorm the metaphor
**Skill:** `superpowers:brainstorming`

- Identify the core transformation
- Generate 3-4 metaphor options
- Pick one that maps directly to what the skill does
- Validate with user before proceeding

### 2. Design the animation sequence
**Still in brainstorming**

- Break down the animation phases
- Define timing (what happens when)
- Specify easing and visual effects
- Document in `docs/plans/YYYY-MM-DD-<skill>-design.md`

### 3. Write implementation plan
**Skill:** `superpowers:writing-plans`

- Convert design into bite-sized tasks
- Include exact code snippets
- Specify file paths and line numbers

### 4. Execute with subagents
**Skill:** `superpowers:subagent-driven-development`

- Fresh subagent per task
- Spec review after each task
- Code quality review after each task
- Commit after all tasks pass

### 5. Commit and verify
**Manual or skill:** `superpowers:verification-before-completion`

- Test in browser
- Verify animation feels right
- Commit with descriptive message

---

## Quick Reference

When designing a new skill demo:

```
1. What does it transform? _______________
2. What's the metaphor?    _______________
3. What DOM changes?       _______________
4. Animation = change?     [ ] Yes, unified
```

If you can't answer #4 with "yes, unified" - rethink the animation.

---

## Examples

### code-simplifier
- **Transform:** Complex code → simple code
- **Metaphor:** Signal from noise
- **DOM:** Lines collapse, height shrinks
- **Animation:** Lines get glitchy (noise), then collapse (signal emerges)

### remotion
- **Transform:** Static content → motion content
- **Metaphor:** Side-by-side comparison
- **DOM:** Two panels, one static, one animated
- **Animation:** Left instant, right choreographed reveal with scale punch + shimmer

### frontend-design
- **Transform:** Generic output → polished output
- **Metaphor:** Before/after visual
- **DOM:** Iframe content swap
- **Animation:** Wand reveals transformed design (acceptable here because it's visual output)
