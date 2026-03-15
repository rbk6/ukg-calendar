import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { config } from '../config';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;

export async function launchBrowser(): Promise<{ context: BrowserContext; page: Page }> {
    browser = await chromium.launch({ headless: config.browser.headless });

    // reuse saved session if it exists
    const sessionExists = fs.existsSync(config.browser.sessionPath);
    context = await browser.newContext(
        sessionExists ? { storageState: config.browser.sessionPath } : {}
    );

    const page = await context.newPage();
    return { context, page };
}

export async function saveSession(): Promise<void> {
    await context.storageState({ path: config.browser.sessionPath });
    console.log("Session saved.");
}

export async function closeBrowser(): Promise<void> {
    await browser.close();
}