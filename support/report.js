require('dotenv').config();

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const reporter = require('multiple-cucumber-html-reporter');

const jsonFile = path.resolve('reports/cucumber-report.json');
if (!fs.existsSync(jsonFile)) {
  throw new Error(`Cucumber JSON report not found at ${jsonFile}. Run the test suite first.`);
}

const browserNames = {
  chromium: 'chrome',
  chrome: 'chrome',
  firefox: 'firefox',
  webkit: 'safari'
};
const platformNames = {
  darwin: 'osx',
  linux: 'linux',
  win32: 'windows'
};

reporter.generate({
  jsonDir: path.dirname(jsonFile),
  reportPath: path.resolve('reports/html-report'),
  reportName: 'Automation Test Report',
  pageTitle: 'Automation Test Report',
  displayDuration: true,
  metadata: {
    browser: {
      name: browserNames[(process.env.BROWSER || 'chromium').toLowerCase()] || 'unknown',
      version: 'not recorded'
    },
    device: 'Local test machine',
    platform: {
      name: platformNames[process.platform] || 'unknown',
      version: os.release()
    }
  }
});
