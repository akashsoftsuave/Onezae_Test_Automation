# Playwright + Cucumber Automation Framework

A reusable JavaScript/CommonJS browser automation starter based on the framework architecture described in the supplied skill. It keeps Gherkin, step orchestration, page objects, reusable utilities, lifecycle hooks, and reporting in separate layers.

## Requirements

- Node.js 22 or newer
- npm
- A target application URL for runtime execution

## Setup

```powershell
npm.cmd install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npx.cmd playwright install chromium
```

Set `BASE_URL` in `.env` to the application under test. Do not put credentials or tokens in source control. `.env` is ignored by Git.

## Run

```powershell
npm.cmd run test:dry-run
npm.cmd run test:smoke
npm.cmd test -- --tags "@LOGIN-001"
npm.cmd test -- --tags "@LOGIN-002"
npm.cmd test -- --tags "@LOGIN-003"
npm.cmd test -- --tags "@LOGIN-004"
npm.cmd test
```

`test:dry-run` checks Cucumber wiring without launching the browser. Every runtime test command generates `reports/cucumber-report.json` and `reports/html-report/index.html` after the run, including when scenarios fail; the command still returns a nonzero exit code when tests fail. `npm.cmd run report` can regenerate the HTML report from the latest JSON output. Runtime tests require `BASE_URL`, installed browser binaries, and a reachable application. In PowerShell with a restricted execution policy, use the `.cmd` launchers as shown above.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | unset | HTTP(S) application URL |
| `BROWSER` | `chromium` | `chromium`, `firefox`, or `webkit` |
| `HEADLESS` | `true` | Run the browser headlessly |
| `SLOW_MO` | `0` | Browser action delay in milliseconds |
| `SCREENSHOT_PATH` | `screenshots` | Per-scenario screenshot output |
| `VIDEO_PATH` | `videos` | Per-scenario video output |
| `TEST_ENVIRONMENT` | unset | Must be `non-production` for successful credential-submission scenarios |
| `QA_ADMIN_EMAIL` | unset | Enabled non-production QA account email used for login |
| `QA_ADMIN_PASSWORD` | unset | QA account password; keep outside source control |
| `QA_ADMIN_USERNAME` | unset | Known QA account username used for negative login coverage |
| `ADMIN_LANDING_PATH` | unset | Expected post-login dashboard path, e.g. `/dashboard` |
| `LOGIN_NAVIGATION_TIMEOUT_MS` | `15000` | Maximum post-login navigation wait |
| `LOGIN_AUTH_FEEDBACK_TIMEOUT_MS` | `10000` | Maximum wait for visible authentication rejection feedback |

Invalid browser names, boolean values, delays, and URL protocols fail explicitly.
Put QA values only in an ignored local `.env` file or inject them through the CI secret store. Do not place secrets in source files or command-line arguments. `LOGIN-003` requires a valid enabled QA account and dashboard path. `LOGIN-004` submits one generated incorrect password for `QA_ADMIN_USERNAME`; schedule it only when the account's documented failed-login policy allows that attempt.

## Architecture

```text
features/
  -> step_definitions/
    -> pages/
      -> utils/ (waits, actions, scenario data)
        -> application under test
support/ (browser/scenario lifecycle and report generation)
```

- Each scenario gets a fresh browser context, page, and `ScenarioContext`.
- Page objects own locators and browser interactions.
- `AdminLogin.feature` contains `LOGIN-001` for visible login controls and `LOGIN-002` for blank-credential validation at `/login`. `LOGIN-002` is supplemental usability coverage, not `A-1.1` acceptance-criterion coverage.
- `LOGIN-002` asserts visible required-field feedback after one blank submission, including the app's inline email/password messages.
- `LOGIN-003` covers `A-1.1`: it requires a non-production target and enabled QA email/password supplied through environment variables. It enters the email in the `Email/Username*` field, waits for the configured dashboard path, and checks authenticated navigation and that the login form is gone. This credential-bearing scenario does not save screenshots or video.
- `LOGIN-004` submits the known QA username with a cryptographically generated incorrect password once, then verifies the login page and visible authentication failure feedback remain while the protected dashboard link is absent. It does not require a `TEST_ENVIRONMENT` variable or rate-limit counters. Schedule execution according to the documented account rate-limit policy. This credential-bearing scenario does not save screenshots or video.
- Shared waits and action helpers live in `utils/`.
- Hooks capture and attach screenshots and record videos; generated artifacts are ignored by Git.
- Cucumber emits JSON under `reports/`; `npm run report` creates the HTML report.
- Features use case-sensitive tags: `LOGIN-001` is tagged `@Regression @LOGIN-001 @Login`; supplemental `LOGIN-002` is tagged `@SupplementalUsability @LOGIN-002`; `LOGIN-003` is tagged `@Regression @LOGIN-003 @Login`; negative `LOGIN-004` is tagged `@Regression @LOGIN-004 @Login`.

## Reference-to-starter mapping

| Audited reference component | Starter component | Action |
| --- | --- | --- |
| Cucumber configuration and Feature → Step → Page layering | `cucumber.js`, `features/`, `step_definitions/`, `pages/` | Adapt |
| Scenario lifecycle and browser isolation | `support/hooks.js` | Adapt |
| Shared page and action patterns | `pages/CommonPo.js`, `utils/actions.js` | Adapt |
| Waiter utilities | `utils/Waiter.js` | Adapt |
| Scenario-scoped state and generated data | `utils/scenarioContext.js`, `utils/DataGenerator.js` | Adapt |
| JSON-to-HTML reporting and evidence handling | `support/report.js`, hooks, `reports/`, `screenshots/`, `videos/` | Adapt |
| Domain pages, selectors, workflows, API helpers, and seed data | Not included | Replace/Create when application scope is known |
| CI pipeline | Not included | Create if required by the target repository |

## Project structure

```text
features/
  AdminLogin.feature
pages/
  AdminLoginPage.js
  CommonPo.js
reports/
  .gitkeep
screenshots/
  .gitkeep
step_definitions/
  AdminLogin.steps.js
support/
  hooks.js
  report.js
utils/
  actions.js
  DataGenerator.js
  scenarioContext.js
  Waiter.js
videos/
  .gitkeep
cucumber.js
package.json
```
