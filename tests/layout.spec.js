import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
];

test.describe('responsive landing page rendered validation', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} renders the intended composition`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      const geometry = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
        };

        const categories = [...document.querySelectorAll('.landing-nav a')].map((link) => {
          const icon = link.querySelector('.category-icon');
          const text = link.querySelector(':scope > span:last-child');
          if (!icon || !text) return null;
          const iconBox = icon.getBoundingClientRect();
          const textBox = text.getBoundingClientRect();
          return {
            iconBottom: iconBox.bottom,
            textTop: textBox.top,
            iconHeight: iconBox.height,
            textHeight: textBox.height,
          };
        });

        return {
          viewportWidth: root.clientWidth,
          scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
          landing: rect('.landing-page'),
          nav: rect('.landing-nav'),
          shell: rect('.carousel-shell'),
          poster: rect('.poster-viewport'),
          firstRow: rect('.category-row-five'),
          secondRow: rect('.category-row-four'),
          separator: rect('.category-separator'),
          leftArrow: rect('.poster-arrow-left'),
          rightArrow: rect('.poster-arrow-right'),
          categories,
        };
      });

      // Hard layout constraints: the rendered page must fit the viewport.
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      for (const selector of ['landing', 'nav', 'shell', 'poster', 'firstRow', 'secondRow', 'separator', 'leftArrow', 'rightArrow']) {
        expect(geometry[selector]).not.toBeNull();
        expect(geometry[selector].left).toBeGreaterThanOrEqual(-1);
        expect(geometry[selector].right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
      }

      // Rendered composition constraints: every category has a real icon/text stack,
      // and the icon is visibly separated from its label instead of relying on row height.
      expect(geometry.categories).toHaveLength(9);
      for (const category of geometry.categories) {
        expect(category.iconHeight).toBeGreaterThan(0);
        expect(category.textHeight).toBeGreaterThan(0);
        expect(category.textTop - category.iconBottom).toBeGreaterThanOrEqual(2);
        expect(category.textTop - category.iconBottom).toBeLessThanOrEqual(16);
      }

      // The dedicated separator must sit between the two rendered category rows.
      expect(geometry.separator.top).toBeGreaterThanOrEqual(geometry.firstRow.bottom - 1);
      expect(geometry.separator.bottom).toBeLessThanOrEqual(geometry.secondRow.top + 1);

      // Capture the actual rendered page for human visual inspection in CI artifacts.
      await page.screenshot({
        path: `test-results/${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
});
