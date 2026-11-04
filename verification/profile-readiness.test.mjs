import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {trackProfileReadiness} from '../tests/helpers/profile-readiness.js';
function setup(){
 const page=new EventEmitter();let clock=0;
 const tracker=trackProfileReadiness(page,{quietMs:750,now:()=>clock});
 return {page,tracker,advance:ms=>clock+=ms};
}
const request=()=>({resourceType:()=> 'fetch'});
test('does not capture blank initial form while a saved-profile request is pending',()=>{
 const {page,tracker,advance}=setup();const r=request();page.emit('request',r);
 assert.equal(tracker.isReady({city:'',org:''}),false);advance(1000);
 assert.equal(tracker.isReady({city:'',org:''}),false);
 page.emit('requestfinished',r);
 assert.equal(tracker.isReady({city:'Middletown',org:'Kiyoo code'}),false);
 advance(750);assert.equal(tracker.isReady({city:'Middletown',org:'Kiyoo code'}),true);
 tracker.dispose();
});
test('late form hydration resets stability even after network is idle',()=>{
 const {tracker,advance}=setup();tracker.isReady({org:''});advance(1000);
 assert.equal(tracker.isReady({org:'Saved organization'}),false);
 advance(749);assert.equal(tracker.isReady({org:'Saved organization'}),false);
 advance(1);assert.equal(tracker.isReady({org:'Saved organization'}),true);
});
test('legitimate empty profile fields can become ready',()=>{
 const {tracker,advance}=setup();tracker.isReady({city:'',org:''});advance(750);
 assert.equal(tracker.isReady({city:'',org:''}),true);
});
test('a failed request is removed from pending activity',()=>{
 const {page,tracker,advance}=setup();const r=request();page.emit('request',r);tracker.isReady({org:''});
 advance(1000);page.emit('requestfailed',r);
 assert.equal(tracker.isReady({org:''}),false);advance(750);
 assert.equal(tracker.isReady({org:''}),true);
});
test('new request activity restarts the quiet period',()=>{
 const {page,tracker,advance}=setup();tracker.isReady({org:'Saved'});advance(750);
 const r=request();page.emit('request',r);assert.equal(tracker.isReady({org:'Saved'}),false);
 page.emit('requestfinished',r);advance(749);assert.equal(tracker.isReady({org:'Saved'}),false);
 advance(1);assert.equal(tracker.isReady({org:'Saved'}),true);
});
test('observer removes its listeners after readiness check',()=>{
 const {page,tracker}=setup();tracker.dispose();
 for(const event of ['request','requestfinished','requestfailed'])assert.equal(page.listenerCount(event),0);
});
