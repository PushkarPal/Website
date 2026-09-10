import { test, expect } from '@playwright/test';

test.describe('poster carousel behavior', () => {
  test('manual navigation performs a real horizontal slide', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const track = page.locator('.poster-track');
    const before = await track.evaluate((element) => ({
      transform: getComputedStyle(element).transform,
      transitionDuration: getComputedStyle(element).transitionDuration,
    }));

    expect(before.transitionDuration).toContain('0.45');
    await page.locator('.poster-arrow-right').click();
    await page.waitForTimeout(100);

    const during = await track.evaluate((element) => getComputedStyle(element).transform);
    expect(during).not.toBe(before.transform);

    await page.waitForTimeout(450);
    await expect(page.locator('.poster-box[data-poster-number="2"][aria-hidden="false"]')).toHaveCount(1);
  });

  test('autoplay advances after the three-second dwell', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('.poster-box[data-poster-number="1"][aria-hidden="false"]')).toHaveCount(1);
    await page.waitForTimeout(3200);
    await expect(page.locator('.poster-box[data-poster-number="2"][aria-hidden="false"]')).toHaveCount(1);
  });
});
