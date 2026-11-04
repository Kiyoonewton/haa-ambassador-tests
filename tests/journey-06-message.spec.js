import {test,expect} from '@playwright/test';
import {sharing,exact,account} from './support.js';
test.describe('Journey 06 — Share a personal introduction',()=>{
 test.beforeEach(async({page})=>sharing(page,'Personal Message'));
 test('J06-01 Message contains own name and personal link',async({page})=>{
  const message=page.getByRole('dialog').getByRole('textbox');
  const value=await message.inputValue();expect(value).toContain(account.name);
  expect(value.toLowerCase()).toContain(account.link.toLowerCase());
 });
 test('J06-02 Message can be edited before sharing',async({page})=>{
  const message=page.getByRole('dialog').getByRole('textbox');
  const value=`HAA QA introduction — ${account.link}`;await message.fill(value);await expect(message).toHaveValue(value);
 });
 test('J06-03 Close dismisses without sending',async({page})=>{
  await page.getByRole('button',exact('Close')).click();await expect(page.getByRole('dialog')).toBeHidden();
 });
 test('J06-04 Return to dashboard without sending',async({page})=>{
  await page.keyboard.press('Escape');await page.getByRole('button',exact('Go to dashboard')).click();
  await expect(page.getByRole('heading',exact(account.name))).toBeVisible();
 });
 test.skip('J06-05 Teammate receives shared message and working link',{annotation:{type:'blocked',description:'Manual confirmation required; no recipient designated. No messages are sent by this suite.'}},async()=>{});
});
