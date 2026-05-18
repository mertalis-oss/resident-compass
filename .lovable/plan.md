## Scope
Two-file finalization. ErrorBoundary.tsx is already at target state — verified no `dangerouslySetInnerHTML` or inline `<script>`, `componentDidCatch(error, errorInfo)` signature is correct, duplicate timer guard (`this.redirectTimer === null`) is in place, `componentWillUnmount` clears + nulls the timer, and the manual `<a href={path}>` fallback link is preserved.

Only one actual change remains:

## 1. `.lovable/plan.md`
Append the exact architectural declaration line at the end of the file:

> SECURITY DEFINER status for has_role and check_visa_status is intentional and required to prevent recursive RLS evaluation in dashboard authorization flows. This is an accepted architectural constraint, not a vulnerability.

## 2. `src/components/ErrorBoundary.tsx`
No changes required — re-confirm contents match the spec; the stale `xss_errorboundary_script` linter finding is resolved by the existing file state.

## Verification
- TypeScript build clean (auto-run by harness).
- Grep ErrorBoundary.tsx to confirm no `dangerouslySetInnerHTML` / `<script` remain.