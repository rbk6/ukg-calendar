import { Page } from 'playwright';
import { Shift, ScrapedSchedule } from '../types';

export async function scrapeSchedule(page: Page): Promise<ScrapedSchedule> {
    const shifts: Shift[] = [];

    // attempt network interception first
    page.on("response", async (response) => {
        const url = response.url().toLowerCase();
        if (url.includes("schedule") && response.status() === 200) {
            try {
                const data = await response.json();
                console.log("Intercepted schedule API response:", JSON.stringify(data, null, 2));
                // TODO: map data to Shift[] after getting shape of response
            } catch {
                // response wasn't JSON, skip
            }
        }
    });

    // navigate to schedule page
    // TODO: update this URL to UKG schedule page
    await page.waitForLoadState("networkidle");
    console.log("Schedule page loaded.");

    // Fallback: HTML scraping if network interception didn't yield data
    // TODO: update with selectors for UKG schedule page
    if (shifts.length === 0) {
        console.log("No API data intercepted, falling back to HTML scraping...");
        const shiftElements = await page.locator(".shift-card").all(); // placeholder selector
        for (const el of shiftElements) {
            const text = await el.innerText();
            console.log("Shift element text:", text); // inspect raw output first
        }
    }

    return {
        shifts,
        scrapedAt: new Date().toISOString(),
    };
}