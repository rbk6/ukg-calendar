import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import { Shift, CalendarEvent } from '../types';
import { config } from '../config';
import { getCalendarAuth } from './auth';

const SOURCE_TAG = 'ukg-calendar';

export function shiftToCalendarEvent(shift: Shift): CalendarEvent {
    return {
        summary: shift.role ?? 'Work Shift',
        location: shift.location,
        start: {
            dateTime: `${shift.date}T${shift.startTime}:00`,
            timeZone: config.google.timeZone,
        },
        end: {
            dateTime: `${shift.date}T${shift.endTime}:00`,
            timeZone: config.google.timeZone,
        },
    };
}

function dateRangeForShifts(shifts: Shift[]): { timeMin: string; timeMax: string } {
    const dates = shifts.map((s) => s.date).sort();
    const min = new Date(dates[0]);
    min.setDate(min.getDate()); // min.getDate()-1 for current day, which i am excluding
    const max = new Date(dates[dates.length - 1]);
    max.setDate(max.getDate() + 1);
    return {
        timeMin: min.toISOString(),
        timeMax: max.toISOString(),
    };
}

export async function pushEventsToCalendar(shifts: Shift[]): Promise<void> {
    if (shifts.length === 0) return;

    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = config.google.calendarId;
    const { timeMin, timeMax } = dateRangeForShifts(shifts);

    // remove all previously managed events in the date range
    console.log(`removing existing managed events between ${timeMin} and ${timeMax} ...`);
    const toDelete: string[] = [];
    let pageToken: string | undefined;

    do {
        const listRes = await calendar.events.list({
            calendarId,
            timeMin,
            timeMax,
            privateExtendedProperty: [`source=${SOURCE_TAG}`],
            pageToken,
            maxResults: 250,
        }) as { data: calendar_v3.Schema$Events };

        for (const event of listRes.data.items ?? []) {
            if (event.id) toDelete.push(event.id);
        }

        pageToken = listRes.data.nextPageToken ?? undefined;
    } while (pageToken);

    await Promise.all(
        toDelete.map((id) => calendar.events.delete({ calendarId, eventId: id })),
    );
    if (toDelete.length > 0) console.log(`deleted ${toDelete.length} managed event(s)`);

    // create fresh events
    const events = shifts.map(shiftToCalendarEvent);
    console.log(`creating ${events.length} event(s) ...`);

    await Promise.all(
        events.map((event) =>
            calendar.events.insert({
                calendarId,
                requestBody: {
                    ...event,
                    extendedProperties: { private: { source: SOURCE_TAG } },
                },
            }),
        ),
    );

    console.log(`created ${events.length} event(s)`);
    console.log('calendar sync complete');
}
