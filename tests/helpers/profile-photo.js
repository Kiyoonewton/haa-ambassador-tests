import {expect} from '@playwright/test';
import {PNG} from 'pngjs';
import {trackProfileReadiness} from './profile-readiness.js';

export function testPhoto(){
 const png=new PNG({width:160,height:160});
 for(let y=0;y<160;y++)for(let x=0;x<160;x++){
  const i=(y*160+x)*4, mark=(x>45&&x<115)||(y>65&&y<95);
  png.data[i]=mark?255:25;png.data[i+1]=mark?205:80;png.data[i+2]=mark?60:150;png.data[i+3]=255;
 }
 return {name:'haa-qa-avatar.png',mimeType:'image/png',buffer:PNG.sync.write(png)};
}
export const photo=page=>page.getByRole('img',{name:'Profile picture',exact:true});
async function settled(page,tracker){
 await expect.poll(async()=>{
  const state=await photo(page).evaluate(img=>({src:img.getAttribute('src'),complete:img.complete,width:img.naturalWidth}));
  return state.complete&&state.width>0&&tracker.isReady(state);
 },{message:'Profile image and upload requests must finish before continuing',timeout:20000,intervals:[100,250]}).toBe(true);
}
export async function uploadPhoto(page,file){
 let tracker=trackProfileReadiness(page);
 let preview;
 try{
  const previous=await photo(page).getAttribute('src');
  const chooserPromise=page.waitForEvent('filechooser');
  await photo(page).click();
  const chooser=await chooserPromise;await chooser.setFiles(file);
  await expect(photo(page),'Selecting a different photo should update its preview').not.toHaveAttribute('src',previous||'');
  await settled(page,tracker);
  preview=await photo(page).screenshot();
 }finally{tracker.dispose();}
 // Support both immediate upload and an explicit Save changes flow.
 const save=page.getByRole('button',{name:'Save changes',exact:true});
 if(await save.isVisible()&&await save.isEnabled()){
  tracker=trackProfileReadiness(page);
  try{
   await save.click();
   await expect.poll(async()=>{
    // The app may remain on Profile or return to dashboard after save.
    const url=page.url();
    const current=await page.getByRole('main').innerText();
    return tracker.isReady({url,current});
   },{timeout:20000,intervals:[100,250]}).toBe(true);
  }finally{tracker.dispose();}
 }
 return preview;
}
export function imageDifference(before,after){
 const a=PNG.sync.read(before),b=PNG.sync.read(after);
 if(a.width!==b.width||a.height!==b.height)return 1;
 let changed=0;
 for(let i=0;i<a.data.length;i+=4){
  if(Math.max(...[0,1,2,3].map(j=>Math.abs(a.data[i+j]-b.data[i+j])))>20)changed++;
 }
 return changed/(a.width*a.height);
}
export async function backupPhoto(page){
 const src=await photo(page).getAttribute('src');
 if(!src)throw new Error('Cannot back up the original profile photo: missing source.');
 const response=await page.request.get(new URL(src,page.url()).href);
 expect(response.ok(),'Original photo must be backed up before changing it').toBeTruthy();
 const mimeType=(response.headers()['content-type']||'').split(';')[0];
 expect(mimeType,'Original photo response must be an image').toMatch(/^image\//);
 const extension=({'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/svg+xml':'svg','image/gif':'gif'})[mimeType];
 if(!extension)throw new Error('Unsupported original photo format; use a dedicated test account with a PNG/JPEG/WebP photo.');
 return {name:'original-avatar.'+extension,mimeType,buffer:await response.body()};
}
