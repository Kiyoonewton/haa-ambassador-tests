import {trackProfileReadiness} from './helpers/profile-readiness.js';
import {expect} from '@playwright/test';
import {existsSync} from 'node:fs';
export const exact=name=>({name,exact:true});
const user=process.env.HAA_USERNAME||'kiyoonewton';
const escaped=user.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const account={name:process.env.HAA_NAME||'Isaac',user,link:`go.beta.helpafteraccident.com/${user}`,urlPattern:new RegExp('^https?://go\\.beta\\.helpafteraccident\\.com/'+escaped+'/?$','i')};
export async function dashboard(page){
 if(!existsSync('playwright/.auth/ambassador.json'))throw new Error('BLOCKED: Run npm run login on this computer first.');
 await page.goto('/en/ambassadors/dashboard');await expect(page.getByRole('heading',exact(account.name))).toBeVisible();
}
export async function openProfile(page){
 const readiness=trackProfileReadiness(page);
 try{
  await dashboard(page);
  await page.getByRole('button',exact('Edit profile')).click();
  await expect(page.getByRole('heading',exact('Profile'))).toBeVisible();
  const city=page.getByRole('textbox',exact('My city'));
  const organization=page.getByRole('textbox',exact('Organization / Affiliation'));
  await expect(city).toBeEditable();await expect(organization).toBeEditable();
  await expect.poll(async()=>{
   // Include both values in one DOM snapshot; reading separate fields can
   // straddle an asynchronous form reset.
   const form=await page.getByRole('main').locator('input').evaluateAll(inputs=>
    inputs.map(input=>({id:input.id,value:input.value,disabled:input.disabled})));
   return readiness.isReady(form);
  },{
   message:'Profile data is still loading or resetting; do not capture originals or edit yet',
   timeout:20000,intervals:[100,150,250]
  }).toBe(true);
 }finally{readiness.dispose();}
}
export async function sharing(page,label){await dashboard(page);await page.getByRole('button',exact('Share HAA')).click();await page.getByRole('button',exact(label)).click();}
