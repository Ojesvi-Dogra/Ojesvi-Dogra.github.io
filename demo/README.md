# Ojesvi Dogra · Redesigned portfolio demo

The static professional portfolio demo at **https://ojesvi-dogra.github.io/demo/**. This redesign was promoted from the separately reviewed preview at the user’s request. The original root homepage and GitHub Pages configuration are preserved. The earlier demo remains in Git history at commit `6e56dbe`.

## Preview without a build

Serve this folder with a simple static HTTP server:

```sh
cd demo
python3 -m http.server 4360 --bind 127.0.0.1
```

For a repository-subpath preview, run the server from the parent folder and open `/demo/index.html`. All page, stylesheet, script, case-study and photo links are relative. No npm installation, API key, bundler, or application backend is needed for the core site. Use HTTP for consistent browser behavior; this managed browser blocks direct `file://` navigation.

## Pages and source

| File | Edit here |
| --- | --- |
| `index.html` | Hero, compact metrics, professional work cards, concepts, experience, skills, photography, education and contact |
| `resume.html` | Complete HTML résumé; includes every role, date, education entry and achievement |
| `work/ai-workflow-automation.html` | AI automation contribution account, reported savings, evidence boundaries |
| `work/hr-request-classification.html` | Request-classification contribution account, documented scope, evidence boundaries |
| `styles.css` | Shared design tokens, responsive layout, focus, dark theme, motion and print styles |
| `app.js` | Settings, filters, experience accordions, skill explanations, lightbox, navigation, printing and disabled-by-default analytics hook |
| `assets/photos/` | Existing optimized 500px thumbnails and 1600px photographs; preserve attribution |
| `CONTENT-AUDIT.md` | Source inventory and content decisions |
| `HANDOFF.md` | Delivery summary, missing evidence/integrations and validation limits |
| `TEST-RESULTS.md` | Completed browser, static-link, print and archive validation |

Static HTML is the published content source. There is **no generation step**. If you edit career information, update both `index.html` and `resume.html`; update linked case studies and the skill-evidence map in `app.js` where relevant. Keep role IDs `role-0` through `role-5` aligned with their existing roles, or update links together.

The main title is stable. The headline “Software Engineer · Java & AI Automation” is supported by the supplied Software Engineer/Java Developer roles and deployed AI-agent work. Education has moved into its own section. Every case study has Context → Problem → Contribution → Approach → Tradeoffs → Results → Evidence sections with an ordinary `.html` URL.

## Evidence and confidentiality

The professional narratives and metrics come from the career history supplied for this portfolio. They are résumé-reported, not independently audited. Employer names and employment dates are preserved. No confidential client name, internal system diagram, dataset, proprietary code, or screenshot is published.

Professional contribution cards are separated from **Experiments & Concepts**. The four concepts do not claim shipped work and have no invented demo/code links. The engineering graphics are explicitly labelled illustrations, not screenshots. The AI card's toolkit names tools/methods documented for the role; the exact reporting-agent platform has not been supplied. See the evidence section of each case and the handoff for missing materials.

## Résumé and contact

- **View résumé** opens `resume.html`.
- **Print résumé** opens browser printing. A browser may offer Save as PDF; this is **not labelled a PDF download**.
- No current PDF was supplied. An earlier generated artifact outside this source was not reused as a verified résumé attachment.
- The professional homepage has no simulated form or false success message. Email opens the visitor’s email client; LinkedIn and GitHub use the established profile URLs.
- External destinations were not live-verified because outbound access is restricted in this environment.

## Settings and accessibility

A small header control exposes dark theme and reduced motion. Preferences use only two local browser keys: `portfolio-theme` and `portfolio-motion`. No personal data is stored. OS reduced-motion settings are always respected. An optional replay action exists only when loading the page with `?demo=1`.

Content is visible without animation or JavaScript. Native experience disclosures still expand; skill links still point to roles; case-study, résumé, email and photography links remain real links. With JavaScript, skills also explain their source context and the three-photo grid opens one keyboard/touch-accessible viewer. Escape closes the viewer and returns focus. Arrow keys or swipe gestures change photographs; zoom supports panning without scrollbar flashes.

Photos retain visible credits. Right-click/image-drag suppression is a casual-saving deterrent; it cannot prevent screenshots, direct downloads or browser-tool access. No new photography license is granted.

## Optional analytics (off by default)

No tracking service, remote script, endpoint, cookie, visitor identifier or action log is installed. The portfolio does nothing with action events unless an approved integration deliberately defines this adapter before `app.js` runs:

```js
window.portfolioAnalytics = {
  enabled: true,
  track(name, properties) {
    // Connect an approved implementation here after privacy review.
  }
};
```

Defined event names:

| Event | When |
| --- | --- |
| `case_study_open` | A static case-study page loads; item is its fixed case ID |
| `project_link` | A future verified project link has `data-action="project_link"` |
| `resume_view` | A View résumé link is selected |
| `resume_download` | Reserved for a future supplied PDF link with this action; never emitted by the current print controls |
| `resume_print` | Browser printing is requested through a portfolio control |
| `contact_email` | An email link is selected |
| `profile_linkedin`, `profile_github` | A professional profile link is selected |

Properties contain only fixed action/case identifiers, not names, email addresses, message content, query strings or visitor information. Enabling a service requires a separately configured, approved analytics setup; do not infer consent from the existence of this hook.

## Checks (optional development tools only)

Use Node 22+ and Python 3:

```sh
npm ci
npm run check
npx playwright install chromium # only if no compatible Chromium is already installed
npm test
```

`npm run check` uses Node built-ins to validate JavaScript syntax, relative assets, links, anchors and portable paths. Tests use Playwright plus axe in desktop and mobile Chromium. They serve the same source both at a domain root and a subfolder. No test dependency is required to view or host the site. Test ports 4351 and 4352 must be free.

## GitHub Pages deployment

Commit changes under `demo/` and push to `main` for the existing branch-based Pages deployment. Preserve `assets/`, `work/`, `resume.html`, `styles.css` and `app.js` together. All asset paths are relative and work under the demo subfolder or a repository subpath. No build is required; `npm run build` is only a compatibility alias for the static checker.

Do not copy a standalone deployment workflow over the repository’s current Pages setup. The root homepage, `_config.yml`, visibility and deployment configuration are unchanged. The previous demo can be reviewed with `git show 6e56dbe:demo/index.html` or recovered from that commit. The separate `redesign-preview/` review copy is not part of this deployment.
