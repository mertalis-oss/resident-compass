

# Surgical Fix: ServiceCheckout.tsx — 3 Changes

## Change 1: Add Atomic Lock Ref (Line 43)
After `const sessionKey = useRef(...)`, add:
```typescript
const clickLock = useRef(false);
```

## Change 2: Replace CTA onClick Handler (~Line 269)
Replace the current `onClick` on the card's CTA Button with the exact guarded handler including `console.log` debug, `clickLock` atomic guard, `try/catch` fail-safe, and `??` nullish coalescing.

## Change 3: Dialog Visibility Fix (Line 315)
Remove `relative` from `DialogContent` className:
- Before: `className="relative z-[999] p-0 overflow-hidden max-w-[560px]"`
- After: `className="z-[999] p-0 overflow-hidden max-w-[560px]"`

## Post-Deploy Verification
After applying, navigate to a service page, click the CTA, confirm the modal appears, agree to terms, and click checkout to verify Stripe redirect works end-to-end.

## Scope
- ONE file only: `src/components/service/ServiceCheckout.tsx`
- No quiz, no new files, no other changes

