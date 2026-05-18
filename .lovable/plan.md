## Connect Google Search Console

Link the Google Search Console connector to this project so the SEO review can fetch index coverage, search performance, and sitemap status directly from Google.

### Steps

1. **Launch the GSC connection picker** — call `standard_connectors--connect` with `connector_id: "google_search_console"`. You'll see an inline OAuth prompt to authorize Google with your account (the same Google account that owns/manages the planbasia.com property in Search Console).

2. **Verify domain ownership** — once connected, request a META verification token for `https://planbasia.com/` via the Site Verification API, inject a `<meta name="google-site-verification" content="...">` tag into `index.html`, and you'll need to **publish** so the tag is live on the deployed site before Google can verify.

3. **Run verification + register the site** — call the Site Verification `webResource` endpoint, then `PUT` the site into your Search Console property list.

4. **Submit the sitemap** — register `https://planbasia.com/sitemap.xml` against the verified property.

### Notes / decisions for you

- **Which domain to verify?** You have `planbasia.com` (EN canonical), `planbasya.com` (TR canonical), and the lovable.app preview. SEO findings target the live custom domains. Recommend verifying **both** `planbasia.com` and `planbasya.com` — each gets its own meta tag in `index.html` (Google accepts multiple). Confirm if you'd rather start with just one.
- **Google account** — make sure you OAuth with the account that should own the GSC properties long-term; you can add other users later from the Search Console UI.
- **Publish step is mandatory** — verification fails if the meta tag isn't on the live deployed HTML. After I add the tag, you'll need to click Publish before I can run the verify call.

### Files that will change (build phase)

- `index.html` — add one or two `google-site-verification` meta tags
- No backend/edge-function changes needed; all GSC API calls run agent-side through the connector gateway
