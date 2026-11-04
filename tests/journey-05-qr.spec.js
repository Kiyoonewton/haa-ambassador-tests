import {test,expect} from '@playwright/test';
import jsQR from 'jsqr';
import {PNG} from 'pngjs';
import {sharing,exact,account} from './support.js';
test.describe('Journey 05 — Share a QR code',()=>{
 test.beforeEach(async({page})=>sharing(page,'QR code'));
 test('J05-01 QR image renders',async({page})=>{
  await expect(page.getByRole('dialog',exact('Your QR code'))).toBeVisible();
  const img=page.getByRole('img',exact('QR code'));await expect(img).toBeVisible();
  await expect.poll(()=>img.evaluate(e=>e.complete&&e.naturalWidth>0)).toBeTruthy();
 });
 test('J05-02 QR image encodes the correct personal URL',async({page})=>{
  const img=page.getByRole('img',exact('QR code'));
  await expect.poll(()=>img.evaluate(e=>e.complete&&e.naturalWidth>0)).toBeTruthy();
  const png=PNG.sync.read(await img.screenshot());
  const result=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);
  expect(result,'QR must decode').not.toBeNull();expect(result.data).toMatch(account.urlPattern);
 });
 test.skip('J05-03 Download saved QR image',{annotation:{type:'blocked',description:'Blocked: no Download control observed; only Share. Confirm expected product behavior.'}},async()=>{});
 test.skip('J05-04 Physical phone scan',{annotation:{type:'blocked',description:'Manual confirmation required with teammate phone.'}},async()=>{});
 test.skip('J05-05 QR patient attribution',{annotation:{type:'blocked',description:'Blocked: requires a submitted test patient and tracking confirmation.'}},async()=>{});
});
