import { test, expect } from '@playwright/test';
import { openProfile, account, exact } from './support.js';
const city=p=>p.getByRole('textbox',exact('My city'));
const org=p=>p.getByRole('textbox',exact('Organization / Affiliation'));
const read=async p=>({city:await city(p).inputValue(),org:await org(p).inputValue()});
const fill=async(p,v)=>{await city(p).fill(v.city);await org(p).fill(v.org);};
const verify=async(p,v)=>{await expect(city(p)).toHaveValue(v.city);await expect(org(p)).toHaveValue(v.org);};
// Match the submitted organization value instead of assuming a specific API URL.
function containsValue(value, expected) {
 if (value === expected) return true;
 if (Array.isArray(value)) return value.some(item=>containsValue(item,expected));
 return value !== null && typeof value === 'object' &&
  Object.values(value).some(item=>containsValue(item,expected));
}
async function save(p,values){
 const button=p.getByRole('button',exact('Save changes'));
 await expect(button,'Changes should enable Save changes').toBeEnabled();
 // Register before clicking so a fast response cannot be missed.
 const responsePromise=p.waitForResponse(response=>{
  const request=response.request();
  if(!['POST','PUT','PATCH'].includes(request.method()))return false;
  if(!['fetch','xhr'].includes(request.resourceType()))return false;
  try{return containsValue(request.postDataJSON(),values.org);}
  catch{return (request.postData()||'').includes(values.org);}
 },{timeout:20000}).then(response=>({response}),error=>({error}));
 try {
  await button.click();
  const result=await responsePromise;
  if(result.error)throw new Error('No profile-save response matched the submitted organization within 20s. Check the trace for validation errors or a changed request payload.',{cause:result.error});
  expect(result.response.ok(),'Profile save request must succeed').toBeTruthy();
  const body=await result.response.json().catch(()=>null);
  expect(body?.errors||[],'Profile save must not return GraphQL errors').toEqual([]);
  // A disabled button is not proof of persistence; reopening below verifies storage.
 } finally {
  // Consume the listener outcome even if the click fails.
  await responsePromise;
 }
}
const restoreValues=new WeakMap();
test.describe('Journey 03 — Update the ambassador profile',()=>{
 test.beforeEach(async({page},testInfo)=>{
  if(testInfo.title.startsWith('J03-03'))testInfo.setTimeout(90000);
  await openProfile(page);
 });
 test.afterEach(async({page})=>{
  const original=restoreValues.get(page);
  if(!original)return;
  await test.step('Restore original profile and verify persistence',async()=>{
   await openProfile(page);
   const current=await read(page);
   if(current.city!==original.city||current.org!==original.org){
    await fill(page,original);await save(page,original);
   }
   await openProfile(page);await verify(page,original);
  });
 });
 test('J03-01 Profile identity and fields',async({page})=>{
  await expect(page.getByText(account.link,{exact:true})).toBeVisible();
  await expect(city(page)).toBeVisible();await expect(org(page)).toBeVisible();
  await expect(page.getByRole('textbox',exact('Cell number'))).toBeDisabled();
  await expect(page.getByRole('textbox',exact('Email address'))).toBeDisabled();
 });
 test('J03-02 Role and text fields accept unsaved edits',async({page})=>{
  await page.getByRole('button',{name:/^I am/}).click();
  await page.getByRole('option',exact('Community Leader')).click();
  await expect(page.getByRole('button',{name:/^I am/})).toContainText('Community Leader');
  const v={city:'Orlando, FL 32801',org:'HAA QA unsaved'};await fill(page,v);await verify(page,v);
  await expect(page.getByRole('button',exact('Save changes'))).toBeEnabled();
  await page.getByRole('button',exact('Cancel')).click();
 });
 test('J03-03 Save city and organization, reopen, then restore',async({page})=>{
  const original=await read(page);
  restoreValues.set(page,original);
  const changed={city:original.city==='Orlando, FL 32801'?'Miami, FL 33101':'Orlando, FL 32801',org:`HAA QA ${Date.now()}`};
  await test.step('Enter changes and submit profile',async()=>{
   await fill(page,changed);await verify(page,changed);await save(page,changed);
  });
  await test.step('Reopen profile and verify saved city and organization',async()=>{
   await openProfile(page);await verify(page,changed);
  });
 });
 test('J03-04 Cancel discards unsaved edits',async({page})=>{
  const original=await read(page);await fill(page,{city:'Miami, FL 33101',org:`UNSAVED ${Date.now()}`});
  await page.getByRole('button',exact('Cancel')).click();await openProfile(page);await verify(page,original);
 });
 test.skip('J03-05 Photo upload and persistence',{annotation:{type:'blocked',description:'Blocked: no upload control observed; team confirmation needed.'}},async()=>{});
 test('J03-06 Copy link matches referral URL',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.evaluate(()=>navigator.clipboard.writeText('HAA QA sentinel'));
  await page.getByRole('button',exact('Copy link')).click();
  await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toMatch(account.urlPattern);
 });
});
