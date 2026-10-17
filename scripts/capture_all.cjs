const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const shotDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true });

function captureOne(url, filename) {
  const outFile = path.join(shotDir, filename);
  if (fs.existsSync(outFile)) {
    try { fs.unlinkSync(outFile); } catch(e) {}
  }
  const tempProfile = path.join(os.tmpdir(), 'chrome_prf_' + Math.random().toString(36).substring(2));
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-extensions --user-data-dir="${tempProfile}" --screenshot="${outFile}" --window-size=1280,1000 "${url}"`;
  
  console.log(`Running: ${filename}`);
  try {
    execSync(cmd, { timeout: 6000 });
  } catch (err) {
    // Timeout is expected because Chrome keeps socket open, but file is written!
  }
  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch(e) {}

  const exists = fs.existsSync(outFile);
  const size = exists ? fs.statSync(outFile).size : 0;
  console.log(`Result ${filename}: exists=${exists}, size=${size}`);
  return exists && size > 1000;
}

captureOne('http://localhost:5173/?theme=dark', 'home_dark.png');
captureOne('http://localhost:5173/?theme=light', 'home_light.png');
captureOne('http://localhost:5173/products?theme=dark', 'products_dark.png');
captureOne('http://localhost:5173/products?theme=light', 'products_light.png');
console.log('BATCH_1_DONE');
