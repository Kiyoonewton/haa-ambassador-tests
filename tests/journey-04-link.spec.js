import {test,expect} from '@playwright/test';
import {sharing,exact,account} from './support.js';
test.describe('Journey 04 — Share a personal referral link',()=>{
 test.beforeEach(async({page})=>sharing(page,'HAA link'));
 test('J04-01 Copy link contains the personal URL',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.evaluate(()=>navigator.clipboard.writeText('HAA QA sentinel'));
  await page.getByRole('button',exact('Copy link')).click();
  await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toMatch(account.urlPattern);
 });
 test('J04-02 Close button dismisses dialog',async({page})=>{
  await page.getByRole('button',exact('Close')).click();await expect(page.getByRole('dialog')).toBeHidden();
 });
 test('J04-03 Escape dismisses dialog',async({page})=>{
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeHidden();
 });
 test('J04-04 Personal link reaches patient flow in separate session',async({page,browser})=>{
  const link=await page.getByRole('dialog').getByText(account.link,{exact:true}).innerText();
  const context=await browser.newContext();try{
   const patient=await context.newPage();const response=await patient.goto('https://'+link);
   expect(response?.ok()).toBeTruthy();await expect(patient).toHaveURL(/\/en\?via=/);
   expect(new URL(patient.url()).searchParams.get('via')?.toLowerCase()).toBe(account.user.toLowerCase());
   await patient.getByRole('link',exact('GET HELP NOW')).first().click();
   await expect(patient).toHaveURL(/\/en\/get-help(?:[/?#]|$)/);
   await expect(patient.getByRole('main')).toBeVisible();
  }finally{await context.close();}
 });
 test.skip('J04-05 Click count updates',{annotation:{type:'blocked',description:'Blocked: team must define counting, deduplication and update window first.'}},async()=>{});
});
