require('dotenv').config();

const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout,
  setWorldConstructor
} = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const ScenarioContext = require('../utils/scenarioContext');
const AdminLoginPage = require('../pages/AdminLoginPage');

setDefaultTimeout(60000);

const browsers = { chromium, firefox, webkit };
let browser;
let artifacts;

class AutomationWorld {
  constructor(options) {
    this.attach = options.attach;
    this.log = options.log;
    this.parameters = options.parameters;
  }
}

setWorldConstructor(AutomationWorld);

function readBoolean(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`${name} must be "true" or "false"`);
}

function readSlowMo() {
  const value = Number(process.env.SLOW_MO || 0);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('SLOW_MO must be a non-negative number');
  }
  return value;
}

function artifactPath(environmentName, fallback) {
  return path.resolve(process.env[environmentName] || fallback);
}

async function prepareDirectory(directory) {
  await fs.mkdir(directory, { recursive: true });
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.gitkeep') continue;
    await fs.rm(path.join(directory, entry.name), { recursive: true, force: true });
  }
}

function safeName(value) {
  return value.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'scenario';
}

BeforeAll(async function () {
  const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
  const browserType = browsers[browserName];
  if (!browserType) {
    throw new Error(`Unsupported BROWSER "${browserName}". Choose chromium, firefox, or webkit.`);
  }

  artifacts = {
    screenshots: artifactPath('SCREENSHOT_PATH', 'screenshots'),
    videos: artifactPath('VIDEO_PATH', 'videos')
  };
  await Promise.all([
    prepareDirectory(artifacts.screenshots),
    prepareDirectory(artifacts.videos),
    fs.mkdir(path.resolve('reports'), { recursive: true })
  ]);

  browser = await browserType.launch({
    headless: readBoolean('HEADLESS', true),
    slowMo: readSlowMo()
  });
});

Before(async function ({ pickle }) {
  this.scenarioContext = new ScenarioContext();
  const storesCredentialArtifacts = pickle.tags.some((tag) =>
    ['@LOGIN-003', '@LOGIN-004'].includes(tag.name)
  );
  this.context = await browser.newContext({
    ...(!storesCredentialArtifacts && {
      recordVideo: { dir: artifacts.videos, size: { width: 1920, height: 1080 } }
    })
  });
  this.page = await this.context.newPage();
  this.adminLoginPage = new AdminLoginPage(this.page);
});

After(async function ({ pickle, result }) {
  const video = this.page ? this.page.video() : undefined;
  const screenshotFile = path.join(
    artifacts.screenshots,
    `${safeName(pickle.name)}-${randomUUID()}.png`
  );

  try {
    const storesCredentialArtifacts = pickle.tags.some((tag) =>
      ['@LOGIN-003', '@LOGIN-004'].includes(tag.name)
    );
    if (!storesCredentialArtifacts && this.page && !this.page.isClosed()) {
      const screenshot = await this.page.screenshot({ path: screenshotFile, fullPage: true });
      await this.attach(screenshot, 'image/png');
    }
  } finally {
    if (this.context) await this.context.close();
  }

  if (video) {
    const videoFile = path.join(artifacts.videos, `${safeName(pickle.name)}-${randomUUID()}.webm`);
    await video.saveAs(videoFile);
    if (result?.status === Status.FAILED) {
      await this.attach(`<a href="${pathToFileURL(videoFile).href}">Scenario video</a>`, 'text/html');
    }
  }
});

AfterAll(async function () {
  if (browser) await browser.close();
});
