import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("filters personal and academic projects without losing the résumé", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/demo/");
  await expect(
    page.locator('astro-island[component-export="default"]').first(),
  ).not.toHaveAttribute("ssr", "");
  const projects = page.locator("#projects");
  await expect(projects.locator(".project-card")).toHaveCount(4);
  await projects.getByRole("button", { name: "Academic", exact: true }).click();
  await expect(projects.locator(".project-card")).toHaveCount(2);
  await expect(
    projects.getByRole("heading", { name: "Personal projects" }),
  ).toHaveCount(0);
  await expect(
    projects.getByRole("button", { name: "Academic", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await projects.getByRole("button", { name: "Personal", exact: true }).click();
  await expect(
    projects.getByRole("heading", { name: "Personal projects" }),
  ).toBeVisible();
  await expect(
    projects.getByRole("heading", { name: "Academic projects" }),
  ).toHaveCount(0);
  await projects.getByRole("button", { name: "All", exact: true }).click();
  await expect(projects.locator(".project-card")).toHaveCount(4);
  await expect(
    page.getByRole("heading", { name: "Experience", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".links-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("gallery supports keyboard navigation, traps focus and restores it on Escape", async ({
  page,
}) => {
  await page.goto("/demo/");
  const opener = page.getByRole("button", {
    name: "Enlarge photograph 1: Mountains & cloud",
  });
  await opener.click();
  const viewer = page.getByRole("dialog", { name: "Photography viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("img")).toHaveJSProperty("complete", true);
  await expect(viewer.locator("img")).not.toHaveJSProperty("naturalWidth", 0);
  await expect(
    page.getByRole("button", { name: "Close photography viewer" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("A little color on the road");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer).toContainText("Mountains & cloud");
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Next photograph" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
  await opener.click();
  await page.getByRole("button", { name: "Previous photograph" }).click();
  await expect(viewer).toContainText("A moment outdoors");
  await page.getByRole("button", { name: "Close photography viewer" }).click();
  await expect(opener).toBeFocused();
});

test("accessible page, responsive layout, mobile navigation and print action", async ({
  page,
  isMobile,
}) => {
  await page.goto("/demo/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ojesvi Dogra.",
  );
  if (isMobile) {
    await page.locator(".mobile-nav summary").click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About me" })
      .click();
    await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open", "");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printed = "yes";
    };
  });
  await page.getByRole("button", { name: "Save résumé" }).last().click();
  await expect(page.locator("body")).toHaveAttribute("data-printed", "yes");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#experience")).toBeVisible();
  await expect(page.locator("#projects")).not.toBeVisible();
  await expect(page.locator(".links-card")).toBeVisible();
});

test("résumé and all projects render without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(
    page.getByRole("heading", { name: "Experience", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(page.locator(".gallery-grid img")).toHaveCount(3);
  await context.close();
});

test("carousel slides, opens the selected photo, and animates dismissal", async ({
  page,
}) => {
  await page.goto("/demo/");
  const gallery = page.getByRole("region", { name: "Personal photography" });
  const track = gallery.locator(".gallery-grid");
  await gallery.getByRole("button", { name: "Next carousel image" }).click();
  await expect(gallery.getByRole("status")).toContainText(
    "A little color on the road · 2 / 3",
  );
  await expect(track).toHaveCSS("transform", /matrix\(1, 0, 0, 1, -/);
  await expect(
    gallery.getByRole("button", { name: /Enlarge photograph/ }),
  ).toHaveCount(1);
  const opener = gallery.getByRole("button", {
    name: "Enlarge photograph 2: A little color on the road",
  });
  await opener.click();
  const viewer = page.getByRole("dialog", { name: "Photography viewer" });
  await expect(viewer).toContainText("A little color on the road");
  await expect(viewer.locator(".lightbox-inner")).toHaveCSS(
    "animation-name",
    "gallery-open",
  );
  await page.getByRole("button", { name: "Close photography viewer" }).click();
  await expect(viewer).toHaveClass(/is-closing/);
  await expect(viewer).not.toBeVisible();
  await expect(opener).toBeFocused();
  await gallery
    .getByRole("button", { name: "Previous carousel image" })
    .click();
  await expect(gallery.getByRole("status")).toContainText(
    "Mountains & cloud · 1 / 3",
  );
  await gallery
    .getByRole("button", { name: "Previous carousel image" })
    .click();
  await expect(gallery.getByRole("status")).toContainText(
    "A moment outdoors · 3 / 3",
  );
  await gallery
    .getByRole("button", { name: "Show photograph 1: Mountains & cloud" })
    .click();
  await expect(gallery.getByRole("status")).toContainText(
    "Mountains & cloud · 1 / 3",
  );
});

test("reduced motion disables sliding and opens and closes the viewer immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/");
  const gallery = page.getByRole("region", { name: "Personal photography" });
  await expect(gallery.locator(".gallery-grid")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await gallery.getByRole("button", { name: /Enlarge photograph 1:/ }).click();
  const viewer = page.getByRole("dialog", { name: "Photography viewer" });
  await expect(viewer.locator(".lightbox-inner")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(
    gallery.getByRole("button", { name: /Enlarge photograph 1:/ }),
  ).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

test("every gallery image has attribution and blocks context menus and dragging", async ({
  page,
}) => {
  await page.goto("/demo/");
  const gallery = page.getByRole("region", { name: "Personal photography" });
  await expect(gallery.locator(".image-copyright")).toHaveCount(3);
  for (let index = 1; index <= 3; index++) {
    await gallery
      .getByRole("button", { name: new RegExp(`Show photograph ${index}:`) })
      .click();
    const opener = gallery.getByRole("button", {
      name: new RegExp(`Enlarge photograph ${index}:`),
    });
    await expect(opener.locator(".image-copyright")).toBeVisible();
    const image = opener.locator("img");
    await expect(image).toHaveAttribute("draggable", "false");
    expect(
      await image.evaluate((element) =>
        element.dispatchEvent(
          new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
        ),
      ),
    ).toBe(false);
    expect(
      await image.evaluate((element) =>
        element.dispatchEvent(
          new Event("dragstart", { bubbles: true, cancelable: true }),
        ),
      ),
    ).toBe(false);
    await opener.click();
    const viewer = page.getByRole("dialog", { name: "Photography viewer" });
    await expect(viewer.locator(".image-copyright")).toHaveText(
      "© Ojesvi Dogra · All rights reserved",
    );
    await expect(viewer.locator(".image-copyright")).toBeVisible();
    await expect(viewer.locator("img")).toHaveAttribute("draggable", "false");
    expect(
      await viewer
        .locator("img")
        .evaluate((element) =>
          element.dispatchEvent(
            new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
          ),
        ),
    ).toBe(false);
    await page.keyboard.press("Escape");
    await expect(viewer).not.toBeVisible();
  }
});

test("navigation follows scrolling and experience reveals once", async ({ page, isMobile }) => {
  await page.goto('/demo/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#about').evaluate(section => window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }));
  const navigation = page.getByRole('navigation', { name: isMobile ? 'Mobile navigation' : 'Main navigation', exact: true });
  if (isMobile) await page.locator('.mobile-nav summary').click();
  await expect(navigation.getByRole('link', { name: 'About me', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(navigation.locator('[aria-current]')).toHaveCount(1);
  if (isMobile) await page.locator('.mobile-nav summary').click();
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect(page.locator('.job').first()).toHaveClass(/is-revealed/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('.job').last().scrollIntoViewIfNeeded();
  await expect(page.locator('.job').last()).toHaveClass(/is-revealed/);
});

test("project filters work without view transitions and motion stays disabled when requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/');
  await page.evaluate(() => { Object.defineProperty(document, 'startViewTransition', { value: undefined, configurable: true }); });
  await expect(page.locator('.hero-copy h1')).toHaveCSS('animation-name', 'none');
  const projects = page.locator('#projects');
  await projects.getByRole('button', { name: 'Academic', exact: true }).click();
  await expect(projects.locator('.project-card')).toHaveCount(2);
  await expect(projects.locator('.project-card').first()).toHaveCSS('animation-name', 'none');
  await projects.getByRole('button', { name: 'All', exact: true }).click();
  await expect(projects.locator('.project-card')).toHaveCount(4);
});

test('reading progress tracks scrolling and responds to expanded roles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/');
  const bar = page.locator('.reading-progress');
  await expect(bar).toBeVisible();
  await expect(bar.locator('span')).toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(bar.locator('span')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  const details = page.locator('.experience-details').first();
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('.experience-content')).toBeVisible();
  await expect(details.getByText('Java', { exact: true })).toBeVisible();
  await details.locator('summary').press('Enter');
  await expect(details).not.toHaveAttribute('open', '');
  await expect(details.locator('.experience-content')).not.toBeVisible();
});

test('project details support keyboard access, accessible content and focus restoration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/');
  const opener = page.getByRole('button', { name: 'Explore project: [Personal project name]', exact: true });
  await opener.focus();
  await opener.press('Enter');
  const panel = page.getByRole('dialog', { name: '[Personal project name]', exact: true });
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Template project · Replace these prompts');
  await expect(panel.getByRole('heading', { name: 'The problem' })).toBeVisible();
  const close = panel.getByRole('button', { name: 'Close project details' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await page.locator('#projects').getByRole('button', { name: 'Academic', exact: true }).click();
  await page.getByRole('button', { name: 'Explore project: [Academic project name]', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '[Academic project name]', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close project details' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('experience remains expandable without JavaScript and prints all achievements', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const details = page.locator('.experience-details').first();
  await details.locator('summary').click();
  await expect(details.locator('.experience-content')).toBeVisible();
  await details.locator('summary').click();
  await page.emulateMedia({ media: 'print' });
  await expect(details.locator('.experience-content')).toBeVisible();
  await expect(page.locator('.reading-progress')).not.toBeVisible();
  await context.close();
});

test('project panel animates opening and closing', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Explore project: [Personal project name]', exact: true }).click();
  const panel = page.getByRole('dialog', { name: '[Personal project name]', exact: true });
  await expect(panel.locator('.project-dialog-content')).toHaveCSS('animation-name', 'project-panel-in');
  await page.getByRole('button', { name: 'Close project details' }).click();
  await expect(panel).toHaveClass(/is-closing/);
  await expect(panel).not.toBeVisible();
});
