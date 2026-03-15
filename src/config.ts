import 'varlock/auto-load';
import { ENV } from 'varlock';

export const config = {
    ukg: {
        url: ENV.UKG_URL,
        username: ENV.UKG_USERNAME,
        password: ENV.UKG_PASSWORD,
    },
    google: {
        credentialsPath: ENV.GOOGLE_CREDENTIALS_PATH ?? "google-credentials.json",
        calendarId: ENV.GOOGLE_CALENDAR_ID ?? "primary",
        timeZone: ENV.TIMEZONE ?? "America/Los_Angeles",
    },
    browser: {
        headless: ENV.HEADLESS === true,
        sessionPath: "auth.json",
    }
} as const;