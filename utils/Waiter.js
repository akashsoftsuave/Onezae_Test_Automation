async function waitForAppReady(page, timeout = 30000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.locator('body').waitFor({ state: 'visible', timeout });
}

async function waitForVisible(locator, timeout = 10000) {
  await locator.waitFor({ state: 'visible', timeout });
}

async function waitForHidden(locator, timeout = 10000) {
  await locator.waitFor({ state: 'hidden', timeout });
}

module.exports = {
  waitForAppReady,
  waitForVisible,
  waitForHidden
};
