

## TikTok Verification File

Create a static verification file so TikTok can confirm ownership of the `/visas/thailand-dtv/` path.

### File to create

**Path:** `public/visas/thailand-dtv/tiktok1WVnqnOBe9my8OoI9I9ac1MNMk39cwDI.txt`

**Content (single line, no trailing newline issues):**
```
tiktok-developers-site-verification=1WVnqnOBe9my8OoI9I9ac1MNMk39cwDI
```

### How it works

- Files in `public/` are served as-is at the matching URL by Vite.
- After publish, TikTok will be able to fetch:
  - `https://planbasia.com/visas/thailand-dtv/tiktok1WVnqnOBe9my8OoI9I9ac1MNMk39cwDI.txt`
  - `https://planbasya.com/visas/thailand-dtv/tiktok1WVnqnOBe9my8OoI9I9ac1MNMk39cwDI.txt`
- No routing, SPA fallback, or React code changes needed — static asset only.

### Post-implementation

1. Hit **Publish/Update** so the file is served on the custom domains.
2. Verify the URL returns the exact verification string (200, `text/plain`).
3. Click "Verify" in TikTok's developer console.

No other files touched. No dependencies. No DB changes.

