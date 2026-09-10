import { test, expect, devices } from '@playwright/test';

const mobileDevices = [
  { name: 'iphone-class', device: devices['iPhone 13'] },
  { name: 'android-class', device: devices['Pixel 7'] },
];

for (const { name, device } of mobileDevices) {
  test.describe(`${name} responsive composition`, () => {
    test.use({ ...device });

    test('keeps the document and carousel inside the visual viewport', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const geometry = await page.evaluate(() => {
        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            left: box.left,
            right: box.right,
            width: box.width,
            height: box.height,
          };
        };

        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const poster = rect('.poster-viewport');
        const shell = rect('.carousel-shell');
        const leftArrow = rect('.poster-arrow-left');
        const rightArrow = rect('.poster-arrow-right');

        return {
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
          shell,
          poster,
          leftArrow,
          rightArrow,
          arrowPosterGaps: {
            left: poster.left - leftArrow.right,
            right: rightArrow.left - poster.right,
          },
          viewportWidth,
        };
      });

      expect(geometry.documentClientWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      expect(geometry.bodyClientWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      expect(geometry.bodyScrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);

      for (const box of [geometry.root, geometry.landing, geometry.nav, geometry.posterSection, geometry.shell]) {
        expect(box.left).toBeGreaterThanOrEqual(-1);
        expect(box.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      }

      expect(geometry.poster.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.poster.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      expect(geometry.poster.width / geometry.viewportWidth).toBeGreaterThan(0.70);
      expect(geometry.arrowPosterGaps.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.arrowPosterGaps.left).toBeLessThanOrEqual(4);
      expect(geometry.arrowPosterGaps.right).toBeGreaterThanOrEqual(-1);
      expect(geometry.arrowPosterGaps.right).toBeLessThanOrEqual(4);

      await page.screenshot({
        path: `test-results/device-${name}.png`,
        fullPage: true,
      });
    });
  });
}
