import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('uploaded demo loads at /demo/ with no missing resources or script errors', async ({ page }) => {
  const errors: string[] = [], missing: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ojesvi Dogra.');
  await expect(page.locator('.demo-controls')).toBeVisible();
  await expect(page.locator('.impact-card')).toHaveCount(3);
  await expect(page.locator('.practice-card')).toHaveCount(3);
  // Off-screen carousel images are lazy-loaded; verify each when it is selected.
  for (let index = 1; index <= 3; index++) {
    await page.getByRole('button', { name: new RegExp(`^Show photograph ${index}:`) }).click();
    const image = page.locator('.carousel-slide[aria-hidden="false"] img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  for (const image of await page.locator('.photo-thumbnails img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});

test('project filters and concept walkthrough preserve honest labels and keyboard access', async ({ page }) => {
  await page.goto('/demo/');
  const projects = page.locator('#projects');
  await expect(projects.locator('.enhanced-card:visible')).toHaveCount(4);
  await projects.getByRole('button', { name: 'Academic', exact: true }).click();
  await expect(projects.locator('.enhanced-card:visible')).toHaveCount(2);
  await expect(projects.getByRole('status')).toContainText('2 concepts');
  await projects.getByRole('button', { name: 'Personal', exact: true }).click();
  const opener = projects.locator('[data-project="0"]');
  await opener.click();
  const panel = page.getByRole('dialog', { name: 'Family Finance Dashboard' });
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('not a claim of completed delivery');
  await expect(panel.locator('.story-controls span')).toHaveText('1 / 3');
  await panel.getByRole('button', { name: 'Next project step' }).click();
  await expect(panel.locator('.story-screen')).toContainText('02 · Design');
  await panel.getByRole('button', { name: 'Next project step' }).click();
  await expect(panel.locator('.story-screen')).toContainText('03 · Validate');
  await panel.getByRole('button', { name: 'Previous project step' }).click();
  await expect(panel.locator('.story-screen')).toContainText('02 · Design');
  await panel.getByRole('button', { name: 'Back to projects' }).focus();
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Close project details' })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await projects.getByRole('button', { name: 'All', exact: true }).click();
  await expect(projects.locator('.enhanced-card:visible')).toHaveCount(4);
});

test('skills expose evidence and open the relevant experience', async ({ page }) => {
  await page.goto('/demo/');
  const skill = page.locator('#skills').getByRole('button', { name: 'Java', exact: true });
  await skill.click();
  await expect(skill).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#skill-evidence')).toContainText('enterprise scheduling');
  await expect(page.locator('.skill-group').first().locator('.coverage-value')).toHaveText('1 / 6');
  await skill.click();
  await expect(page.locator('.skill-group').first().locator('.coverage-value')).toHaveText('1 / 6');
  await page.getByRole('link', { name: 'View related experience' }).click();
  await expect(page.locator('#role-2 details')).toHaveAttribute('open', '');
  await page.locator('#role-2 summary').press('Enter');
  await expect(page.locator('#role-2 details')).not.toHaveAttribute('open', '');
  // Role progression must not send evidence links to the former numeric positions.
  for (const [label, target, role] of [
    ['AI agents', '#role-0', 'Systems Engineer'],
    ['WordPress', '#role-4', 'Website Coordinator'],
    ['Citrix', '#role-5', 'Junior Network Analyst'],
  ]) {
    await page.locator('#skills').getByRole('button', { name: label, exact: true }).click();
    const link = page.getByRole('link', { name: 'View related experience' });
    await expect(link).toHaveAttribute('href', target);
    await link.click();
    await expect(page.locator(`${target} details`)).toHaveAttribute('open', '');
    await expect(page.locator(target).getByRole('heading', { name: role, exact: true })).toBeVisible();
  }
});

test('photo carousel, thumbnail filters, zoom and keyboard navigation work with attribution', async ({ page }) => {
  await page.goto('/demo/');
  const gallery = page.getByRole('region', { name: 'Personal photography' });
  await gallery.getByRole('button', { name: 'Next carousel image' }).click();
  await expect(gallery.locator('.carousel-caption')).toContainText('A little color on the road · 2 / 3');
  const opener = gallery.getByRole('button', { name: /^Enlarge photograph 2:/ });
  await opener.click();
  const viewer = page.getByRole('dialog', { name: 'Photography viewer' });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('.image-copyright')).toBeVisible();
  await viewer.getByRole('button', { name: 'Next enlarged photograph' }).click();
  await expect(viewer).toContainText('A moment outdoors');
  await expect(viewer.getByRole('button', { name: 'Next enlarged photograph' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(viewer).toContainText('Mountains & cloud');
  await viewer.locator('img').focus();
  await page.keyboard.press('Enter');
  await expect(viewer.locator('img')).toHaveClass('photo-zoomed');
  await page.keyboard.press('Enter');
  await expect(viewer.locator('img')).not.toHaveClass('photo-zoomed');
  await page.keyboard.press('Escape');
  await expect(viewer).not.toBeVisible();
  await expect(gallery.getByRole('button', { name: /^Enlarge photograph 1:/ })).toBeFocused();
  const filters = gallery.getByRole('group', { name: 'Filter photographs' });
  await filters.getByRole('button', { name: 'Landscape', exact: true }).click();
  await expect(gallery.locator('[data-photo]:visible')).toHaveCount(1);
  await filters.getByRole('button', { name: 'Details', exact: true }).click();
  await expect(gallery.locator('[data-photo]:visible')).toHaveCount(2);
  await gallery.locator('[data-photo="2"]').click();
  await expect(viewer).toContainText('A moment outdoors');
  await viewer.getByRole('button', { name: 'Close photography viewer' }).click();
  await expect(viewer).not.toBeVisible();
  await expect(gallery.locator('[data-photo="2"]')).toBeFocused();
});

test('all image variants retain saving deterrents and visible copyright', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('#about').scrollIntoViewIfNeeded();
  const gridImage = page.locator('[data-photo="0"] img');
  await expect(gridImage).toHaveAttribute('draggable', 'false');
  await expect(page.locator('[data-photo="0"] .thumbnail-copyright')).toBeVisible();
  expect(await gridImage.evaluate(element => element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true })))).toBe(false);
  expect(await gridImage.evaluate(element => element.dispatchEvent(new Event('dragstart', { bubbles: true, cancelable: true })))).toBe(false);
  await page.locator('[data-photo="0"]').click();
  const viewer = page.getByRole('dialog', { name: 'Photography viewer' });
  await expect(viewer.locator('.image-copyright')).toHaveText('© Ojesvi Dogra · All rights reserved');
  await expect(viewer.locator('img')).toHaveAttribute('draggable', 'false');
  expect(await viewer.locator('img').evaluate(element => element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true })))).toBe(false);
});

