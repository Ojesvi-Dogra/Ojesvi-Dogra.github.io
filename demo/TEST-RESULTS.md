# Validation results

Validated on 23 November 2026 with headless Chromium 154, Playwright and axe. The initial redesign was validated as a separate local preview. It was subsequently promoted into `demo/` at the user’s explicit request; see the promotion checks below.

## Automated checks

- **30 of 30 passed:** 15 browser scenarios in desktop Chromium and mobile Chromium with iPhone 13 device settings.
- **6 of 6 print checks passed again** after a print-only layout refinement.
- **4 static pages and 169 relative links/assets/anchors passed** the Node checker; JavaScript syntax passed.
- The checker identified 16 external link references. Their live destinations were not verified.

Covered behavior:

- Required content order, two professional contributions, four explicitly labeled concepts, real email/résumé links and no simulated form or false PDF-download action.
- Both case studies loaded directly, linked to source experience, and supported browser back navigation.
- Concept filters, live result announcements, clickable skills, keyboard operation and source-role links.
- Photography keyboard navigation, focus trapping/restoration, Escape close, zoom, swipe, captions and copyright indicators.
- Bounded normal-motion lightbox transitions without scrollbar flashes; section entrances run once. OS reduced motion and the saved manual preference work.
- Axe found no violations on the homepage in light and dark themes in either tested device configuration.
- Theme persistence, accessible settings, mobile navigation, active links and sticky-header offsets.
- All four pages and their local assets loaded at a domain root and a repository subpath with no missing-resource responses.
- Dynamic viewport resizing at 320, 390, 600, 768, 900, 1024, 1440, 1920 and 2560 pixels without horizontal layout overflow. Open image viewers also stayed bounded in portrait and landscape.
- Core content, native disclosures, links and the full HTML résumé remained usable with JavaScript disabled.
- Résumé dates, education, print-control routing and print styles. A rendered A4 print check produced four pages and text extraction confirmed all six roles and both education records. This validation PDF is not installed or represented as a supplied résumé PDF.
- No uncaught page JavaScript errors in browser scenarios. No external requests or analytics adapter by default.

## Visual review and source preservation

Desktop and narrow-mobile screenshots were captured from the running static preview, together with a complete case-study screenshot. Reviewed the compact desktop hero/impact strip, mobile hierarchy and case-study evidence presentation.

Existing photography is already compressed WebP: three 500px grid assets total about 122 KiB, with 1600px originals loaded for enlargement. Grid dimensions are reserved; the viewer uses a fixed frame and swaps the larger image after decoding. No external fonts or runtime dependencies were added.

The initial redesign was isolated in `redesign-preview/`. The later promotion changes only `demo/`; the original root homepage, Pages configuration and deployment workflows remain unchanged. The previous demo remains recoverable from commit `6e56dbe`.

## Archive validation

The delivered source ZIP excludes dependencies, test output and local symlinks. Its CRC integrity and extracted source links are checked before delivery. The extracted site is smoke-tested through an HTTP server with the same relative paths used by GitHub Pages.

## Limits

- External profile destinations and a public deployment were not live-tested because this environment restricts outbound access.
- Direct `file://` navigation is blocked by the managed browser. Static HTTP serving is verified and documented in the README.
- Chromium device emulation does not establish real-device Safari/Firefox compatibility. A full screen-reader evaluation and recruiter usability study remain useful follow-up checks.
- Career claims are supplied résumé information, not independently audited outcomes. Public supporting artifacts are listed in `HANDOFF.md`.

## Demo promotion checks

The same browser suite passed all 30 checks against the actual `demo/` directory before the publication commit; the static checker verified four pages and 169 local references. The Playwright base URL is derived from the folder name, so these checks exercise `/demo/` directly as well as a domain root. The original demo was also saved to a source ZIP before replacement.
