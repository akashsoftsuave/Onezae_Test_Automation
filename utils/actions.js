const { waitForVisible } = require('./Waiter');

async function clickWhenReady(locator, options) {
  await waitForVisible(locator);
  await locator.click(options);
}

async function fillWhenReady(locator, value, options) {
  await waitForVisible(locator);
  await locator.fill(value, options);
}

module.exports = {
  clickWhenReady,
  fillWhenReady
};