test('light and dark themes remain accessible and fit mobile screens', async ({ page }) => {
  await page.goto('/demo/');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: /^Dark theme/ }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('button', { name: /^Light theme/ })).toHaveAttribute('aria-pressed', 'true');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('navigation, progress and print preserve the résumé', async ({ page, isMobile }) => {
  await page.goto('/demo/');
  if (isMobile) await page.locator('.mobile-nav summary').click();
  const nav = page.getByRole('navigation', { name: isMobile ? 'Mobile navigation' : 'Main navigation', exact: true });
  await nav.getByRole('link', { name: 'About me', exact: true }).click();
  if (isMobile) await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
  await expect(page.locator('.desktop-nav a[href="#about"]')).toHaveAttribute('aria-current', 'location');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('.reading-progress span')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await expect(page.locator('.experience-details[open]')).toHaveCount(6);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('.demo-controls')).not.toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await expect(page.locator('.experience-details[open]')).toHaveCount(0);
});

test('working principles have manual and optional playback controls', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('.principle-stage')).toContainText('Start with the problem.');
  await page.getByRole('button', { name: 'Next principle' }).click();
  await expect(page.locator('.principle-stage')).toContainText('Make the useful thing dependable.');
  await page.getByRole('button', { name: 'Previous principle' }).click();
  await expect(page.locator('.principle-stage')).toContainText('Start with the problem.');
  await page.getByRole('button', { name: 'Play slideshow' }).click();
  await expect(page.getByRole('button', { name: 'Pause slideshow' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Pause slideshow' }).click();
  await expect(page.getByRole('button', { name: 'Play slideshow' })).toHaveAttribute('aria-pressed', 'false');
});

test('contact preview validates input and sends no messages', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/demo/');
  const form = page.locator('.contact-preview');
  expect(await form.evaluate((element: HTMLFormElement) => element.checkValidity())).toBe(false);
  await form.getByLabel('Your name').fill('Portfolio Tester');
  await form.getByLabel('Email address').fill('test@example.com');
  await form.getByLabel('Your message').fill('Testing the new interactive portfolio demo.');
  await form.getByRole('button', { name: 'Preview submission' }).click();
  await expect(form.getByRole('status')).toContainText('No message was sent');
  expect(posts).toEqual([]);
});

