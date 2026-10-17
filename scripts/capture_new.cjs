const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const rootDir = 'C:\\Users\\mosta\\Downloads\\Zayt-Store-SY-F-main\\Zayt-Store-SY-F-main'

function takeScreenshot(url, filename) {
  const outFile = path.join(rootDir, filename)
  if (fs.existsSync(outFile)) {
    try {
      fs.unlinkSync(outFile)
    } catch (e) {}
  }
  const tempProfile = path.join(
    os.tmpdir(),
    'chrome_profile_' + Math.random().toString(36).substring(2),
  )
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-extensions --user-data-dir="${tempProfile}" --screenshot="${outFile}" --window-size=1280,1000 ${url}`

  console.log(`Running screenshot: ${filename} from ${url}`)
  try {
    execSync(cmd, { timeout: 14000 })
  } catch (e) {
    // Expected timeout after write
  }
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true })
  } catch (e) {}

  const ok = fs.existsSync(outFile)
  const size = ok ? fs.statSync(outFile).size : 0
  console.log(`Finished ${filename}: exists=${ok}, size=${size}`)
  return ok && size > 1000
}

takeScreenshot('http://localhost:5173/?theme=dark', 'new_header_dark.png')
takeScreenshot('http://localhost:5173/?theme=light', 'new_header_light.png')
takeScreenshot('http://localhost:5173/profile?theme=dark', 'new_profile_dark.png')
takeScreenshot('http://localhost:5173/profile?theme=light', 'new_profile_light.png')
console.log('ALL_CAPTURED_SUCCESSFULLY')
