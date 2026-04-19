

# V40 — Canonical Rollback & Final Polish

Strict revert to 0-2 scoring scale + historical DB keys. Preserves all V32.x guards.

## 1. `SimplifiedAssessmentModal.tsx`

**Restore canonical maps (0-2 scale, historical keys):**
```ts
const intentMap = { exploring: 0, planning_6_12: 1, relocating_now: 2 } as const;
const timelineMap = { later: 0, '3m': 1, 'now': 2 } as const;
const budgetMap = { under_3k: 0, '3_to_10k': 1, over_10k: 2 } as const;
```

**Update UI option `value`s to emit these exact keys:**
- Intent step: `exploring`, `planning_6_12`, `relocating_now`
- Timeline step: `later`, `3m`, `now`
- Budget step: `under_3k`, `3_to_10k`, `over_10k`

**Scoring formula (replaces inline `useMemo`):**
```ts
const intentScore = intent ? intentMap[intent] : 0;
const timelineScore = timeline ? timelineMap[timeline] : 0;
const budgetScore = budget ? budgetMap[budget] : 0;
const baseScore = intentScore + timelineScore + budgetScore;
const bonus = (intentScore >= 1 && timelineScore >= 1 && baseScore < 5) ? 1 : 0;
const finalScore = baseScore + bonus;
const isHighIntent = finalScore >= 5;
```
Persist `finalScore` to Supabase `score` column + `quiz_answers.score`.

**Silent killer guard — right before Supabase insert:**
```ts
if (!intent || !timeline || !budget) return;
if (import.meta.env.DEV) {
  console.info('[SCORE SYNC]', { intent, timeline, budget, finalScore });
}
```

**Timing armor — confirm intact:**
- `useEffect(() => { if (open) formStartTime.current = Date.now(); }, [open])`
- `if (honeypot && honeypot.trim().length > 0) return;`
- `if (Date.now() - formStartTime.current < 1200) return;`

## 2. `safeNavigate` double-nav guard (Modal + Hero)

Both copies must lead with:
```ts
if (typeof window !== 'undefined' && window.location.pathname === path) return;
```

## 3. Tracking-name purge

Final grep across `src/` for `hero_primary_cta` and `hero_secondary_cta`. Replace any survivors with `hero_primary_assessment` / `hero_secondary_advisory`. Confirm `Hero.tsx` payloads send only those two strings.

## 4. Frozen / Untouched

- V32.x submit guards: `submittingRef === true` strict check, 2s `lastSubmitRef` cooldown, tightened email regex (`[^\s@]{2,}` TLD), VIP timer null cleanup, warm copy "We'll reach out if there's a strong fit"
- V34 brand line "15 Years of Strategic Operational Leadership"
- TR navbar 4-pillar mirror + `(Yakında)` disabled items (`aria-disabled`, `tabIndex={-1}`, `opacity-50 pointer-events-none`)
- RAF+50ms hot anchor tear-down, hot path → `/checkout/advisory`
- `i18n.ts` guarantee/pressure sweep
- TR Hero, Footer, `vipWhatsApp.ts`, `tracking.ts`, UTM persistence

## 5. Verification (deltas only)

1. `intent=relocating_now` (2) + `timeline=now` (2) + `budget=over_10k` (2) → base 6, bonus 0, finalScore 6 → hot.
2. `intent=planning_6_12` (1) + `timeline=3m` (1) + `budget=under_3k` (0) → base 2, bonus 1, finalScore 3 → warm.
3. `intent=exploring` (0) + anything → bonus 0 (gated by `intentScore >= 1`).
4. DEV console prints `[SCORE SYNC] { intent, timeline, budget, finalScore }` exactly once per submit.
5. Submit with any field undefined → silent abort before insert.
6. On `/checkout/advisory`, click any CTA targeting same path → no nav fired.
7. `grep -r "hero_primary_cta\|hero_secondary_cta" src/` → empty.

