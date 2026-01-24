# stashmd - Design Spec

*Final spec: January 2026*

## The Product

A curated directory of AI agent skills where every skill proves itself with before/after demos.

**Core insight:** Show, don't tell. One stunning demo beats a thousand star ratings.

**Target:** Vibe coders and non-technical users who want to trust what they install.

---

## Minimal Viable Magic

### What ships

- Single-page static site
- 5 skills (not 20)
- Hero section with ONE killer before/after (frontend-design skill)
- Grid of 5 skills below
- Each skill: name, one-line, visual comparison, copy-paste install
- That's it

### What doesn't ship (yet)

- Persona onboarding / questionnaires
- Verification systems / health badges
- Risk labels / permissions info
- Outcome-first discovery / categories
- Testimonials (even empty placeholders)
- Metrics infrastructure
- User accounts

Add back only when you feel the lack.

---

## The 5 Launch Skills

| Skill | Category | Why it's in |
|-------|----------|-------------|
| **frontend-design** | Creative | Hero skill. Visual impact is undeniable. The "holy shit" moment. |
| **brainstorming** | Productivity | Accessible to non-devs. Shows thinking improvement. |
| **tdd** | Coding | For the dev crowd. Clear before/after in code quality. |
| **commit** | Coding | Universal dev need. Shows clean commit messages. |
| **wrap-up** | Productivity | End-of-session cleanup. Useful for everyone. |

Frontend-design is the flagship. If that demo doesn't make someone say "I need this," nothing else matters.

---

## Skill Page Structure

Each skill shows:

1. **Name** - Clear, memorable
2. **One-liner** - What it does in <10 words
3. **Before/after** - The proof (format varies by skill type)
4. **Install** - Single copy-paste command
5. **Source** - GitHub link

No fluff. No "about the author." No testimonials section waiting to be filled.

---

## Homepage Structure

```
[Hero]
- Headline: "AI skills that prove themselves"
- Subhead: "Every skill shows what it actually does. No guessing."
- THE demo: frontend-design before/after (dominant visual)
- CTA: "See more skills" (scrolls to grid)

[Grid]
- 5 skill cards
- Each card: name, one-liner, thumbnail of before/after
- Click → expands to full demo + install

[Footer]
- "Curated by [you]"
- GitHub link
- "Submit a skill" (mailto or form for later)
```

---

## Technical Stack

- **Framework:** Astro (static, fast, simple)
- **Styling:** Tailwind
- **Hosting:** Vercel
- **Content:** MDX or just static HTML (5 skills doesn't need a CMS)
- **Images:** In repo

```
/stashmd
  /public
    /skills
      /frontend-design
        before.png
        after.png
      /brainstorming
        before.png
        after.png
      ...
  /src
    /pages
      index.astro
    /components
      SkillCard.astro
      BeforeAfter.astro
  design_spec.md
```

---

## The Frontend-Design Demo

This is the make-or-break demo. Needs to be perfect.

**Prompt:** "Create a personal website for Benjamin Franklin based on his Wikipedia page"

**Before:** Claude without the skill (generic, bland output)

**After:** Claude with frontend-design skill (polished, distinctive design)

Side-by-side screenshots. The delta should be obvious in 2 seconds.

---

## Design Direction

- Clean, not sterile
- Warm, approachable (Anthropic vibes)
- Mobile-first
- Fast (static site, no bloat)
- Non-dev language (no jargon)
- Screenshots > code blocks

Possible mascot later. Not for MVP.

---

## Success Criteria

Ship when:

- [ ] Frontend-design demo makes 3/3 test viewers say "wow"
- [ ] All 5 skills have working before/after demos
- [ ] Install commands work (tested fresh)
- [ ] Site loads in <2s on mobile
- [ ] A non-dev friend can understand what this is

---

## Next Actions

1. **Create the frontend-design demo** - The Benjamin Franklin prompt, before/after screenshots
2. **Build the single-page site** - Hero + grid, nothing else
3. **Add remaining 4 skills** - One at a time, each with demo
4. **Ship** - stashmd.com or stash.md (domain TBD)

---

## What This Spec Intentionally Omits

Everything in the original brainstorm that isn't essential:

- Categories / taxonomy
- Curator's verdict / "why this made the cut"
- Risk + effort labels
- Evidence packs / delta cards
- Last-tested stamps
- Skill health systems
- Persona onboarding
- Outcome-first discovery
- Metrics (TTT, TTFW)
- Skill packs / bundles

These are all good ideas. They're not MVP. The magic is in the demos, not the infrastructure around them.

---

## Reference

Full brainstorming history preserved in:
`/Users/slobo/Documents/research/skills-platform/design-spec.md`
