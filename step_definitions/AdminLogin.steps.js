const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('the application URL is configured', function () {
  const baseUrl = process.env.BASE_URL;
  assert.ok(baseUrl, 'BASE_URL must be set to the application under test');

  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error('BASE_URL must be a valid HTTP(S) URL');
  }

  assert.ok(
    ['http:', 'https:'].includes(url.protocol),
    'BASE_URL must use the HTTP or HTTPS protocol'
  );
});

When('I open the admin login page', async function () {
  await this.adminLoginPage.openLogin(process.env.BASE_URL);
});

Then(/^the Email\/Username\* textbox should be visible$/, async function () {
  assert.equal(
    await this.adminLoginPage.emailUsernameInput.isVisible(),
    true,
    'Expected the Email/Username* textbox to be visible'
  );
});

Then('the Password* textbox should be visible', async function () {
  assert.equal(
    await this.adminLoginPage.passwordInput.isVisible(),
    true,
    'Expected the Password* textbox to be visible'
  );
});

Then('the Log In button should be visible', async function () {
  assert.equal(
    await this.adminLoginPage.logInButton.isVisible(),
    true,
    'Expected the Log In button to be visible'
  );
});

When('I submit the login form with blank credentials once', async function () {
  await this.adminLoginPage.submitBlankCredentialsOnce();
});

When('I submit the known QA email or username with an intentionally incorrect password once', async function () {
  const username = process.env.QA_ADMIN_USERNAME || process.env.QA_ADMIN_EMAIL;
  assert.ok(
    username,
    'Configure QA_ADMIN_USERNAME or QA_ADMIN_EMAIL for LOGIN-004'
  );

  const incorrectPassword = `Invalid-${randomBytes(16).toString('hex')}`;
  await this.adminLoginPage.submitCredentialsOnce(username, incorrectPassword);
  await this.adminLoginPage.waitForAuthenticationFailure(
    Number(process.env.LOGIN_AUTH_FEEDBACK_TIMEOUT_MS || 10000)
  );
});

When('I submit a reserved synthetic unregistered identifier and password once', async function () {
  const identifier = `onezae-unregistered-${randomBytes(12).toString('hex')}@example.invalid`;
  const password = `Invalid-${randomBytes(16).toString('hex')}`;
  await this.adminLoginPage.submitCredentialsOnce(identifier, password);
  await this.adminLoginPage.waitForAuthenticationFailure(
    Number(process.env.LOGIN_AUTH_FEEDBACK_TIMEOUT_MS || 10000)
  );
});

Then('the admin login page should remain visible', async function () {
  assert.equal(
    await this.adminLoginPage.isLoginPageVisible(),
    true,
    'Expected the admin login page to remain visible at /login'
  );
});

Then('visible authentication failure feedback should be shown', async function () {
  assert.equal(
    await this.adminLoginPage.isAuthenticationFailureFeedbackVisible(),
    true,
    'Expected a visible authentication failure message after invalid credentials'
  );
});

Then('authenticated dashboard navigation should not be visible', async function () {
  const landingPath = process.env.ADMIN_LANDING_PATH;
  assert.ok(
    typeof landingPath === 'string' && landingPath.startsWith('/'),
    'ADMIN_LANDING_PATH must be configured as an absolute dashboard path'
  );

  assert.equal(
    await this.adminLoginPage.isAuthenticatedNavigationVisible(
      new URL(landingPath, process.env.BASE_URL).toString()
    ),
    false,
    'Protected admin dashboard navigation must not be visible after failed authentication'
  );
});

Then('visible required-field validation feedback should be shown', async function () {
  const messages = await this.adminLoginPage.getVisibleValidationFeedback();
  assert.ok(
    messages.length > 0,
    'Expected visible required-field validation feedback after submitting blank credentials'
  );
});

Given('QA email credentials are configured', function () {
  assert.ok(process.env.QA_ADMIN_EMAIL, 'QA_ADMIN_EMAIL must be configured');
  assert.ok(process.env.QA_ADMIN_PASSWORD, 'QA_ADMIN_PASSWORD must be configured');
});

When('I authenticate with the QA email and password once', async function () {
  const timeout = Number(process.env.LOGIN_NAVIGATION_TIMEOUT_MS || 15000);
  const landingUrl = await this.adminLoginPage.authenticateAndWaitForLanding(
    process.env.QA_ADMIN_EMAIL,
    process.env.QA_ADMIN_PASSWORD,
    process.env.BASE_URL,
    process.env.ADMIN_LANDING_PATH,
    timeout
  );
  this.scenarioContext.set('adminLandingUrl', landingUrl);
});

Then('the configured admin dashboard should be visible', async function () {
  assert.equal(
    await this.adminLoginPage.isAtLandingPage(this.scenarioContext.get('adminLandingUrl')),
    true,
    'Expected navigation to the configured admin dashboard URL'
  );
});

Then('authenticated navigation should be visible', async function () {
  assert.equal(
    await this.adminLoginPage.isAuthenticatedNavigationVisible(
      this.scenarioContext.get('adminLandingUrl')
    ),
    true,
    'Expected authenticated navigation to be visible after login'
  );
});

Then('the login form should no longer be visible', async function () {
  assert.equal(
    await this.adminLoginPage.isLoginFormGone(),
    true,
    'Expected the login form to be gone after successful authentication'
  );
});
