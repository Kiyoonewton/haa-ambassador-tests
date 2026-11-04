import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://beta.helpafteraccident.com/en/ambassadors/dashboard');
  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  await terminal.question('Sign in yourself. Once the ambassador dashboard is visible, press Enter here. ');
  terminal.close();
  if (!new URL(page.url()).pathname.endsWith('/ambassadors/dashboard')) throw new Error('Ambassador dashboard is not open. Run login again.');
  await page.getByRole('button', {name:'People', exact:true}).waitFor();
  await mkdir('playwright/.auth', {recursive:true});
  await context.storageState({path:'playwright/.auth/ambassador.json', indexedDB:true});
  console.log('Session saved locally. Run npm run demo.');
} finally { await browser.close(); }
