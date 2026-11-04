import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const state = 'playwright/.auth/ambassador.json';
const slowMo = Number(process.env.SLOW_MO || 0);
if (!Number.isFinite(slowMo) || slowMo < 0) throw new Error('SLOW_MO must be a non-negative number');
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, retries: 0,
  timeout: 60000 + Math.ceil(slowMo * 60), expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }], ['./scripts/failure-review-reporter.cjs']],
  use: {
    baseURL: 'https://beta.helpafteraccident.com',
    browserName: 'chromium',
    storageState: existsSync(state) ? state : undefined,
    headless: process.env.HEADED !== '1',
    launchOptions: { slowMo: slowMo },
    actionTimeout: 15000, navigationTimeout: 30000,
    screenshot: 'only-on-failure', video: 'retain-on-failure', trace: 'retain-on-failure'
  }
});
