import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const state = 'playwright/.auth/ambassador.json';
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, retries: 0,
  timeout: 30000, expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://beta.helpafteraccident.com',
    browserName: 'chromium',
    storageState: existsSync(state) ? state : undefined,
    headless: process.env.HEADED !== '1',
    launchOptions: { slowMo: Number(process.env.SLOW_MO || 0) },
    screenshot: 'only-on-failure', video: 'retain-on-failure', trace: 'retain-on-failure'
  }
});
