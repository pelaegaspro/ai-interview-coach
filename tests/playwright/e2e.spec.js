var _electron = require('@playwright/test');
var test = _electron.test;
var expect = _electron.expect;

test.describe('W AI Enterprise Test Suite', () => {

  test('Mock mode runs without API outbound calls', async ({ page }) => {
    // Navigate to local dev server
    await page.goto('http://localhost:5173');

    // Route guard to ensure API does not get triggered
    let apiCalled = false;
    await page.route('**/api/**', (route) => {
      apiCalled = true;
      return route.abort();
    });

    // Try starting mock mode
    await page.click('text=Try Demo Mode');

    // Verify UI state
    await expect(page.locator('text=Interactive Demo Mode')).toBeVisible();
    await page.waitForTimeout(1000);

    expect(apiCalled).toBe(false);
  });

  test('Session timer accurately starts upon interview begin', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Start Listening Action
    await page.click('text=Start Listening');
    // Session Timer UI component should mount
    await expect(page.locator('text=LEFT')).toBeVisible();
  });

  test('Paywall triggers correctly when timer expires or manual trigger invoked', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Manually force trigger the paywall event hook we built
    await page.evaluate(() => {
       window.dispatchEvent(new CustomEvent('triggerPaywall'));
    });

    await expect(page.locator('text=Upgrade to Pro')).toBeVisible();
    await expect(page.locator('text=Go Premium')).toBeVisible();
  });
});
