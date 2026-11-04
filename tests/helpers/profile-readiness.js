// Observe requests before navigation so a visible form cannot be mistaken for
// a loaded form while its saved profile is still in flight. No field is required
// to be non-empty: blank city/organization values can be legitimate.
export function trackProfileReadiness(page, {quietMs=750, now=Date.now}={}) {
 const pending=new Set();
 let lastNetworkChange=now(), lastFormChange=now(), previousForm;
 const relevant=request=>['xhr','fetch'].includes(request.resourceType());
 const started=request=>{
  if(relevant(request)){pending.add(request);lastNetworkChange=now();}
 };
 const finished=request=>{
  if(pending.delete(request))lastNetworkChange=now();
 };
 page.on('request',started);
 page.on('requestfinished',finished);
 page.on('requestfailed',finished);
 return {
  isReady(form){
   const fingerprint=JSON.stringify(form);
   if(fingerprint!==previousForm){previousForm=fingerprint;lastFormChange=now();}
   return pending.size===0 && now()-lastNetworkChange>=quietMs && now()-lastFormChange>=quietMs;
  },
  dispose(){
   page.off('request',started);
   page.off('requestfinished',finished);
   page.off('requestfailed',finished);
  }
 };
}