test('motion can be paused and replayed without breaking filtering or dialogs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/motion-off/);
  await page.getByRole('button', { name: 'Replay entrances' }).click();
  await page.locator('.filter-group').getByRole('button', { name: 'Academic', exact: true }).click();
  await expect(page.locator('.enhanced-card:visible')).toHaveCount(2);
  await page.locator('[data-project="2"]').click();
  await expect(page.getByRole('dialog', { name: 'Retail Analytics' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Retail Analytics' })).not.toBeVisible();
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await expect(page.locator('html')).not.toHaveClass(/motion-off/);
});

test('static résumé stays readable with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  const details = page.locator('.experience-details').first();
  await details.locator('summary').click();
  await expect(details.locator('.experience-content')).toBeVisible();
  await expect(page.locator('.project-card')).toHaveCount(4);
  await context.close();
});

test('animated filters, expanding roles and viewer transitions complete', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/demo/');
  const details = page.locator('.experience-details').first();
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('.experience-content')).toBeVisible();
  await details.evaluate(element => Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished)));
  await details.locator('summary').click();
  await expect(details).not.toHaveAttribute('open', '');
  await page.locator('.filter-group').getByRole('button', { name: 'Personal', exact: true }).click();
  await expect(page.locator('.enhanced-card:visible')).toHaveCount(2);
  await page.locator('[data-project="0"]').click();
  const panel = page.getByRole('dialog', { name: 'Family Finance Dashboard' });
  await expect(panel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await page.getByRole('button', { name: /^Enlarge photograph 1:/ }).click();
  const viewer = page.getByRole('dialog', { name: 'Photography viewer' });
  await expect(viewer).toBeVisible();
  await viewer.getByRole('button', { name: 'Close photography viewer' }).click();
  await expect(viewer).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('layout reflows during window resizing and filtered cards fill their grid', async ({ page }) => {
  await page.goto('/demo/');
  for (const width of [320, 390, 559, 640, 768, 900, 1024, 1180, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('.filter-group').getByRole('button', { name: 'Academic', exact: true }).click();
    await expect(page.locator('.enhanced-card:visible')).toHaveCount(2);
    const layout = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const grid = rect('.motion-project-grid');
      const cards = [...document.querySelectorAll('.enhanced-card:not([hidden])')].map(card => card.getBoundingClientRect());
      const copy = rect('.about-layout > div');
      const gallery = rect('.gallery');
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        containerWidth: rect('.hero').width,
        firstCardGap: cards[0].left - grid.left,
        lastCardGap: grid.right - cards[cards.length - 1].right,
        sameRow: gallery.left >= copy.right,
        aboutTopGap: gallery.top - copy.top,
        aboutStackGap: gallery.top - copy.bottom,
        experienceWidth: rect('#experience').width,
      };
    });
    expect(layout.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.firstCardGap)).toBeLessThan(2);
    expect(Math.abs(layout.lastCardGap), `unused project columns at ${width}px`).toBeLessThan(2);
    if (layout.sameRow) expect(Math.abs(layout.aboutTopGap)).toBeLessThan(2);
    else expect(layout.aboutStackGap, `empty space before gallery at ${width}px`).toBeLessThanOrEqual(64);
    if (width === 900) expect(layout.experienceWidth).toBeGreaterThan(layout.containerWidth * .9);
    if (width >= 1920) expect(layout.containerWidth).toBeGreaterThan(1500);
    await page.locator('.filter-group').getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.locator('.enhanced-card:visible')).toHaveCount(4);
  }
});

