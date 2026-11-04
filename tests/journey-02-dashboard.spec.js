import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
const exact = name => ({name, exact:true});
const expectedName = process.env.HAA_NAME || 'Isaac';
const expectedUser = process.env.HAA_USERNAME || 'kiyoonewton';
const expectedLink = `go.beta.helpafteraccident.com/${expectedUser}`;
test.describe('Journey 02 — Ambassador dashboard', () => {
test.beforeEach(async ({page}) => {
  if (!existsSync('playwright/.auth/ambassador.json')) throw new Error('Missing login session. Run npm run login first.');
  await page.goto('/en/ambassadors/dashboard');
  await expect(page.getByRole('heading',exact(expectedName)), 'Expected ambassador dashboard; rerun npm run login if expired').toBeVisible();
});
test('J02-01 Dashboard shows the ambassador name', async ({page}) => {
  await expect(page.getByRole('heading',exact(expectedName))).toBeVisible();
});
test('J02-02 Story feature is marked Coming soon', async ({page}) => {
  await expect(page.getByText('COMING SOON',{exact:true})).toBeVisible();
  await expect(page.getByText('POST YOUR HAA STORY →',{exact:true})).toBeVisible();
});
test('J02-03 Edit profile opens the correct profile and link', async ({page}) => {
  await test.step('Open profile',async()=>{await page.getByRole('button',exact('Edit profile')).click();});
  await expect(page.getByRole('heading',exact('Profile'))).toBeVisible();
  await expect(page.getByText(new RegExp('^@' + expectedUser.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i'))).toBeVisible();
  await expect(page.getByText(expectedLink,{exact:true})).toBeVisible();
});
test('J02-04 Profile returns to dashboard without editing', async ({page}) => {
  await page.getByRole('button',exact('Edit profile')).click();
  await expect(page.getByRole('heading',exact('Profile'))).toBeVisible();
  await page.getByRole('button',exact('Cancel')).click();
  await expect(page.getByRole('heading',exact(expectedName))).toBeVisible();
});
test('J02-05 Share HAA offers QR, link and personal message', async ({page}) => {
  await page.getByRole('button',exact('Share HAA')).click();
  await expect(page.getByRole('heading',exact('Share it'))).toBeVisible();
  for (const name of ['QR code','HAA link','Personal Message']) await expect(page.getByRole('button',exact(name))).toBeVisible();
});
test('J02-06 Sharing displays the correct personal link', async ({page}) => {
  await page.getByRole('button',exact('Share HAA')).click();
  await page.getByRole('button',exact('HAA link')).click();
  const dialog=page.getByRole('dialog',exact('Your HAA link'));
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(expectedLink,{exact:true})).toBeVisible();
});
test('J02-07 People opens the referral list', async ({page}) => {
  await page.getByRole('button',exact('People')).click();
  await expect(page.getByText('People Helped',{exact:true})).toBeVisible();
  await expect(page.getByRole('textbox',exact('Search people'))).toBeVisible();
});
test('J02-08 People returns to the dashboard', async ({page}) => {
  await page.getByRole('button',exact('People')).click();
  await expect(page.getByRole('textbox',exact('Search people'))).toBeVisible();
  await page.getByRole('button',exact('Go to dashboard')).click();
  await expect(page.getByRole('heading',exact(expectedName))).toBeVisible();
});

});
