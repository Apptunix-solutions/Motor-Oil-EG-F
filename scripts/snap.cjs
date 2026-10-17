const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const rootDir = 'C:\\Users\\mosta\\Downloads\\Zayt-Store-SY-F-main\\Zayt-Store-SY-F-main';

function snap(url, filename) {
  const outFile = path.join(rootDir, filename);
  if (fs.existsSync(outFile)) {
    try { fs.unlinkSync(outFile); } catch(e) {}
  }
  const tempProfile = path.join(os.tmpdir(), 'chrome_snap_' + Math.random().toString(36).substring(2));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${tempProfile}`,
    `--screenshot=${outFile}`,
    '--window-size=1280,1000',
    url
  ];

  console.log('Snapping:', filename, url);
  try {
    execFileSync(chromePath, args, { timeout: 12000 });
  } catch(e) {}
  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch(e) {}
  console.log('Result:', filename, 'exists =', fs.existsSync(outFile), 'size =', fs.existsSync(outFile) ? fs.statSync(outFile).size : 0);
}

snap('http://localhost:5173/', 'snap_home.png');
