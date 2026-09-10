import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-412', width: 412, height: 915 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

test.describe('responsive landing page geometry', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} preserves responsive geometry`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });

      const geometry = await page.evaluate(() => {
        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
            width: box.width,
            height: box.height,
            fontSize: style.fontSize,
          };
        };

        const links = [...document.querySelectorAll('.landing-nav a')];
        const rowFive = document.querySelector('.category-row-five');
        const rowFour = document.querySelector('.category-row-four');

        return {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          visualViewportWidth: window.visualViewport?.width ?? null,
          visualViewportHeight: window.visualViewport?.height ?? null,
          documentClientWidth: document.documentElement.clientWidth,
          bodyClientWidth: document.body.clientWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          root: rect('#root'),
          landing: rect('.landing-page'),
          header: rect('.landing-header'),
          logo: rect('.landing-logo'),
          nav: rect('.landing-nav'),
          firstRow: rect('.category-row-five'),
          separator: rect('.category-separator'),
          secondRow: rect('.category-row-four'),
          posterSection: rect('.poster-section'),
          shell: rect('.carousel-shell'),
          leftArrow: rect('.poster-arrow-left'),
          poster: rect('.poster-viewport'),
          rightArrow: rect('.poster-arrow-right'),
          categoryLinks: links.map((link) => {
            const icon = link.querySelector('.category-icon');
            const text = link.querySelector(':scope > span:last-child');
            const iconBox = icon.getBoundingClientRect();
            const textBox = text.getBoundingClientRect();
            return {
              iconWidth: iconBox.width,
              iconHeight: iconBox.height,
              iconBottom: iconBox.bottom,
              textTop: textBox.top,
              textHeight: textBox.height,
              fontSize: getComputedStyle(text).fontSize,
            };
          }),
          firstRowColumns: rowFive ? getComputedStyle(rowFive).gridTemplateColumns.split(' ').length : 0,
          secondRowColumns: rowFour ? getComputedStyle(rowFour).gridTemplateColumns.split(' ').length : 0,
          logicalPosterIds: [...new Set([...document.querySelectorAll('[data-poster-number]')].map((item) => item.dataset.posterNumber))],
        };
      });

      const { viewportWidth } = geometry;
      const assertViewportWidth = (box, minimumRatio = 0.98) => {
        expect(box).not.toBeNull();
        expect(box.left).toBeGreaterThanOrEqual(-1);
        expect(box.right).toBeLessThanOrEqual(viewportWidth + 1);
        expect(box.width / viewportWidth).toBeGreaterThan(minimumRatio);
      };

      // Global geometry: these roots must genuinely occupy the viewport.
      assertViewportWidth(geometry.root);
      assertViewportWidth(geometry.landing);
      assertViewportWidth(geometry.header);
      assertViewportWidth(geometry.nav);
      expect(geometry.documentClientWidth).toBe(viewportWidth);
      expect(geometry.bodyClientWidth).toBe(viewportWidth);
      expect(geometry.documentScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
      expect(geometry.bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

      // The real logo must fit inside its header rather than being vertically clipped.
      expect(geometry.logo.left).toBeGreaterThanOrEqual(geometry.header.left - 1);
      expect(geometry.logo.right).toBeLessThanOrEqual(geometry.header.right + 1);
      expect(geometry.logo.top).toBeGreaterThanOrEqual(geometry.header.top - 1);
      expect(geometry.logo.bottom).toBeLessThanOrEqual(geometry.header.bottom + 1);

      // The carousel occupies the main content width without becoming a narrow centered app.
      expect(geometry.shell).not.toBeNull();
      expect(geometry.shell.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.shell.right).toBeLessThanOrEqual(viewportWidth + 1);
      expect(geometry.shell.width / viewportWidth).toBeGreaterThan(0.94);

      // Navigation is exactly 5 + 4 categories with predictable fluid columns.
      expect(geometry.categoryLinks).toHaveLength(9);
      expect(geometry.firstRowColumns).toBe(5);
      expect(geometry.secondRowColumns).toBe(4);
      expect(geometry.firstRow.width / viewportWidth).toBeGreaterThan(0.95);
      expect(geometry.secondRow.width / viewportWidth).toBeGreaterThan(0.95);

      for (const category of geometry.categoryLinks) {
        if (viewport.width < 768) {
          expect(category.iconWidth).toBeGreaterThan(0.06 * viewportWidth);
          expect(category.iconHeight).toBeGreaterThan(0.06 * viewportWidth);
          expect(parseFloat(category.fontSize)).toBeGreaterThanOrEqual(12);
        }
        expect(category.textHeight).toBeGreaterThan(0);
        expect(category.iconBottom).toBeLessThanOrEqual(category.textTop);
        expect(category.textTop - category.iconBottom).toBeGreaterThanOrEqual(1);
        expect(category.textTop - category.iconBottom).toBeLessThanOrEqual(16);
      }

      // The separator must actually lie between the two category rows.
      expect(geometry.separator.left).toBeGreaterThanOrEqual(geometry.firstRow.left - 1);
      expect(geometry.separator.right).toBeLessThanOrEqual(geometry.firstRow.right + 1);
      expect(geometry.separator.top).toBeGreaterThanOrEqual(geometry.firstRow.bottom - 1);
      expect(geometry.separator.bottom).toBeLessThanOrEqual(geometry.secondRow.top + 1);

      // Poster is a large centered composition with externally positioned arrows.
      expect(geometry.poster.left).toBeGreaterThan(0);
      expect(geometry.poster.right).toBeLessThan(viewportWidth);
      if (viewport.width < 768) {
        expect(geometry.poster.width / viewportWidth).toBeGreaterThan(0.72);
        expect(geometry.poster.width / viewportWidth).toBeLessThan(0.90);
        expect(geometry.poster.top - geometry.nav.bottom).toBeGreaterThan(8);
        expect(geometry.poster.top - geometry.nav.bottom).toBeLessThan(40);
      }
      expect(geometry.poster.height / geometry.poster.width).toBeGreaterThan(1.55);
      expect(geometry.poster.height / geometry.poster.width).toBeLessThan(1.75);
      expect(geometry.leftArrow.right).toBeLessThanOrEqual(geometry.poster.left + 12);
      expect(geometry.rightArrow.left).toBeGreaterThanOrEqual(geometry.poster.right - 12);
      expect(geometry.leftArrow.right).toBeLessThanOrEqual(geometry.poster.left);
      expect(geometry.rightArrow.left).toBeGreaterThanOrEqual(geometry.poster.right);

      // Five logical posters are represented; clones are implementation details for looping.
      expect(geometry.logicalPosterIds.sort()).toEqual(['1', '2', '3', '4', '5']);

      if (viewport.width < 768) {
        expect(geometry.header.height / viewport.height).toBeLessThan(0.18);
        expect(geometry.logo.width / viewportWidth).toBeGreaterThan(0.35);
      } else {
        expect(geometry.poster.width).toBeLessThanOrEqual(600);
      }

      await page.screenshot({
        path: `test-results/${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
});
