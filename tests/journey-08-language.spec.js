import {test,expect} from '@playwright/test';
import {dashboard,exact,account} from './support.js';
test.describe('Journey 08 — Switch dashboard language',()=>{
 test('J08-01 Switch English to Spanish and back',async({page})=>{
  await dashboard(page);await page.getByRole('button',exact('Open menu')).click();
  await page.getByRole('button',exact('Language • English')).click();await page.getByRole('button',exact('Español')).click();
  try{
   await expect(page).toHaveURL(/\/es\/ambassadors\/dashboard/);
   await expect(page.getByRole('heading',exact(account.name))).toBeVisible();
   for(const name of ['Editar perfil','Comparte HAA','Personas'])await expect(page.getByRole('button',exact(name))).toBeVisible();
   await expect(page.getByText('PRÓXIMAMENTE',{exact:true})).toBeVisible();
  }finally{
   const language=page.getByRole('button',exact('Language • Español'));
   if(!await language.isVisible())await page.getByRole('button',exact('Open menu')).click();
   await language.click();await page.getByRole('button',exact('English')).click();
   await expect(page.getByRole('button',exact('Edit profile'))).toBeVisible();
  }
 });
});
