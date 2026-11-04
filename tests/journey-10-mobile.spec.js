import {test,expect} from '@playwright/test';
import {dashboard,exact,account} from './support.js';
test.describe('Journey 10 — Mobile dashboard navigation',()=>{
 test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 test('J10-01 Main controls work on mobile and page has no horizontal overflow',async({page})=>{
  await dashboard(page);
  for(const name of ['Edit profile','Share HAA','People'])await expect(page.getByRole('button',exact(name))).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
  await page.getByRole('button',exact('People')).click();await expect(page.getByRole('textbox',exact('Search people'))).toBeVisible();
  await page.getByRole('button',exact('Go to dashboard')).click();await expect(page.getByRole('heading',exact(account.name))).toBeVisible();
 });
});
