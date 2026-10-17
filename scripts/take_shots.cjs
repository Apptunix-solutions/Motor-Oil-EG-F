const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const shotDir = path.join(__dirname, '..', 'screenshots')
if (!fs.existsSync(shotDir)) {
  fs.mkdirSync(shotDir, { recursive: true })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function capture(url, filename) {
  const outFile = path.join(shotDir, filename)
  if (fs.existsSync(outFile)) {
    try {
      fs.unlinkSync(outFile)
    } catch (e) {}
  }

  const tempProfile = path.join(os.tmpdir(), 'cp_' + Math.random().toString(36).substring(2))

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1280,1000',
    `--screenshot=${outFile}`,
    url,
  ]

  console.log(`[CAPTURE] ${filename} from ${url}`)
  const proc = spawn(chromePath, args)

  let done = false
  proc.stderr.on('data', (d) => {
    const s = d.toString()
    if (s.includes('bytes written to file')) {
      console.log('Detected write:', s.trim())
      done = true
    }
  })
  proc.stdout.on('data', (d) => {
    const s = d.toString()
    if (s.includes('bytes written to file')) {
      console.log('Detected write stdout:', s.trim())
      done = true
    }
  })

  for (let i = 0; i < 40; i++) {
    await sleep(250)
    if (done || (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000)) {
      console.log(
        `Success file created: ${filename} size=${fs.existsSync(outFile) ? fs.statSync(outFile).size : 0}`,
      )
      break
    }
  }

  try {
    proc.kill()
  } catch (e) {}
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true })
  } catch (e) {}
  await sleep(400)
}

async function run() {
  await capture('http://localhost:5173/?theme=dark', 'home_dark.png')
  await capture('http://localhost:5173/?theme=light', 'home_light.png')
  await capture('http://localhost:5173/products?theme=dark', 'products_dark.png')
  await capture('http://localhost:5173/products?theme=light', 'products_light.png')
  await capture('http://localhost:5173/merchants?theme=dark', 'merchants_dark.png')
  await capture('http://localhost:5173/merchants?theme=light', 'merchants_light.png')
  console.log('DONE_ALL_SCREENSHOTS')
}

run()