test('open experience and dialogs remain usable after portrait and landscape resizing', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('.experience-details').first().locator('summary').click();
  await page.locator('[data-project="0"]').click();
  const panel = page.getByRole('dialog', { name: 'Family Finance Dashboard' });
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    const bounds = await panel.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height + 1);
    await expect(panel.getByRole('button', { name: 'Close project details' })).toBeVisible();
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('.experience-details').first()).toHaveAttribute('open', '');
});

test('image opening has one smooth transition with no scrollbar flash or layout jump', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/demo/');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    const opener = page.locator('[data-photo="0"]');
    await opener.scrollIntoViewIfNeeded();
    await opener.locator('img').evaluate(image => image.decode());
    await opener.focus();
    const result = await opener.evaluate(async button => {
      const gallery = document.querySelector('.gallery')!;
      const left = gallery.getBoundingClientRect().left;
      (button as HTMLButtonElement).click();
      const dialog = document.querySelector<HTMLDialogElement>('.lightbox')!;
      const stage = dialog.querySelector<HTMLElement>('.protected-image')!;
      const initial = dialog.getBoundingClientRect();
      const samples: { overflow: number; heightChange: number; widthChange: number; animationCount: number; overflowMode: string; shift: number }[] = [];
      const start = performance.now();
      while (performance.now() - start < 400) {
        const bounds = dialog.getBoundingClientRect();
        samples.push({
          overflow: dialog.scrollHeight - dialog.clientHeight,
          heightChange: Math.abs(bounds.height - initial.height),
          widthChange: Math.abs(bounds.width - initial.width),
          animationCount: stage.getAnimations().length,
          overflowMode: getComputedStyle(dialog).overflow,
          shift: Math.abs(gallery.getBoundingClientRect().left - left),
        });
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      }
      return samples;
    });
    expect(result.length).toBeGreaterThan(1);
    for (const sample of result) {
      expect(sample.overflow, `dialog overflow at ${viewport.width}px`).toBeLessThanOrEqual(1);
      expect(sample.heightChange).toBeLessThanOrEqual(1);
      expect(sample.widthChange).toBeLessThanOrEqual(1);
      expect(sample.animationCount).toBeLessThanOrEqual(1);
      expect(sample.overflowMode).toBe('hidden');
      expect(sample.shift).toBeLessThanOrEqual(1);
    }
    const viewer = page.getByRole('dialog', { name: 'Photography viewer' });
    await expect(viewer.locator('img')).toHaveJSProperty('complete', true);
    await expect(viewer.locator('img')).not.toHaveJSProperty('naturalWidth', 0);
    await viewer.getByRole('button', { name: 'Close photography viewer' }).click();
    await expect(viewer).not.toBeVisible();
    await expect(opener).toBeFocused();
  }
});

test('zoom remains pannable without visible scrollbars', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('[data-photo="0"]').click();
  const viewer = page.getByRole('dialog', { name: 'Photography viewer' });
  const image = viewer.locator('img');
  await image.focus();
  await image.press('Enter');
  const stage = viewer.locator('.protected-image');
  await expect(stage).toHaveClass(/is-zoomed/);
  await expect(stage).toHaveCSS('overflow', 'auto');
  await expect(stage).toHaveCSS('scrollbar-width', 'none');
  await stage.evaluate(element => element.scrollTo({ top: 80, left: 80 }));
  expect(await stage.evaluate(element => element.scrollTop > 0 || element.scrollLeft > 0)).toBe(true);
  await image.press('Enter');
  await expect(stage).not.toHaveClass(/is-zoomed/);
  await expect(stage).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Escape');
  await expect(viewer).not.toBeVisible();
});
