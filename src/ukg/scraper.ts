import { Page } from 'playwright';
import { Shift, ScrapedSchedule } from '../types';

function to24h(time: string): string {
    // "11:30 AM" → "11:30", "7:30 PM" → "19:30"
    const [timePart, period] = time.split(' ');
    const [h, m] = timePart.split(':').map(Number);
    let hours = h;
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    return `${hours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function parseShift(dateLabel: string, timeLabel: string): Shift | null {
    // dateLabel: "Monday March 16"
    // timeLabel: "11:30 AM-7:30 PM 8.00 hours"
    const dateParts = dateLabel.split(' ');
    if (dateParts.length < 3) return null;

    const year = new Date().getFullYear();
    const date = new Date(`${dateParts[1]} ${dateParts[2]}, ${year}`);
    if (isNaN(date.getTime())) return null;

    const timeMatch = timeLabel.match(/^(\d{1,2}:\d{2} [AP]M)-(\d{1,2}:\d{2} [AP]M)/);
    if (!timeMatch) return null;

    return {
        date: date.toISOString().split('T')[0],
        startTime: to24h(timeMatch[1]),
        endTime: to24h(timeMatch[2]),
    };
}

export async function scrapeSchedule(page: Page): Promise<ScrapedSchedule> {
    const shifts: Shift[] = [];

    try {
        await page.locator('ng-myschedule-shift').first().waitFor({ state: 'visible', timeout: 10000 });
    } catch {
        console.warn("No shift elements found within timeout.");
        return { shifts, scrapedAt: new Date().toISOString() };
    }

    const shiftElements = await page.locator('ng-myschedule-shift').all();

    for (const el of shiftElements) {
        const dateLabel = await el.locator('span.dayLabel').getAttribute('aria-label');
        const timeLabel = await el.locator('time.label').getAttribute('aria-label');

        if (!dateLabel || !timeLabel) continue;

        const shift = parseShift(dateLabel, timeLabel);
        if (shift) shifts.push(shift);
    }

    console.log(`Scraped ${shifts.length} shifts.`);
    return { shifts, scrapedAt: new Date().toISOString() };
}
