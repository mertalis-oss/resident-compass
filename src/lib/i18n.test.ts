/**
 * Phase 2 — i18n Dictionary Integrity Test (Two-Tier Safety Brake)
 *
 * Walks src/** for static `t('key', ...)` calls and verifies each key resolves
 * in BOTH the EN and TR translation trees inside src/lib/i18n.ts.
 *
 *  • Missing keys  → FAIL (sorted, with file:line and [EN ✗ TR ✓] flags).
 *  • Empty strings → WARN only (counted in summary).
 *  • Dynamic keys  → WARN only, deduped by file:line, hard-capped at 50 lines
 *                    plus a truncation summary.
 *
 * Tier 3B legal pages are temporarily excluded from the walker (technical debt
 * until the legal-review loop lands their TR translations).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import i18n from '@/lib/i18n';

const ROOT = path.resolve(__dirname, '..');           // → /…/src
const PROJECT_ROOT = path.resolve(ROOT, '..');        // → repo root
const SCAN_DIR = ROOT;

/** TEMPORARY TECHNICAL DEBT — re-enable after legal-review loop. */
const EXCLUDED_PATHS = new Set<string>([
  'src/pages/TermsOfService.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/RefundPolicy.tsx',
]);

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'test', '__tests__']);
const SKIP_FILES = new Set(['i18n.ts', 'i18n.test.ts']);

beforeAll(async () => {
  if (!i18n.isInitialized) {
    await Promise.race([
      new Promise<void>((resolve) => i18n.on('initialized', () => resolve())),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('i18n init timeout (>5s)')), 5000),
      ),
    ]);
  }
});

/* ---------- Walker ---------- */

function walk(dir: string, out: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full, out);
      continue;
    }
    if (!e.isFile()) continue;
    if (!/\.(ts|tsx)$/.test(e.name)) continue;
    if (/\.d\.ts$/.test(e.name)) continue;
    if (SKIP_FILES.has(e.name)) continue;
    const rel = path.relative(PROJECT_ROOT, full).replace(/\\/g, '/');
    if (EXCLUDED_PATHS.has(rel)) continue;
    out.push(full);
  }
  return out;
}

/* ---------- Comment stripping (preserves line numbers) ---------- */

function stripComments(src: string): string {
  // Replace /* ... */ with same number of newlines so line numbers stay aligned.
  let out = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  // Strip // ... to end-of-line (per-line).
  out = out
    .split('\n')
    .map((line) => {
      // naive but safe enough for source files: ignore // inside a string is rare in t() context
      const idx = findLineCommentStart(line);
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join('\n');
  return out;
}

function findLineCommentStart(line: string): number {
  let inStr: string | null = null;
  for (let i = 0; i < line.length - 1; i++) {
    const c = line[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '/' && line[i + 1] === '/') return i;
  }
  return -1;
}

/* ---------- Key extraction ---------- */

const STATIC_RE = /\bt\(\s*(['"`])([^'"`\n]+)\1/g;
// Dynamic: backtick-with-${ OR bare identifier first arg
const DYNAMIC_RE = /\bt\(\s*(`[^`]*\$\{|[A-Za-z_$][A-Za-z0-9_$]*\s*[,)])/g;

interface Hit { key: string; file: string; line: number; }

function lineOf(src: string, idx: number): number {
  let n = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

function extract(file: string): { statics: Hit[]; dynamics: { file: string; line: number }[] } {
  const raw = fs.readFileSync(file, 'utf8');
  const src = stripComments(raw);
  const rel = path.relative(PROJECT_ROOT, file).replace(/\\/g, '/');
  const statics: Hit[] = [];
  const dynamics: { file: string; line: number }[] = [];

  let m: RegExpExecArray | null;
  STATIC_RE.lastIndex = 0;
  while ((m = STATIC_RE.exec(src))) {
    statics.push({ key: m[2], file: rel, line: lineOf(src, m.index) });
  }
  DYNAMIC_RE.lastIndex = 0;
  while ((m = DYNAMIC_RE.exec(src))) {
    dynamics.push({ file: rel, line: lineOf(src, m.index) });
  }
  return { statics, dynamics };
}

/* ---------- Dictionary lookup ---------- */

function getByPath(obj: unknown, dotted: string): unknown {
  const parts = dotted.split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

/* ---------- Test ---------- */

describe('i18n dictionary integrity', () => {
  it('every statically-resolved t() key exists in EN and TR', () => {
    const resources = (i18n.options as any).resources;
    const enTree = resources?.en?.translation;
    const trTree = resources?.tr?.translation;

    if (!enTree || typeof enTree !== 'object') {
      throw new Error('i18n resources missing for locale: en');
    }
    if (!trTree || typeof trTree !== 'object') {
      throw new Error('i18n resources missing for locale: tr');
    }

    const files = walk(SCAN_DIR);
    const allStatics: Hit[] = [];
    const allDynamics: { file: string; line: number }[] = [];
    for (const f of files) {
      const { statics, dynamics } = extract(f);
      allStatics.push(...statics);
      allDynamics.push(...dynamics);
    }

    const missing: string[] = [];
    let emptyCount = 0;
    const emptySamples: string[] = [];

    for (const h of allStatics) {
      const enVal = getByPath(enTree, h.key);
      const trVal = getByPath(trTree, h.key);
      const enOk = typeof enVal === 'string';
      const trOk = typeof trVal === 'string';
      if (!enOk || !trOk) {
        const flag = `[EN ${enOk ? '✓' : '✗'} TR ${trOk ? '✓' : '✗'}]`;
        missing.push(`${h.key.padEnd(40)} ${flag}  ${h.file}:${h.line}`);
        continue;
      }
      if ((enVal as string) === '' || (trVal as string) === '') {
        emptyCount++;
        if (emptySamples.length < 10) {
          emptySamples.push(`${h.key}  ${h.file}:${h.line}`);
        }
      }
    }

    // ---- Dynamic-key warnings (deduped by file:line, capped at 50) ----
    const seen = new Set<string>();
    const dedupDyn: string[] = [];
    for (const d of allDynamics) {
      const k = `${d.file}:${d.line}`;
      if (seen.has(k)) continue;
      seen.add(k);
      dedupDyn.push(k);
    }
    const CAP = 50;
    const dynShown = dedupDyn.slice(0, CAP);
    if (dynShown.length) {
      console.warn(`\n[i18n] dynamic t() keys (cannot statically validate) — ${dedupDyn.length} unique site(s):`);
      for (const line of dynShown) console.warn('   - ' + line);
      if (dedupDyn.length > CAP) {
        console.warn(`[i18n] dynamic key warnings truncated: showing ${CAP} of ${dedupDyn.length} total`);
      }
    }

    // ---- Empty-string warnings ----
    if (emptyCount > 0) {
      console.warn(`\n[i18n] ${emptyCount} key(s) resolve to empty string. Sample:`);
      for (const s of emptySamples) console.warn('   - ' + s);
    }

    // ---- Summary ----
    console.warn(
      `\n[i18n] scanned ${files.length} files, ${allStatics.length} static t() calls, ` +
      `${dedupDyn.length} dynamic site(s), ${emptyCount} empty value(s), ` +
      `${missing.length} missing key(s).`,
    );

    if (missing.length) {
      missing.sort();
      console.error('\n[i18n] MISSING KEYS:\n' + missing.map((m) => '   ' + m).join('\n') + '\n');
    }

    expect(missing).toEqual([]);
  });
});
