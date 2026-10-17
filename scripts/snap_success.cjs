const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const targetDir = 'C:\\Users\\mosta\\Downloads\\Zayt-Store-SY-F-main\\Zayt-Store-SY-F-main'
const tempProfile = path.join(os.tmpdir(), 'chrome_headless_profile_' + Date.now())

try {
  const screenshotPath = path.join(targetDir, 'new_header_shot.png')
  if (fs.existsSync(screenshotPath)) fs.unlinkSync(screenshotPath)

  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-extensions --user-data-dir="${tempProfile}" --screenshot="${screenshotPath}" --window-size=1280,1000 http://localhost:5173/`
  console.log('Running:', cmd)
  execSync(cmd, { timeout: 16000 })
} catch (err) {
  // timeout is normal
} finally {
  const p = path.join(targetDir, 'new_header_shot.png')
  console.log(
    'Exists new_header_shot.png:',
    fs.existsSync(p),
    'size:',
    fs.existsSync(p) ? fs.statSync(p).size : 0,
  )
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true })
  } catch (e) {}
}
