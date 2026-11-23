import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const pageErrors=new WeakMap();
test.beforeEach(({page})=>{pageErrors.set(page,[]);page.on('pageerror',error=>pageErrors.get(page).push(error.message))});
test.afterEach(({page})=>expect(pageErrors.get(page)).toEqual([]));

test('professional work leads the page and only working résumé/contact actions are shown',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('index.html');
 await expect(page.locator('.role-label')).toHaveText('Software Engineer · Java & AI Automation');
 await expect(page.locator('.work-card')).toHaveCount(2);
 await expect(page.locator('.concept-card')).toHaveCount(4);
 const order=await page.locator('main>section[id]').evaluateAll(sections=>sections.map(section=>section.id));
 expect(order).toEqual(['work','experience','skills','about','education','contact']);
 await expect(page.locator('form')).toHaveCount(0);
 await expect(page.locator('a[download]')).toHaveCount(0);
 await expect(page.locator('.contact-address')).toHaveAttribute('href','mailto:dogra.ojesvi@gmail.com');
 expect(errors).toEqual([]);
});

test('static case studies load directly, support back navigation, and expose evidence boundaries',async({page})=>{
 await page.goto('index.html#work');
 await page.getByRole('link',{name:'Read case study',exact:true}).first().click();
 await expect(page).toHaveURL(/work\/ai-workflow-automation.html$/);
 await expect(page.locator('#evidence')).toContainText('Public evidence still needed');
 await expect(page.locator('#tradeoffs')).toContainText('does not document');
 await expect(page.locator('#results')).toContainText('50–60 team hours / week');
 await page.goBack();
 await expect(page).toHaveURL(/index.html#work$/);
 await page.goto('work/hr-request-classification.html');
 await expect(page.locator('#results')).toContainText('2,100 requests');
 await page.getByRole('link',{name:'Read the corresponding experience'}).click();
 await expect(page).toHaveURL(/index.html#role-2$/);
 await expect(page.locator('#role-2')).toContainText('Java Developer');
});

test('concept filters announce results and never filter professional contributions',async({page})=>{
 await page.goto('index.html');
 await page.getByRole('button',{name:'Academic',exact:true}).click();
 await expect(page.locator('.concept-card:visible')).toHaveCount(2);
 await expect(page.locator('[data-filter-status]')).toHaveText('2 concepts');
 await expect(page.locator('.work-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Personal',exact:true}).click();
 await expect(page.locator('.concept-card:visible').first()).toContainText('Family Finance Dashboard');
 await page.getByRole('button',{name:'All',exact:true}).click();
 await expect(page.locator('.concept-card:visible')).toHaveCount(4);
});

test('skill explanations are keyboard accessible and link to the correct roles',async({page})=>{
 await page.goto('index.html');
 for(const [label,id,title] of [['Java','role-2','Java Developer'],['AI agents','role-0','Systems Engineer'],['WordPress','role-4','Website Coordinator'],['Citrix','role-5','Junior Network Analyst']]){
  const skill=page.locator('#skills').getByRole('button',{name:label,exact:true});
  await skill.focus();await skill.press('Space');
  await expect(skill).toHaveAttribute('aria-pressed','true');
  const evidence=page.locator('[data-skill-role]');await expect(evidence).toHaveAttribute('href',`#${id}`);
  await evidence.click();await expect(page.locator(`#${id} details`)).toHaveAttribute('open','');
  await expect(page.locator(`#${id}`)).toContainText(title);
 }
 await expect(page.locator('.coverage-track,.coverage-value')).toHaveCount(0);
});

test('lightbox maintains smooth bounds, keyboard navigation, zoom and focus restoration',async({page})=>{
 await page.goto('index.html');
 const opener=page.locator('[data-lightbox]').first();await opener.click();
 const dialog=page.getByRole('dialog',{name:'Photography viewer'});await expect(dialog).toBeVisible();
 await expect(page.getByRole('button',{name:'Close photography viewer'})).toBeFocused();
 await page.keyboard.press('ArrowRight');await expect(page.locator('[data-photo-caption]')).toContainText('A little color on the road');
 await page.getByRole('button',{name:'Zoom image',exact:true}).click();await expect(page.locator('.image-stage')).toHaveClass(/is-zoomed/);
 await page.getByRole('button',{name:'Reset zoom'}).click();
 await page.getByRole('button',{name:'Zoom image',exact:true}).focus();await page.keyboard.press('Tab');
 await expect(page.getByRole('button',{name:'Close photography viewer'})).toBeFocused();
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(opener).toBeFocused();
 await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await expect(page.locator('.photo-grid')).toHaveCount(1);await expect(page.locator('.photo-card')).toHaveCount(3);
 await expect(page.locator('.carousel,.photo-thumbnails')).toHaveCount(0);
});

test('gallery swipes work and image attribution and casual-saving deterrents remain',async({page})=>{
 await page.goto('index.html');await page.locator('[data-lightbox]').first().click();
 const stage=page.locator('.image-stage');
 await stage.evaluate(element=>{
  const start=new Touch({identifier:1,target:element,clientX:250,clientY:100});
  element.dispatchEvent(new TouchEvent('touchstart',{touches:[start],bubbles:true}));
  const end=new Touch({identifier:1,target:element,clientX:100,clientY:100});
  element.dispatchEvent(new TouchEvent('touchend',{changedTouches:[end],bubbles:true}));
 });
 await expect(page.locator('[data-photo-caption]')).toContainText('A little color on the road');
 await expect(stage.locator('.photo-credit')).toContainText('© Ojesvi Dogra');
 expect(await stage.evaluate(element=>element.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true})))).toBe(false);
 await expect(stage.locator('img')).toHaveAttribute('draggable','false');
});

