import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-320', width: 320, height: 700 },
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-412', width: 412, height: 915 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'mobile-480', width: 480, height: 900 },
  { name: 'mobile-600', width: 600, height: 960 },
  { name: 'mobile-691', width: 691, height: 1000 },
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const selectors = [
  '#root', '.landing-page', '.landing-header', '.landing-logo', '.landing-nav',
  '.category-row-five', '.category-separator', '.category-row-four', '.poster-section',
  '.carousel-shell', '.poster-arrow-left', '.poster-viewport', '.poster-track',
  '.poster-box', '.poster-arrow-right',
];

test.describe('responsive landing page geometry', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} preserves responsive geometry`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });

      const geometry = await page.evaluate((requestedSelectors) => {
        const rectFor = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
        };
        const rowFive = document.querySelector('.category-row-five');
        const rowFour = document.querySelector('.category-row-four');
        const posterRect = rectFor('.poster-viewport');
        const shellRect = rectFor('.carousel-shell');
        const leftArrowRect = rectFor('.poster-arrow-left');
        const rightArrowRect = rectFor('.poster-arrow-right');
        const viewportWidth = window.innerWidth;
        const elements = Object.fromEntries(requestedSelectors.map((selector) => [selector, rectFor(selector)]));
        return {
          viewport: { innerWidth: viewportWidth, innerHeight: window.innerHeight, devicePixelRatio: window.devicePixelRatio, visualWidth: window.visualViewport?.width ?? null, visualHeight: window.visualViewport?.height ?? null },
          document: { clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, bodyClientWidth: document.body.clientWidth, bodyScrollWidth: document.body.scrollWidth, documentScrollWidth: document.documentElement.scrollWidth },
          elements,
          ratios: { root: elements['#root'].width / viewportWidth, landing: elements['.landing-page'].width / viewportWidth, header: elements['.landing-header'].width / viewportWidth, nav: elements['.landing-nav'].width / viewportWidth, poster: posterRect.width / viewportWidth, shell: shellRect.width / viewportWidth },
          carousel: {
            posterLeftInset: posterRect.left, posterRightInset: viewportWidth - posterRect.right,
            shellLeftInset: shellRect.left, shellRightInset: viewportWidth - shellRect.right,
            leftArrowGap: posterRect.left - leftArrowRect.right, rightArrowGap: rightArrowRect.left - posterRect.right,
            shellContainsPoster: posterRect.left >= shellRect.left && posterRect.right <= shellRect.right,
            shellContainsLeftArrow: leftArrowRect.left >= shellRect.left && leftArrowRect.right <= shellRect.right,
            shellContainsRightArrow: rightArrowRect.left >= shellRect.left && rightArrowRect.right <= shellRect.right,
            trackWidth: elements['.poster-track'].width, viewportWidth: posterRect.width,
          },
          category: {
            linkCount: document.querySelectorAll('.landing-nav a').length,
            firstRowColumns: rowFive ? getComputedStyle(rowFive).gridTemplateColumns.split(' ').length : 0,
            secondRowColumns: rowFour ? getComputedStyle(rowFour).gridTemplateColumns.split(' ').length : 0,
            firstRowWidth: rowFive?.getBoundingClientRect().width ?? 0,
            secondRowWidth: rowFour?.getBoundingClientRect().width ?? 0,
            separatorTop: document.querySelector('.category-separator')?.getBoundingClientRect().top ?? null,
            firstRowBottom: rowFive?.getBoundingClientRect().bottom ?? null,
            secondRowTop: rowFour?.getBoundingClientRect().top ?? null,
          },
          logicalPosterIds: [...new Set([...document.querySelectorAll('[data-poster-number]')].map((item) => item.dataset.posterNumber))],
        };
      }, selectors);

      const widthTolerance = 1;
      const viewportWidth = geometry.viewport.innerWidth;
      const isMobile = viewportWidth < 768;
      expect(geometry.document.clientWidth).toBe(viewportWidth);
      expect(geometry.document.bodyClientWidth).toBe(viewportWidth);
      expect(geometry.document.documentScrollWidth).toBeLessThanOrEqual(viewportWidth + widthTolerance);
      expect(geometry.document.bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + widthTolerance);

      for (const selector of ['#root', '.landing-page', '.landing-header', '.landing-nav', '.poster-section']) {
        const box = geometry.elements[selector];
        expect(box).not.toBeNull();
        expect(box.left).toBeGreaterThanOrEqual(-widthTolerance);
        expect(box.right).toBeLessThanOrEqual(viewportWidth + widthTolerance);
        expect(box.width / viewportWidth).toBeGreaterThan(0.98);
      }

      const header = geometry.elements['.landing-header'];
      const logo = geometry.elements['.landing-logo'];
      expect(logo.left).toBeGreaterThanOrEqual(header.left - widthTolerance);
      expect(logo.right).toBeLessThanOrEqual(header.right + widthTolerance);
      expect(Math.abs((logo.left + logo.right) / 2 - viewportWidth / 2)).toBeLessThan(2);

      expect(geometry.category.linkCount).toBe(9);
      expect(geometry.category.firstRowColumns).toBe(5);
      expect(geometry.category.secondRowColumns).toBe(4);
      expect(geometry.category.firstRowWidth / viewportWidth).toBeGreaterThan(0.95);
      expect(geometry.category.secondRowWidth / viewportWidth).toBeGreaterThan(0.95);
      expect(geometry.category.separatorTop).toBeGreaterThanOrEqual(geometry.category.firstRowBottom - widthTolerance);
      expect(geometry.category.separatorTop).toBeLessThanOrEqual(geometry.category.secondRowTop + widthTolerance);

      const shell = geometry.elements['.carousel-shell'];
      const poster = geometry.elements['.poster-viewport'];
      const leftArrow = geometry.elements['.poster-arrow-left'];
      const rightArrow = geometry.elements['.poster-arrow-right'];
      expect(shell.left).toBeGreaterThanOrEqual(-widthTolerance);
      expect(shell.right).toBeLessThanOrEqual(viewportWidth + widthTolerance);
      expect(geometry.carousel.shellContainsPoster).toBe(true);
      expect(geometry.carousel.shellContainsLeftArrow).toBe(true);
      expect(geometry.carousel.shellContainsRightArrow).toBe(true);
      expect(geometry.carousel.posterLeftInset).toBeGreaterThanOrEqual(0);
      expect(geometry.carousel.posterRightInset).toBeGreaterThanOrEqual(0);
      expect(geometry.carousel.leftArrowGap).toBeGreaterThanOrEqual(-widthTolerance);
      expect(geometry.carousel.rightArrowGap).toBeGreaterThanOrEqual(-widthTolerance);
      expect(geometry.carousel.leftArrowGap).toBeLessThanOrEqual(6);
      expect(geometry.carousel.rightArrowGap).toBeLessThanOrEqual(6);
      expect(geometry.carousel.trackWidth).toBeGreaterThanOrEqual(geometry.carousel.viewportWidth - widthTolerance);
      expect(geometry.carousel.trackWidth).toBeLessThanOrEqual(geometry.carousel.viewportWidth + widthTolerance);

      if (isMobile) {
        expect(geometry.ratios.poster).toBeGreaterThan(0.72);
        expect(geometry.ratios.poster).toBeLessThan(0.90);
        expect(geometry.ratios.shell).toBeLessThanOrEqual(1);
        expect(poster.height / poster.width).toBeGreaterThan(1.10);
        expect(poster.height / poster.width).toBeLessThan(1.25);
      } else {
        expect(poster.width).toBeLessThanOrEqual(560 + widthTolerance);
        expect(poster.height / poster.width).toBeGreaterThan(1.10);
        expect(poster.height / poster.width).toBeLessThan(1.25);
      }

      expect(geometry.logicalPosterIds.sort()).toEqual(['1', '2', '3', '4', '5']);
      await page.screenshot({ path: `test-results/${viewport.name}.png`, fullPage: true });
    });
  }
});
