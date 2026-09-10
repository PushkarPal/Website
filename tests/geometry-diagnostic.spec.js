import { test } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-412', width: 412, height: 915 },
  { name: 'mobile-430', width: 430, height: 932 },
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
            selector,
            rect: {
              x: box.x,
              y: box.y,
              left: box.left,
              right: box.right,
              top: box.top,
              bottom: box.bottom,
              width: box.width,
              height: box.height,
            },
            display: getComputedStyle(element).display,
            position: getComputedStyle(element).position,
            width: getComputedStyle(element).width,
            maxWidth: getComputedStyle(element).maxWidth,
            minWidth: getComputedStyle(element).minWidth,
            boxSizing: getComputedStyle(element).boxSizing,
            paddingLeft: getComputedStyle(element).paddingLeft,
            paddingRight: getComputedStyle(element).paddingRight,
            marginLeft: getComputedStyle(element).marginLeft,
            marginRight: getComputedStyle(element).marginRight,
          };
        };

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const visualWidth = window.visualViewport?.width ?? null;
        const visualHeight = window.visualViewport?.height ?? null;
        const docWidth = document.documentElement.clientWidth;
        const docHeight = document.documentElement.clientHeight;
        const bodyWidth = document.body.clientWidth;
        const bodyHeight = document.body.clientHeight;
        const rootRect = document.querySelector('#root')?.getBoundingClientRect();
        const landingRect = document.querySelector('.landing-page')?.getBoundingClientRect();
        const navRect = document.querySelector('.landing-nav')?.getBoundingClientRect();
        const shellRect = document.querySelector('.carousel-shell')?.getBoundingClientRect();
        const posterRect = document.querySelector('.poster-viewport')?.getBoundingClientRect();
        const leftArrow = document.querySelector('.poster-arrow-left')?.getBoundingClientRect();
        const rightArrow = document.querySelector('.poster-arrow-right')?.getBoundingClientRect();

        return {
          viewport: {
            innerWidth: viewportWidth,
            innerHeight: viewportHeight,
            devicePixelRatio: window.devicePixelRatio,
            visualViewport: { width: visualWidth, height: visualHeight },
          },
          document: {
            clientWidth: docWidth,
            clientHeight: docHeight,
            bodyClientWidth: bodyWidth,
            bodyClientHeight: bodyHeight,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
          },
          relationships: {
            rootWidthRatio: rootRect ? rootRect.width / viewportWidth : null,
            landingWidthRatio: landingRect ? landingRect.width / viewportWidth : null,
            navWidthRatio: navRect ? navRect.width / viewportWidth : null,
            shellWidthRatio: shellRect ? shellRect.width / viewportWidth : null,
            posterWidthRatio: posterRect ? posterRect.width / viewportWidth : null,
            posterLeftInset: posterRect?.left ?? null,
            posterRightInset: posterRect ? viewportWidth - posterRect.right : null,
            arrowLeftRightGap: posterRect && leftArrow ? posterRect.left - leftArrow.right : null,
            arrowRightLeftGap: posterRect && rightArrow ? rightArrow.left - posterRect.right : null,
          },
          elements: Object.fromEntries(requestedSelectors.map((selector) => [selector, rectFor(selector)])),
        };
      }, selectors);

      console.log(`\n=== RESPONSIVE DIAGNOSTIC: ${viewport.name} (${viewport.width}x${viewport.height}) ===`);
      console.log(JSON.stringify(diagnostic, null, 2));

      await page.screenshot({ path: `test-results/diagnostic-${viewport.name}.png`, fullPage: true });
    });
  }
});
