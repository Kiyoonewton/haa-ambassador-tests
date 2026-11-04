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
export async function openProfile(page){await dashboard(page);await page.getByRole('button',exact('Edit profile')).click();await expect(page.getByRole('heading',exact('Profile'))).toBeVisible();}
export async function sharing(page,label){await dashboard(page);await page.getByRole('button',exact('Share HAA')).click();await page.getByRole('button',exact(label)).click();}
