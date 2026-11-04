import { test, expect } from '@playwright/test';
import { openProfile, account, exact } from './support.js';
const city=p=>p.getByRole('textbox',exact('My city'));
const org=p=>p.getByRole('textbox',exact('Organization / Affiliation'));
const read=async p=>({city:await city(p).inputValue(),org:await org(p).inputValue()});
const fill=async(p,v)=>{await city(p).fill(v.city);await org(p).fill(v.org);};
const verify=async(p,v)=>{await expect(city(p)).toHaveValue(v.city);await expect(org(p)).toHaveValue(v.org);};
async function save(p){
 await p.getByRole('button',exact('Save changes')).click();
 await expect(async()=>{
  const dashboard=await p.getByRole('heading',exact(account.name)).isVisible();
  const saved=await p.getByRole('heading',exact('Profile')).isVisible() && await p.getByRole('button',exact('Save changes')).isDisabled();
  expect(dashboard||saved).toBeTruthy();
 }).toPass({timeout:15000});
}
test.describe('Journey 03 — Update the ambassador profile',()=>{
 test.beforeEach(async({page})=>openProfile(page));
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
  const changed={city:original.city==='Orlando, FL 32801'?'Miami, FL 33101':'Orlando, FL 32801',org:`HAA QA ${Date.now()}`};
  try{
   await test.step('Save test values',async()=>{await fill(page,changed);await save(page);});
   await test.step('Verify persisted values',async()=>{await openProfile(page);await verify(page,changed);});
  }finally{
   await test.step('Restore original profile',async()=>{
    await openProfile(page);const current=await read(page);
    if(current.city!==original.city||current.org!==original.org){await fill(page,original);await save(page);}
    await openProfile(page);await verify(page,original);
   });
  }
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
