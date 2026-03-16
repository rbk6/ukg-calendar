import { google } from 'googleapis';
import type { GoogleAuth } from 'google-auth-library';
import { config } from '../config';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export function getCalendarAuth(): GoogleAuth {
    return new google.auth.GoogleAuth({
        keyFile: config.google.credentialsPath,
        scopes: SCOPES,
    });
}
