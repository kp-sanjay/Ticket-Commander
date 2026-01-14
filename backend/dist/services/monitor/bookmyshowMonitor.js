import { chromium } from 'playwright';
import { rankTheatres, rankShowTimes } from './priorityEngine.js';
import { pickSeatsUpperCenterAdjacency } from './seatEngine.js';
import { sendSms, placeCall } from './notification.js';
let browser = null;
export async function ensureBrowser() {
    if (!browser) {
        browser = await chromium.launch({ headless: false });
    }
    return browser;
}
export async function checkAndSelect(config) {
    if (config.simulation) {
        const seats = simulateSeats();
        const pick = pickSeatsUpperCenterAdjacency(seats, config.seatPreference.count);
        if (pick.seats.length) {
            await placeCall('Tickets available. Opening booking.');
            await sendSms('Tickets available for ' + config.movieName);
        }
        return;
    }
    const b = await ensureBrowser();
    const page = await b.newPage();
    await page.context().clearCookies();
    const region = config.region || 'chennai';
    await page.goto(`https://in.bookmyshow.com/explore/home/${region}`, { waitUntil: 'domcontentloaded' });
    await page.fill('input[placeholder="Search for Movies, Events, Plays, Sports and Activities"]', config.movieName);
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    await page.locator('text=' + config.movieName).first().click();
    await page.waitForLoadState('domcontentloaded');
    // Wait for "Book tickets" button if it exists (sometimes direct list)
    const bookBtn = page.locator('button:has-text("Book tickets")');
    if (await bookBtn.isVisible()) {
        await bookBtn.click();
    }
    const theatres = rankTheatres(config);
    const times = rankShowTimes(config);
    // If no specific theatre pref, just try all visible showtimes? 
    // For now keeping strict logic as requested originally
    for (const theatre of theatres) {
        const theatreLocator = page.locator(`text=${theatre.name}`).first();
        const exists = await theatreLocator.count();
        if (!exists)
            continue;
        // In BMS, clicking theatre usually just filters or expands. 
        // We usually click the TIME directly under the theatre.
        for (const t of times) {
            // Find time under this theatre
            // Complex selector needed: Theatre Row -> Time
            // Simplified: Just find the time text for now, assuming unique enough or first match good enough
            const timeLocator = page.locator(`text=${t.time}`).first();
            const timeExists = await timeLocator.count();
            if (!timeExists)
                continue;
            await timeLocator.click();
            // Handle "Accept" terms if any
            try {
                await page.locator('text=Accept').click({ timeout: 2000 });
            }
            catch (e) { }
            // Select quantity popup
            try {
                await page.locator(`li:has-text("${config.seatPreference.count}")`).click({ timeout: 2000 });
                await page.locator('text=Select Seats').click({ timeout: 2000 });
            }
            catch (e) { }
            await page.waitForLoadState('domcontentloaded');
            const seatGrid = await extractSeatGrid(page);
            const pick = pickSeatsUpperCenterAdjacency(seatGrid, config.seatPreference.count);
            if (pick.seats.length) {
                // Select seats in browser
                for (const seat of pick.seats) {
                    // Click specific seat based on row/col logic match in DOM
                    // This requires robust selector matching which is hard without real DOM access
                    // Attempting generic selector logic
                    await page.evaluate(({ rowLabel, col }) => {
                        const rows = document.querySelectorAll('[class*="seatLayout"] [class*="row"]');
                        for (const r of rows) {
                            if (r.querySelector('[class*="rowLabel"]')?.textContent?.includes(rowLabel)) {
                                const seats = r.querySelectorAll('[class*="seat"]');
                                // 1-based index
                                if (seats[col - 1])
                                    seats[col - 1].click();
                            }
                        }
                    }, { rowLabel: seat.rowLabel, col: seat.col });
                }
                // Click Pay/Book button
                // "Pay Rs. XXX" or "Book"
                const payBtn = page.locator('text=/Pay|Book/i').first();
                if (await payBtn.isVisible()) {
                    await payBtn.click();
                }
                await placeCall('Tickets available. Opening booking.');
                await sendSms(page.url());
                // Wait for user manual interaction
                // Do not close page
                return;
            }
            await page.goBack();
        }
    }
}
async function extractSeatGrid(page) {
    const grid = await page.evaluate(() => {
        const rows = [];
        const seatRows = document.querySelectorAll('[class*="seatLayout"] [class*="row"]');
        seatRows.forEach((row) => {
            const label = row.querySelector('[class*="rowLabel"]')?.textContent || '';
            const cells = [];
            const seats = row.querySelectorAll('[class*="seat"]');
            let col = 1;
            seats.forEach((s) => {
                const available = s.getAttribute('aria-disabled') !== 'true' && s.getAttribute('aria-label')?.includes('Available');
                cells.push({ rowLabel: label, col, available });
                col += 1;
            });
            rows.push(cells);
        });
        return rows;
    });
    return grid;
}
function simulateSeats() {
    const rows = [];
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (let r = 0; r < labels.length; r++) {
        const row = [];
        for (let c = 1; c <= 20; c++) {
            row.push({ rowLabel: labels[r], col: c, available: Math.random() > 0.3 });
        }
        rows.push(row);
    }
    return rows;
}
