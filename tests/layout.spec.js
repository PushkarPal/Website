import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
];

test.describe('responsive landing page geometry', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} stays within the viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });

      const geometry = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const landing = document.querySelector('.landing-page');
        const nav = document.querySelector('.landing-nav');
        const shell = document.querySelector('.carousel-shell');
        const poster = document.querySelector('.poster-viewport');
        const firstRow = document.querySelector('.category-row-five');
        const secondRow = document.querySelector('.category-row-four');

        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, width: box.width };
        };

        return {
          viewportWidth: root.clientWidth,
          scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
          landing: rect('.landing-page'),
          nav: rect('.landing-nav'),
          shell: rect('.carousel-shell'),
          poster: rect('.poster-viewport'),
          firstRow: rect('.category-row-five'),
          secondRow: rect('.category-row-four'),
        };
      });

      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);

      for (const selector of ['landing', 'nav', 'shell', 'poster', 'firstRow', 'secondRow']) {
        expect(geometry[selector]).not.toBeNull();
        expect(geometry[selector].left).toBeGreaterThanOrEqual(-1);
        expect(geometry[selector].right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      }

      expect(geometry.poster.width).toBeGreaterThan(0);
      expect(geometry.firstRow.width).toBeGreaterThan(0);
      expect(geometry.secondRow.width).toBeGreaterThan(0);
    });
  }
});
