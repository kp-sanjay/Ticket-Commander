import { chromium } from 'playwright';

export async function fetchTheatres(regionCode: string) {
    // Fallback data for demo if scraping is blocked/fails
    const FALLBACK_THEATRES: Record<string, string[]> = {
        'chennai': [
            'PVR: VR Chennai, Anna Nagar',
            'Sathyam Cinemas: Royapettah',
            'Escape Cinemas: Express Avenue',
            'Palazzo Cinemas: Nexus Vijaya Mall',
            'AGS Cinemas: T. Nagar',
            'AGS Cinemas: OMR',
            'Mayajaal Multiplex: ECR',
            'Rohini Silver Screens: Koyambedu',
            'Kamala Cinemas: Vadapalani',
            'Udhayam Theatres: Ashok Nagar',
            'Devi Cineplex: Mount Road',
            'Sangam Cinemas: Kilpauk',
            'EGA Cinemas: Kilpauk',
            'Albert Theatre: Egmore',
            'Casino Cinemas: Mount Road',
            'Woodlands Cinemas: Royapettah',
            'Vettri Theatres: Chromepet',
            'GK Cinemas: Porur',
            'Rakki Cinemas: Ambattur'
        ],
        'coimbatore': [
            'KG Cinemas: Race Course',
            'The Cinema: Brookefields Mall',
            'INOX: Prozone Mall',
            'PVR: Lakshmi Mills',
            'Karpagam Complex: Gandhipuram',
            'Archana Dhyana: Gandhipuram',
            'Baba Complex: Coimbatore',
            'Senthil Kumaran Theatres: Coimbatore',
            'Ganga Yamuna Kaveri: Coimbatore',
            'Shanthi Theatre: Coimbatore'
        ]
    };

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Try the new URL structure: https://in.bookmyshow.com/explore/cinemas-{region}
        let url = `https://in.bookmyshow.com/explore/cinemas-${regionCode}`;
        console.log(`Fetching theatres from: ${url}`);
        
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        } catch (e) {
            console.log('Navigation timeout or error, trying fallback URL...');
        }
        
        // Check if 404 or redirect or error page
        if (page.url().includes('404') || page.url() === 'https://in.bookmyshow.com/') {
             url = `https://in.bookmyshow.com/explore/cinemas/${regionCode}`;
             console.log(`Retrying with: ${url}`);
             await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
        }

        const theatres = await page.evaluate(() => {
            const list: string[] = [];
            document.querySelectorAll('a[href*="/cinemas/"]').forEach(el => {
                const name = el.textContent?.trim();
                if (name && !list.includes(name)) list.push(name);
            });
            if (list.length === 0) {
                 document.querySelectorAll('div[class*="CinemaCard"] div[class*="name"]').forEach(el => {
                     const name = el.textContent?.trim();
                     if (name && !list.includes(name)) list.push(name);
                 });
            }
            return list;
        });

        console.log(`Found ${theatres.length} theatres`);
        
        if (theatres.length === 0 && FALLBACK_THEATRES[regionCode]) {
            console.log('Returning fallback data due to empty scrape result');
            return FALLBACK_THEATRES[regionCode];
        }

        return theatres;
    } catch (err) {
        console.error('Error fetching theatres:', err);
        if (FALLBACK_THEATRES[regionCode]) {
            console.log('Returning fallback data due to error');
            return FALLBACK_THEATRES[regionCode];
        }
        return [];
    } finally {
        if (browser) await browser.close().catch(() => {});
    }
}
