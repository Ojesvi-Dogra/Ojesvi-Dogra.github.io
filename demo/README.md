# Ojesvi Dogra · Interactive portfolio demo

Test URL: https://ojesvi-dogra.github.io/demo/

This folder contains the static HTML/CSS/JavaScript design supplied in **Ojesvi_Interactive_Portfolio_GitHub_Pages.zip**. It replaces the earlier Astro-generated demo; that implementation remains in Git history. All browser assets use relative paths and are self-hosted here. The repository's original root homepage and its Pages publishing configuration are preserved.

## Preview

No build or runtime npm installation is required:

```sh
# From the repository root
python3 -m http.server 4322 --directory .
```

Visit `/demo/` on the local server. Commit changes under `demo/` to `main` for the existing branch-based GitHub Pages deployment. Do not deploy this ZIP's standalone root-site workflow over the current homepage.

## Editing

- `index.html`: résumé content, education, contact links, initial gallery and project markup.
- `motion.css`, `interactions.css`: layout refinements, transitions, dark theme, responsive and reduced-motion rules.
- `motion.js`: skill evidence, project concepts, filters, expanding roles, dialogs, gallery, active navigation and printing.
- `interactions.js`: theme/motion controls, impact cards, working principles, project walkthroughs, photo thumbnails and contact preview.
- `static/`: the export's base stylesheet and optimized photography. Preserve filenames or update every reference.

Keep the script order: `motion.js` before `interactions.js`. Edit these files directly; `npm run build` validates the static files and does not regenerate or overwrite them.

## Validation

Use Node 24 and Python 3. Test dependencies are development-only:

```sh
cd demo
npm ci --cache /tmp/ojesvi-npm-cache
npm run check
npm test
```

Checks verify JavaScript syntax and local asset references. Browser tests serve the actual repository at `/demo/` and cover desktop/mobile layout, project filters and walkthroughs, skill evidence, photo navigation/zoom, copyright and casual-saving deterrents, theme accessibility, navigation/progress, motion controls, print behavior, no-JavaScript résumé content and contact-preview validation. The runner uses `/usr/bin/chromium` here; on other machines install Chromium with `npx playwright install chromium`.

## Testing boundaries

Project examples are explicitly labelled **concepts** and do not claim completed delivery. The contact form validates input and previews a response; it sends and stores nothing. Use the direct email link to contact Ojesvi. Save résumé opens browser printing or Save as PDF.

Every image variant displays attribution. Right-click saving and image dragging are suppressed with JavaScript; this does not prevent screenshots, direct downloads, or browser-tool access. Original WebP files are not permanently watermarked.

Integration fixes preserve the uploaded design while improving dark-mode contrast, dialog keyboard focus, photo copyright coverage and mobile behavior. Photography remains credited to Ojesvi Dogra; no new image license is granted.
