import { spawnSync } from 'node:child_process';
const speed = process.argv.find(a => a.startsWith('--speed='))?.split('=')[1] || '700';
if (!Number.isFinite(Number(speed)) || Number(speed) < 0) throw new Error('Speed must be milliseconds >= 0');
const extra = process.argv.slice(2).filter(a=>!a.startsWith('--speed='));
const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright','test',...extra], {stdio:'inherit',env:{...process.env,HEADED:'1',SLOW_MO:speed}});
process.exit(result.status ?? 1);
