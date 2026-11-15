import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const assets = new Set();
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if (!value.startsWith('#') && !/^[a-z]+:/i.test(value)) assets.add(value);
}
for (const file of ['motion.js', 'interactions.js']) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, file)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  const source = await readFile(resolve(root, file), 'utf8');
  for (const match of source.matchAll(/portfolio-[\w.-]+\.webp/g)) assets.add(`static/${match[0]}`);
}
for (const asset of assets) {
  const path = resolve(root, asset);
  if (relative(root, path).startsWith(`..${sep}`)) throw new Error(`Asset escapes demo: ${asset}`);
  await access(path);
}
console.log(`JavaScript syntax and ${assets.size} local asset references verified. Static demo is ready to serve at /demo/.`);
