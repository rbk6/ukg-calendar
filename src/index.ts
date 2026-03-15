import { launchBrowser, closeBrowser } from './ukg/browser';
import { login } from './ukg/auth';
import { scrapeSchedule } from './ukg/scraper';
import { pushEventsToCalendar } from './calendar/events';

async function main(): Promise<void> {
    const { page } = await launchBrowser();

    try {
        await login(page);
        const schedule = await scrapeSchedule(page);

        console.log(`Found ${schedule.shifts.length} shifts.`);

        if (schedule.shifts.length > 0) {
            await pushEventsToCalendar(schedule.shifts);
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await closeBrowser();
    }
}

main();