import { test } from '@playwright/test';

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
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const selectors = [
  '#root',
  '.landing-page',
  '.landing-header',
  '.landing-logo',
  '.landing-nav',
  '.category-row-five',
  '.category-separator',
  '.category-row-four',
  '.poster-section',
  '.carousel-shell',
  '.poster-arrow-left',
  '.poster-viewport',
  '.poster-track',
  '.poster-box',
  '.poster-arrow-right',
];

function round(value) {
  return Math.round(value * 100) / 100;
}

test.describe('responsive geometry diagnostic', () => {
  for (const viewport of viewports) {
    test(`diagnose ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });

      const diagnostic = await page.evaluate((requestedSelectors) => {
        const rectFor = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
            width: box.width,
            height: box.height,
          };
        };

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const poster = rectFor('.poster-viewport');
        const shell = rectFor('.carousel-shell');
        const leftArrow = rectFor('.poster-arrow-left');
        const rightArrow = rectFor('.poster-arrow-right');

        return {
          viewport: {
            innerWidth: viewportWidth,
            innerHeight: viewportHeight,
            devicePixelRatio: window.devicePixelRatio,
            visualViewportWidth: window.visualViewport?.width ?? null,
            visualViewportHeight: window.visualViewport?.height ?? null,
          },
          document: {
            clientWidth: document.documentElement.clientWidth,
            clientHeight: document.documentElement.clientHeight,
            bodyClientWidth: document.body.clientWidth,
            bodyClientHeight: document.body.clientHeight,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
          },
          elements: Object.fromEntries(requestedSelectors.map((selector) => [selector, rectFor(selector)])),
          relationships: {
            posterWidthRatio: poster.width / viewportWidth,
            posterLeftInset: poster.left,
            posterRightInset: viewportWidth - poster.right,
            shellWidthRatio: shell.width / viewportWidth,
            leftArrowRightGap: poster.left - leftArrow.right,
            rightArrowLeftGap: rightArrow.left - poster.right,
            trackWidth: rectFor('.poster-track').width,
          },
        };
      }, selectors);

      const e = diagnostic.elements;
      console.log(`\n=== RESPONSIVE AUDIT: ${viewport.name} (${viewport.width}x${viewport.height}) ===`);
      console.log(JSON.stringify({
        viewport: diagnostic.viewport,
        document: diagnostic.document,
        carousel: {
          shell: e['.carousel-shell'],
          posterViewport: e['.poster-viewport'],
          posterTrack: e['.poster-track'],
          posterBox: e['.poster-box'],
          leftArrow: e['.poster-arrow-left'],
          rightArrow: e['.poster-arrow-right'],
          relationships: diagnostic.relationships,
        },
      }, null, 2));

      await page.screenshot({ path: `test-results/diagnostic-${viewport.name}.png`, fullPage: true });
    });
  }
});
