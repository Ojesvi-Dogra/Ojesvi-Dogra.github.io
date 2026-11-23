import {defineConfig,devices} from '@playwright/test';
import {existsSync} from 'node:fs';
import {basename} from 'node:path';
import {fileURLToPath} from 'node:url';
const folder=encodeURIComponent(basename(fileURLToPath(new URL('.',import.meta.url))));
export default defineConfig({
 testDir:'./tests',fullyParallel:true,workers:2,
 use:{baseURL:`http://127.0.0.1:4351/${folder}/`,reducedMotion:'reduce',launchOptions:{...(existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{}),args:['--no-sandbox']}},
 projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 webServer:[
  {command:'python3 -m http.server 4351 --bind 127.0.0.1 --directory ..',url:`http://127.0.0.1:4351/${folder}/`,reuseExistingServer:false},
  {command:'python3 -m http.server 4352 --bind 127.0.0.1 --directory .',url:'http://127.0.0.1:4352/',reuseExistingServer:false}
 ]
});
