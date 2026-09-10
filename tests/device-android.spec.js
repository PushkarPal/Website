import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

test('Android-class layout keeps the carousel inside the visual viewport', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const geometry = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, width: box.width, height: box.height };
    };

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const poster = rect('.poster-viewport');
    const leftArrow = rect('.poster-arrow-left');
    const rightArrow = rect('.poster-arrow-right');

    return {
      viewportWidth,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      visualViewportWidth: window.visualViewport?.width ?? null,
      visualViewportHeight: window.visualViewport?.height ?? null,
      devicePixelRatio: window.devicePixelRatio,
      documentClientWidth: document.documentElement.clientWidth,
      bodyClientWidth: document.body.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      root: rect('#root'),
      landing: rect('.landing-page'),
      nav: rect('.landing-nav'),
      posterSection: rect('.poster-section'),
      shell: rect('.carousel-shell'),
      poster,
      leftArrow,
      rightArrow,
      leftGap: poster.left - leftArrow.right,
      rightGap: rightArrow.left - poster.right,
    };
  });

  expect(geometry.documentClientWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.bodyClientWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.bodyScrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.root.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.landing.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.nav.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.posterSection.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.shell.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.poster.width / geometry.viewportWidth).toBeGreaterThan(0.70);
  expect(geometry.poster.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.leftGap).toBeGreaterThanOrEqual(-1);
  expect(geometry.leftGap).toBeLessThanOrEqual(5);
  expect(geometry.rightGap).toBeGreaterThanOrEqual(-1);
  expect(geometry.rightGap).toBeLessThanOrEqual(5);

  await page.screenshot({ path: 'test-results/device-android.png', fullPage: true });
});
