import { Page } from 'playwright';
import { config } from '../config';
import { saveSession } from './browser';

export async function login(page: Page): Promise<void> {
    console.log("Navigating to UKG...");
    await page.goto(config.ukg.url);
    await page.waitForLoadState("networkidle");

    // check if already logged in via saved session
    if (page.url().includes("schedule") || page.url().includes("home")) {
        console.log("Already logged in via saved session.");
        return;
    }

    console.log("Logging in...");
    // TODO: update with UKG selectors
    await page.getByLabel("Username").fill(config.ukg.username);
    await page.getByLabel("Password").fill(config.ukg.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await page.waitForLoadState("networkidle");
    console.log("Logged in. Saving session...");
    await saveSession();
}