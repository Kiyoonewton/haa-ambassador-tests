const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
class FailureReviewReporter {
 onBegin(config,suite){this.suite=suite;}
 onEnd(){
  let revision='unknown';try{revision=execFileSync('git',['rev-parse','--short','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{}
  const clean=s=>String(s||'').replace(/\x1b\[[0-9;]*m/g,'');
  const tests=this.suite.allTests();
  if(!tests.some(test=>test.results.length))return;
  const lines=['# HAA test run — manual verification queue','',`Run: ${new Date().toISOString()} | Git revision: ${revision}`,'','A failed automation check is not automatically an app defect. Confirm the same action manually using MANUAL_VERIFICATION.md. Skipped checks remain unverified.','','| Check | Result |','|---|---|'];
  for(const test of tests){const r=test.results.at(-1);lines.push(`| ${test.title.replace(/\|/g,'/')} | ${r?.status||'not run'} |`);}
  for(const test of tests){
   const result=test.results.at(-1);if(!result||['passed','skipped'].includes(result.status))continue;
   lines.push('',`## ${test.title}`,'',`Status: ${result.status}. Classification: needs review, not a confirmed app defect.`,'');
   for(const error of result.errors||[])lines.push('```text',clean(error.message).slice(0,7000),'```','');
   lines.push('Manual steps: find this test ID in MANUAL_VERIFICATION.md. Record the actual result and whether the same issue occurs without automation.','');
  }
  const output=path.resolve('test-results/FAILURE_REVIEW.md');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,lines.join('\n'));
  console.log('\nManual verification queue: '+output);
 }
}
module.exports=FailureReviewReporter;
