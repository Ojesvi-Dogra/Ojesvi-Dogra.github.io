// Commit a self-contained static demo next to its source for branch-based Pages.
import { cp, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await rm(new URL('static/', root), { recursive: true, force: true });
await cp(new URL('dist/static/', root), new URL('static/', root), { recursive: true });
await cp(new URL('dist/index.html', root), new URL('index.html', root));
console.log('Staged demo/index.html and demo/static/ for GitHub Pages.');
