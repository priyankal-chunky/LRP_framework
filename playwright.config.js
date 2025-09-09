const { devices } = require('@playwright/test');
const os = require('node:os');
const path = require('node:path');
const { mkdirSync } = require('fs');
const dotenv = require('dotenv');
const { browserMode, browserName, expectTimeout, numberOfWorkers, parallelMode, testTimeout } = require('./config/testConfiguration');
const { default: globalTeardown } = require('./global-teardown');

// Load environment variables from .env files
dotenv.config();
dotenv.config({ path: '.env.aws' });

// Generate a unique directory name based on the current timestamp
const timestamp = new Date();
const shortDate = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
const shortTime = `${timestamp.getHours().toString().padStart(2, '0')}-${timestamp.getMinutes().toString().padStart(2, '0')}`;
const formattedTimestamp = `${shortDate}_${shortTime}`;

const allureResultsDir = path.join('reports', 'allure-results', `Test_Report-${formattedTimestamp}`);

// Create the results directory if it doesn't exist
mkdirSync(allureResultsDir, { recursive: true });

// Define the configuration object
const config = {
  globalTeardown:'./global-teardown.js',
  testDir: './tests/',
  retries: 0,
  forbidOnly: true,
  fullyParallel: parallelMode(),
  timeout: testTimeout() * 1000,
  expect: {
    timeout: expectTimeout(),
  },
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    [
      'allure-playwright',
      {
        detail: true,
        resultsDir: allureResultsDir,
        suiteTitle: false,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          NodeVersion: process.version,
        },
        categories: [
          {
            name: 'Missing file errors',
            messageRegex: /^ENOENT: no such file or directory/,
          },
        ],
      },
    ],
  ],
  use: {
    browserName: browserName(),
    actionTimeout: 5000,
    headless: browserMode(),
    viewport: null,
    screenshot: 'on',
    trace: 'off',
    launchOptions: {
      args: ['--start-maximized'],
    },
    navigationTimeout: 60000,
  },
  workers: numberOfWorkers(),
  projects: [
    {
      name: 'staging',
      use: {
        baseURL: process.env.WEB_APP_URL,
      },
    },
  ],
};

// Export the configuration object
module.exports = config;
