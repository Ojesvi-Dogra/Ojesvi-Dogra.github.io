# Résumé demo

Published path: https://ojesvi-dogra.github.io/demo/

All demo source, configuration, photos, and generated browser assets are in this folder. The original homepage in the repository root is preserved.

## Development

Use Node 24 (minimum 22.12). From the repository root:

```sh
cd demo
export ASTRO_TELEMETRY_DISABLED=1
npm ci --cache /tmp/ojesvi-npm-cache
npm run dev
```

Open the development server's `/demo/` path.

## Build and test

```sh
npm run check
npm test
npm run build
```

`npm run build` generates `dist/`, then copies the built homepage to `demo/index.html` and assets to `demo/static/`. Commit both generated outputs with source changes to update the demo through existing branch-based GitHub Pages publishing. The `static` asset directory avoids Jekyll's underscore-directory exclusion. No change to the root homepage or Pages source is required.

Browser tests use `/usr/bin/chromium` when available; on other machines run `npx playwright install chromium` first.

## Content and interactions

- `src/data/resume.ts`: career content copied from the original portfolio and intentional project placeholders. Review career dates before publishing.
- `src/pages/index.astro`: introduction, links, hobby text and photo imports.
- `src/components/Projects.tsx`: All / Personal / Academic filtering. Add verified details and URLs to replace the placeholders.
- `src/components/Gallery.tsx`: manual sliding carousel with arrows, position dots and swipe gestures; enlarged modal viewer with opening/closing animations, keyboard navigation, focus restoration and reduced-motion support.
- `src/components/ProtectedImage.tsx`: visible copyright overlay, context-menu and image-drag deterrents. These do not prevent screenshots, direct downloads or copying via browser tools. Original image files are not watermarked.
- `src/styles/global.css`: responsive styles and print layout. Save résumé opens browser printing; choose Save as PDF.

Stack: Astro, TypeScript, React islands and plain CSS. No secrets or backend services are required. Browser assets and optimized WebP images are self-hosted under `/demo/static/`.