test('appearance controls, reduced motion and accessibility work in both themes',async({page})=>{
 await page.goto('index.html');
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByLabel('Appearance settings').click();
 await page.getByLabel('Dark theme',{exact:true}).check();
 await page.keyboard.press('Escape');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByLabel('Appearance settings').click();await expect(page.getByLabel('Reduce motion',{exact:true})).toBeChecked();
 await page.keyboard.press('Escape');await expect(page.locator('[data-replay]')).toHaveCount(1);await expect(page.locator('[data-replay]')).not.toBeVisible();
});

test('navigation offsets and mobile menu work after changing window sizes',async({page,isMobile})=>{
 await page.goto('index.html');
 if(isMobile)await page.getByLabel('Open navigation').click();
 const nav=page.getByRole('navigation',{name:isMobile?'Mobile navigation':'Main navigation',exact:true});
 await nav.getByRole('link',{name:'About',exact:true}).click();
 await expect(page.locator('.desktop-nav a[href="#about"]')).toHaveAttribute('aria-current','location');
 const top=await page.locator('#about').evaluate(element=>element.getBoundingClientRect().top);
 const header=await page.locator('.site-header').evaluate(element=>element.getBoundingClientRect().bottom);
 expect(top).toBeGreaterThanOrEqual(header-2);
 if(isMobile)await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open','');
});

test('core content and links work without JavaScript and all roles remain printable',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(baseURL+'index.html');
 await expect(page.locator('.role')).toHaveCount(6);await expect(page.locator('.education-item')).toHaveCount(2);
 await page.locator('#role-0 summary').click();await expect(page.locator('#role-0 .experience-content')).toBeVisible();
 await page.getByRole('link',{name:'Read case study',exact:true}).first().click();await expect(page.locator('#evidence')).toBeVisible();
 await page.goto(baseURL+'resume.html');await page.emulateMedia({media:'print'});
 await expect(page.locator('.role')).toHaveCount(6);await expect(page.locator('.site-header')).not.toBeVisible();
 await expect(page.locator('.role').last()).toContainText('Jan 2018 — Aug 2018');await context.close();
});

