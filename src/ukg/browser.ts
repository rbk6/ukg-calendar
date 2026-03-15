import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { config } from '../config';

let browser: Browser;

export async function launchBrowser(): Promise<{ context: BrowserContext; page: Page }> {
    browser = await chromium.launch({ headless: config.browser.headless });
    const context = await browser.newContext();
    const page = await context.newPage();
    return { context, page };
}

export async function closeBrowser(): Promise<void> {
    await browser.close();
}
