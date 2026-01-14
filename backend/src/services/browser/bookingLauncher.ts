import { ensureBrowser } from '../monitor/bookmyshowMonitor.js'

export async function launchWithUrl(url: string) {
  const b = await ensureBrowser()
  const page = await b.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })
}

