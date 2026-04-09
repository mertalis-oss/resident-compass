

# Batch 2.5 — Advisory Card + Interstitial Modal

## 4 Files to Modify

### 1. `src/components/home/Testimonials.tsx` (1 line)
- Line 11: `if (scope === 'tr') return null;` → `if (scope !== 'tr') return null;`

### 2. `src/components/home/TrustSignals.tsx`
- Wrap the stats grid (lines 25-43) in `{scope === 'tr' && (…)}` — TR keeps its 4 animated pillars
- Add EN-only block: a simple centered `<p>` with `15+ Years International Experience · Multi-Country Execution · Private Advisory Model` — no counters, no motion
- Trust strip section (lines 45-69) unchanged for both scopes

### 3. `src/pages/en/DTVPageEN.tsx` (line 119)
- Remove `xl:grid-cols-3` → keep `grid-cols-1 md:grid-cols-2 gap-8`

### 4. `src/components/service/ServiceCheckout.tsx` — Major restructure (lines 230-401)

**New imports:** `Dialog, DialogContent, DialogHeader, DialogTitle` from `@/components/ui/dialog`

**New state:** `const [modalOpen, setModalOpen] = useState(false)`

**Lines 230-401 replaced with two layers:**

**Layer 1 — Advisory Card (rendered inline)**
```
<section id="checkout-section" className="section-editorial border-t border-border">
  <div className="container max-w-2xl px-6">
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg
                    shadow-sm hover:shadow-md transition-shadow duration-200 ease-out
                    p-6 md:p-8">
      <h2 className="font-heading text-xl md:text-2xl mb-3">{service.title}</h2>
      {service.short_description && <p className="text-muted-foreground text-sm mb-4">...</p>}
      <div className="border-t border-accent/20 my-4" />
      <!-- Price: formatPrice() or "Private Engagement" / "Özel Danışmanlık" if price is 0/falsy -->
      <Button className="w-full h-12" onClick={() => setModalOpen(true)}>
        "Initialize Protocol" (EN) / "Süreci Başlat" (TR)
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">
        "Private advisory — no automated processing" / "Kişiye özel danışmanlık — otomatik işlem yok"
      </p>
    </div>
  </div>
</section>
```

**Layer 2 — Interstitial Modal**
```
<Dialog open={modalOpen} onOpenChange={(open) => {
  if (!open) { setIsAgreed(false); setIsCheckoutLoading(false); setShowRescue(false); }
  setModalOpen(open);
}}>
  <DialogContent className="p-0 overflow-hidden max-w-[560px]">
    <!-- Inner scroll wrapper -->
    <div className="max-h-[80vh] overflow-y-auto p-6 md:p-8 pb-32">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">{service.title}</DialogTitle>
      </DialogHeader>
      <!-- ALL existing checkout content from lines 247-397 moved here:
           Stripe trust badge, micro-trust signals, hesitation killer,
           price justification box, terms checkbox, legal agreement,
           WhatsApp escape, "what happens next" steps, legal disclaimer,
           real human text -->
    </div>
    <!-- Sticky CTA footer (solid bg, no transparency artifacts) -->
    <div className="sticky bottom-0 z-10 bg-card border-t border-border pt-4 pb-4 px-6 md:px-8">
      <p className="text-xs text-muted-foreground text-center mb-2">response time copy</p>
      <Button id="checkout-cta-btn" ... onClick={handleCheckout} disabled={!isAgreed || isCheckoutLoading}>
        CTA label (same scope logic)
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">post-CTA reassurance</p>
    </div>
  </DialogContent>
</Dialog>
```

**Key architectural details:**
- `DialogContent` uses `p-0 overflow-hidden` (Radix-safe — no direct overflow-y-auto on the content root)
- Inner wrapper handles scroll with `max-h-[80vh] overflow-y-auto` + `pb-32` for sticky footer clearance
- Sticky footer uses solid `bg-card` (no transparency) to prevent contrast artifacts on Safari
- `onOpenChange` resets `isAgreed`, `isCheckoutLoading`, `showRescue` when closing → fresh slate every open
- Radix Dialog natively handles body scroll lock (Safari safe), focus trap, ESC close, and focus return to trigger
- No custom focus management wrappers needed — preserving Radix's native A11y behavior

**Preserved unchanged (zero modifications):**
- Lines 1-229: all imports, types, state, `handleCheckout`, WhatsApp helpers, lead-rescue failsafe, mirror variant, `formatPrice`
- All TR/EN scope branching text preserved exactly inside the modal

## Not Touched
- All TR pages, TR navigation, TR routes
- Stripe logic, webhooks, RLS, edge functions
- Hero.tsx, i18n.ts, StickyMobileCTA, FocusedNavbar
- `useServiceFetch`, `useServicesList` hooks
- No new dependencies

