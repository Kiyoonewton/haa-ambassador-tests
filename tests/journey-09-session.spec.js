import {test,expect} from '@playwright/test';
import {dashboard,exact,account} from './support.js';
test.describe('Journey 09 — Session access',()=>{
 test('J09-01 Signed-in dashboard survives refresh',async({page})=>{
  await dashboard(page);await page.reload();await expect(page.getByRole('heading',exact(account.name))).toBeVisible();
 });
 test('J09-02 Fresh unauthenticated session cannot see own dashboard',async({browser})=>{
  const context=await browser.newContext();try{
   const page=await context.newPage();await page.goto('https://beta.helpafteraccident.com/en/ambassadors/dashboard');
   await expect(page.getByRole('button',exact('Edit profile'))).toBeHidden();
   await expect(page).not.toHaveURL(/\/ambassadors\/dashboard(?:[/?#]|$)/);
  }finally{await context.close();}
 });
 test.skip('J09-03 Logout and OTP login again',{annotation:{type:'blocked',description:'Blocked: needs OTP-capable login fixture; logout may invalidate the shared session.'}},async()=>{});
 test.skip('J09-04 Expired-session recovery',{annotation:{type:'blocked',description:'Blocked: needs team-provided short-lived session or supported expiry fixture.'}},async()=>{});
});
