import { test, expect, devices } from '@playwright/test';

const touchDesktopSiteCases = [
  { name: 'android-desktop-site', device: devices['Pixel 7'] },
  { name: 'iphone-desktop-site', device: devices['iPhone 13'] },
];

touchDesktopSiteCases.forEach(({ name, device }) => {
  test(name, async ({ browser }) => {
    const context = await browser.newContext({
      ...device,
      viewport: { width: 980, height: 900 },
    });
    const page = await context.newPage();

    await page.goto('/', { waitUntil: 'networkidle' });

    const geometry = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width, height: box.height };
      };

      const poster = rect('.poster-viewport');
      const leftArrow = rect('.poster-arrow-left');
      const rightArrow = rect('.poster-arrow-right');
      const shell = rect('.carousel-shell');

      return {
        viewport: {
          innerWidth: window.innerWidth,
          visualWidth: window.visualViewport?.width ?? null,
          dpr: window.devicePixelRatio,
          coarse: window.matchMedia('(pointer: coarse)').matches,
          noHover: window.matchMedia('(hover: none)').matches,
        },
        document: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
        },
        poster,
        shell,
        leftArrow,
        rightArrow,
        track: rect('.poster-track'),
        posterBox: rect('.poster-box'),
      };
    });

    console.log(`\n=== TOUCH DESKTOP-SITE AUDIT: ${name} ===\n${JSON.stringify(geometry, null, 2)}\n`);

    expect(geometry.viewport.coarse).toBe(true);
    expect(geometry.viewport.noHover).toBe(true);
    expect(geometry.document.clientWidth).toBe(geometry.viewport.innerWidth);
    expect(geometry.document.scrollWidth).toBeLessThanOrEqual(geometry.viewport.innerWidth + 1);
    expect(geometry.document.bodyScrollWidth).toBeLessThanOrEqual(geometry.viewport.innerWidth + 1);

    for (const element of [geometry.poster, geometry.leftArrow, geometry.rightArrow]) {
      expect(element.left).toBeGreaterThanOrEqual(-1);
      expect(element.right).toBeLessThanOrEqual(geometry.viewport.innerWidth + 1);
    }

    expect(geometry.poster.width / geometry.viewport.innerWidth).toBeGreaterThan(0.80);
    expect(geometry.poster.width / geometry.viewport.innerWidth).toBeLessThan(0.92);
    expect(Math.abs(geometry.poster.left - (geometry.viewport.innerWidth - geometry.poster.width) / 2)).toBeLessThan(2);
    expect(geometry.leftArrow.right).toBeLessThanOrEqual(geometry.poster.left + 5);
    expect(geometry.rightArrow.left).toBeGreaterThanOrEqual(geometry.poster.right - 5);
    expect(geometry.poster.height / geometry.poster.width).toBeGreaterThan(1.10);
    expect(geometry.poster.height / geometry.poster.width).toBeLessThan(1.25);

    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
    await context.close();
  });
});
