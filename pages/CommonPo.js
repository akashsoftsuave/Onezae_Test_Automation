const { waitForAppReady } = require('../utils/Waiter');

class CommonPo {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    const target = new URL(url);
    if (!['http:', 'https:'].includes(target.protocol)) {
      throw new Error(`Unsupported application URL protocol: ${target.protocol}`);
    }

    const response = await this.page.goto(target.toString(), { waitUntil: 'domcontentloaded' });
    if (response && response.status() >= 400) {
      throw new Error(`Application navigation failed with HTTP ${response.status()} for ${target.href}`);
    }

    await waitForAppReady(this.page);
  }
}

module.exports = CommonPo;
