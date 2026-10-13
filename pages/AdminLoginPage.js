const CommonPo = require('./CommonPo');
const { waitForAppReady } = require('../utils/Waiter');

class AdminLoginPage extends CommonPo {
  constructor(page) {
    super(page);
    this.emailUsernameInput = page.getByLabel('Email/Username*', { exact: true });
    this.passwordInput = page.getByLabel('Password*', { exact: true });
    this.logInButton = page.getByRole('button', { name: 'Log In', exact: true });
    this.developerTunnelWarning = page.getByText(
      'You are about to connect to a developer tunnel at:',
      { exact: true }
    );
    this.developerTunnelContinueButton = page.getByRole('button', {
      name: 'Continue',
      exact: true
    });
    this.visibleLinks = page.locator('a:visible');
    this.validationFeedback = page.locator(
      '[role="alert"]:visible, [aria-live="assertive"]:visible, [aria-live="polite"]:visible'
    );
    this.authenticationFailureFeedback = page.getByText(
      /invalid|incorrect|failed|failure|try again|unable to (?:log in|sign in)|access denied|authentication error/i
    ).filter({ visible: true });
    this.emailValidationFeedback = page.getByText('Enter your email', { exact: true });
    this.passwordValidationFeedback = page.getByText('Enter your password', { exact: true });
  }

  async openLogin(baseUrl) {
    const loginUrl = new URL('/login', baseUrl);
    await this.navigateTo(loginUrl.toString());

    if (loginUrl.hostname.endsWith('.devtunnels.ms')) {
      if (await this.developerTunnelWarning.isVisible()) {
        if (!(await this.developerTunnelContinueButton.isVisible())) {
          throw new Error('The Dev Tunnels warning is visible, but its Continue button is missing');
        }

        await this.developerTunnelContinueButton.click();
        await waitForAppReady(this.page);
      }
    }
  }

  async submitBlankCredentialsOnce() {
    await this.submitCredentialsOnce('', '');
  }

  async submitCredentialsOnce(username, password) {
    await this.emailUsernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.logInButton.click();
  }

  async authenticateAndWaitForLanding(email, password, baseUrl, landingPath, timeout) {
    const base = new URL(baseUrl);
    if (typeof landingPath !== 'string' || !landingPath.startsWith('/')) {
      throw new Error('ADMIN_LANDING_PATH must be an absolute path such as /dashboard');
    }
    if (!Number.isSafeInteger(timeout) || timeout <= 0) {
      throw new Error('LOGIN_NAVIGATION_TIMEOUT_MS must be a positive integer');
    }

    const landingUrl = new URL(landingPath, base);
    if (landingUrl.origin !== base.origin || landingUrl.pathname === '/login') {
      throw new Error('ADMIN_LANDING_PATH must resolve to a non-login path on the application origin');
    }

    await this.submitCredentialsOnce(email, password);
    await this.page.waitForURL(
      (url) => url.origin === landingUrl.origin && url.pathname === landingUrl.pathname,
      { timeout }
    );
    await waitForAppReady(this.page);
    await Promise.all([
      this.emailUsernameInput.waitFor({ state: 'hidden', timeout }),
      this.passwordInput.waitFor({ state: 'hidden', timeout })
    ]);

    return landingUrl.toString();
  }

  async reloadProtectedLandingPage(timeout) {
    if (!Number.isSafeInteger(timeout) || timeout <= 0) {
      throw new Error('LOGIN_NAVIGATION_TIMEOUT_MS must be a positive integer');
    }

    await this.page.reload({ waitUntil: 'domcontentloaded', timeout });
    await waitForAppReady(this.page, timeout);
  }

  async isLoginPageVisible() {
    const currentUrl = new URL(this.page.url());
    return currentUrl.pathname === '/login' && await this.logInButton.isVisible();
  }

  async isAtLandingPage(landingUrl) {
    const expectedUrl = new URL(landingUrl);
    const currentUrl = new URL(this.page.url());
    return currentUrl.origin === expectedUrl.origin && currentUrl.pathname === expectedUrl.pathname;
  }

  async isAuthenticatedNavigationVisible(landingUrl) {
    const dashboardPath = new URL(landingUrl).pathname;
    return this.visibleLinks.evaluateAll((links, expectedPath) =>
      links.some((link) => {
        const destination = new URL(link.href, location.href);
        return destination.origin === location.origin && destination.pathname === expectedPath;
      }), dashboardPath);
  }

  async waitForAuthenticationFailure(timeout) {
    await this.authenticationFailureFeedback.first().waitFor({ state: 'visible', timeout });
  }

  async isAuthenticationFailureFeedbackVisible() {
    return this.authenticationFailureFeedback.first().isVisible();
  }

  async isLoginFormGone() {
    const [emailVisible, passwordVisible] = await Promise.all([
      this.emailUsernameInput.isVisible(),
      this.passwordInput.isVisible()
    ]);
    return !emailVisible && !passwordVisible;
  }

  async getVisibleValidationFeedback() {
    const messages = await this.validationFeedback.allTextContents();
    for (const locator of [this.emailValidationFeedback, this.passwordValidationFeedback]) {
      if (await locator.isVisible()) {
        messages.push(await locator.innerText());
      }
    }
    return [...new Set(messages.map((message) => message.trim()).filter(Boolean))];
  }
}

module.exports = AdminLoginPage;
