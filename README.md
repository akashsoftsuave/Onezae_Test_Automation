# Playwright + Cucumber Automation Framework

A reusable browser automation framework built using **Playwright, Cucumber.js, and JavaScript (CommonJS)**. It follows the Page Object Model (POM) and Behaviour-Driven Development (BDD) approach.

## 1. Technology Stack

- Node.js 22+
- JavaScript (CommonJS)
- Playwright
- Cucumber.js
- Gherkin
- JSON and HTML reporting

## 2. Prerequisites

- Node.js 22 or newer
- npm
- Application URL
- Valid QA credentials, if required

## 3. Setup

```powershell
npm.cmd install

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

npx.cmd playwright install chromium
```

Configure the application URL and required QA credentials in `.env`.

## 4. Project Structure

```text
features/
pages/
step_definitions/
support/
utils/
reports/
screenshots/
videos/
cucumber.js
package.json
.env.example
README.md
```

### Folder Overview

| Folder/File | Purpose |
|---|---|
| `features/` | Gherkin feature files |
| `step_definitions/` | Step implementations |
| `pages/` | Page Object Model classes |
| `support/` | Hooks and reporting |
| `utils/` | Reusable actions, waits, and test data |
| `reports/` | JSON and HTML reports |
| `screenshots/` | Failure screenshots |
| `videos/` | Failure recordings |
| `cucumber.js` | Cucumber configuration |
| `package.json` | Dependencies and test scripts |
| `.env.example` | Environment configuration template |

## 5. Framework Architecture

The framework follows this execution flow:

`Feature Files → Step Definitions → Page Objects → Utilities → Application`

Each scenario uses an isolated browser context and scenario-specific data.

## 6. Test Execution

| Command | Purpose |
|---|---|
| `npm.cmd run test:dry-run` | Validate Cucumber configuration |
| `npm.cmd run test:smoke` | Run smoke tests |
| `npm.cmd run test:login` | Run login tests |
| `npm.cmd run test:regression` | Run regression tests |
| `npm.cmd run test:supplemental` | Run supplemental usability tests |
| `npm.cmd test -- --tags "@LOGIN-001"` | Run a specific tagged scenario |
| `npm.cmd test` | Run the default test suite |
| `npm.cmd run report` | Generate the HTML report |

## 7. Automation Coverage

### Admin Panel

| Module | Coverage |
|---|---|
| Login | Login controls, blank-field validation, successful and unsuccessful login, session continuity |

### Future Module Coverage

Add each module here when its automation is implemented.

| Module | Coverage | Status |
|---|---|---|
| Dashboard | To be updated | Not Started |
| User Management | To be updated | Not Started |
| Outlet Management | To be updated | Not Started |
| Order Management | To be updated | Not Started |
| Marketing | To be updated | Not Started |
| Operations | To be updated | Not Started |
| Content Settings | To be updated | Not Started |

*The modules above are placeholders for planned coverage, not a claim that automation has been implemented.*

## 8. Reports and Evidence

Runtime test execution generates:

- Cucumber JSON report: `reports/cucumber-report.json`
- HTML report: `reports/html-report/index.html`
- Failure screenshots: `screenshots/`
- Failure videos: `videos/`

Credential-bearing scenarios are excluded from screenshot and video persistence.

## 9. Configuration

Configure the following variables in `.env` as required:

- `BASE_URL`
- `BROWSER`
- `HEADLESS`
- `SLOW_MO`
- `QA_ADMIN_EMAIL`
- `QA_ADMIN_PASSWORD`
- `ADMIN_LANDING_PATH`

See `.env.example` for the available configuration options.

## 10. Best Practices

- Follow the Page Object Model.
- Keep credentials outside source control.
- Use reusable utilities and isolated test scenarios.
- Organize tests using meaningful Cucumber tags.
- Update the automation coverage table whenever a new module is implemented.
- Maintain test reports and regression coverage as the application evolves.

## 11. Future Enhancements

- Expand automation across application modules.
- Add API automation where required.
- Integrate the framework with CI/CD pipelines.
- Extend regression coverage as new features are implemented.

