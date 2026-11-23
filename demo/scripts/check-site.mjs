import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname,extname,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(path){const result=[];for(const entry of await readdir(path,{withFileTypes:true})){if(['node_modules','test-results','playwright-report','.git'].includes(entry.name)||entry.isSymbolicLink())continue;const full=resolve(path,entry.name);if(entry.isDirectory())result.push(...await walk(full));else result.push(full)}return result}
const files=await walk(root),pages=files.filter(file=>extname(file)==='.html');
let internal=0,external=0;
for(const page of pages){
 const source=await readFile(page,'utf8');
 for(const match of source.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=match[1];if(/^(https?:|mailto:)/i.test(href)){external++;continue}
  if(/^[a-z]+:/i.test(href))throw new Error(`Unexpected URL scheme: ${href}`);
  const [pathname,hash]=href.split('#'),clean=pathname.split('?')[0];
  const target=clean?resolve(dirname(page),decodeURIComponent(clean)):page;
  if(relative(root,target).startsWith(`..${sep}`)||href.startsWith('/'))throw new Error(`Nonportable link in ${page}: ${href}`);
  await access(target);internal++;
  if(hash&&extname(target)==='.html'){
   const html=await readFile(target,'utf8');
   if(!html.includes(`id="${decodeURIComponent(hash)}"`))throw new Error(`Missing anchor: ${href} from ${page}`);
  }
 }
}
const syntax=spawnSync(process.execPath,['--check',resolve(root,'app.js')],{stdio:'inherit'});
if(syntax.status!==0)process.exit(syntax.status??1);
console.log(`${pages.length} static pages; ${internal} relative links/assets/anchors verified. ${external} external link references identified (live destinations not verified). JavaScript syntax passed.`);