test('HTML résumé and print action preserve every employment date and education detail',async({page})=>{
 await page.goto('resume.html');
 await expect(page.locator('.role')).toHaveCount(6);await expect(page.locator('.education-item')).toHaveCount(2);
 for(const date of ['Jul 2024 — Oct 2026','May 2023 — Jul 2024','Oct 2022 — May 2023','Nov 2021 — Oct 2022','Sep 2019 — May 2021','Jan 2018 — Aug 2018'])await expect(page.locator('.role .dates').filter({hasText:date})).toHaveCount(1);
 await page.evaluate(()=>{window.print=()=>{document.body.dataset.printed='yes'}});await page.getByRole('button',{name:'Print résumé',exact:true}).click();await expect(page.locator('body')).toHaveAttribute('data-printed','yes');
 await page.emulateMedia({media:'print'});await expect(page.locator('.resume-heading')).toBeVisible();await expect(page.locator('.site-header')).not.toBeVisible();
});

test('relative pages and assets work at a domain root and a repository subpath',async({page,baseURL})=>{
 const missing=[];page.on('response',response=>{if(response.status()>=400)missing.push(response.url())});
 for(const base of ['http://127.0.0.1:4352/',baseURL]){
  for(const path of ['index.html','resume.html','work/ai-workflow-automation.html','work/hr-request-classification.html']){
   await page.goto(base+path);await expect(page.locator('h1')).toBeVisible();
   expect(await page.locator('link[rel=stylesheet]').evaluate(element=>Boolean(element.sheet))).toBe(true);
  }
  await page.goto(base+'index.html#about');
  for(const image of await page.locator('.photo-card img').all()){
   await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
 }
 expect(missing).toEqual([]);
});

test('live resizing keeps layouts and open image viewers within the window',async({page})=>{
 await page.goto('index.html');
 for(const width of [320,390,600,768,900,1024,1440,1920,2560]){
  await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('[data-lightbox]').first().click();
 for(const viewport of [{width:390,height:844},{width:844,height:390},{width:1440,height:900}]){
  await page.setViewportSize(viewport);const dialog=page.locator('.lightbox');const bounds=await dialog.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.y).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(viewport.width+1);expect(bounds.y+bounds.height).toBeLessThanOrEqual(viewport.height+1);
  await expect(dialog).toHaveCSS('overflow','hidden');
 }
});

test('manual motion setting disables entrances and optional analytics stay off by default',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});const requests=[];page.on('request',request=>requests.push(request.url()));
 await page.goto('index.html');await page.getByLabel('Appearance settings').click();await page.getByLabel('Reduce motion',{exact:true}).check();await page.keyboard.press('Escape');
 await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
 expect(await page.evaluate(()=>window.portfolioAnalytics)).toBeUndefined();
 expect(requests.every(url=>url.startsWith('http://127.0.0.1:4351/'))).toBe(true);
});

test('homepage print action opens the complete résumé without claiming a download',async({page})=>{
 await page.addInitScript(()=>{window.print=()=>{document.body.dataset.printed='yes'}});
 await page.goto('index.html');await page.getByRole('button',{name:'print résumé',exact:true}).click();
 await expect(page).toHaveURL(/resume.html\?print=1$/);await expect(page.locator('body')).toHaveAttribute('data-printed','yes');
 await expect(page.locator('.role')).toHaveCount(6);await expect(page.locator('a[download]')).toHaveCount(0);
});

test('normal-motion lightbox keeps one bounded animation and reveals do not replay on scroll',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('index.html');
 const role=page.locator('#role-0');await role.scrollIntoViewIfNeeded();await expect(role).toHaveClass(/is-revealed/);
 await role.evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));
 await page.locator('#about').scrollIntoViewIfNeeded();await role.scrollIntoViewIfNeeded();
 expect(await role.evaluate(element=>element.getAnimations().length)).toBe(0);
 await page.locator('[data-lightbox]').first().click();
 const samples=await page.locator('.lightbox').evaluate(async dialog=>{
  const result=[];const start=performance.now();
  while(performance.now()-start<350){result.push({overflow:dialog.scrollHeight-dialog.clientHeight,animations:dialog.querySelector('.image-stage').getAnimations().length});await new Promise(resolve=>requestAnimationFrame(resolve))}
  return result;
 });
 expect(samples.every(sample=>sample.overflow<=1&&sample.animations<=1)).toBe(true);
 await page.keyboard.press('Escape');await expect(page.locator('.lightbox')).not.toBeVisible();
});
