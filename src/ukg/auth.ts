import { Page } from 'playwright';
import { config } from '../config';

export async function login(page: Page): Promise<void> {
    console.log("Navigating to UKG...");
    await page.goto(config.ukg.url);
    await page.waitForLoadState("domcontentloaded");

    await page.locator("#submittedIdentifier").fill(config.ukg.username);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForLoadState("domcontentloaded");

    await page.locator("#password").waitFor({ state: "visible" });
    await page.locator("#password").fill(config.ukg.password);

    console.log("Authenticating...");
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForLoadState("domcontentloaded");

    await page.locator('[id^="viewMyScheduleLink"]').waitFor({ state: 'visible' });
    await page.locator('[id^="viewMyScheduleLink"]').click();
}
