const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const cucumberCli = path.join(
  projectRoot,
  'node_modules',
  '@cucumber',
  'cucumber',
  'bin',
  'cucumber.js'
);
const cucumberReport = path.join(projectRoot, 'reports', 'cucumber-report.json');
const reportGenerator = path.join(__dirname, 'report.js');

fs.mkdirSync(path.dirname(cucumberReport), { recursive: true });
fs.rmSync(cucumberReport, { force: true });

const testRun = spawnSync(process.execPath, [cucumberCli, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit'
});

if (testRun.error) {
  console.error(`Unable to start Cucumber: ${testRun.error.message}`);
}

const reportRun = spawnSync(process.execPath, [reportGenerator], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit'
});

if (reportRun.error) {
  console.error(`Unable to generate the HTML report: ${reportRun.error.message}`);
}

if (testRun.status !== 0) {
  process.exitCode = testRun.status || 1;
} else if (reportRun.status !== 0) {
  process.exitCode = reportRun.status || 1;
}
