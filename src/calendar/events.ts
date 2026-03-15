import { Shift, CalendarEvent } from '../types';
import { config } from '../config';

export function shiftToCalendarEvent(shift: Shift): CalendarEvent {
    return {
        summary: shift.role ?? "Work Shift",
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

export async function pushEventsToCalendar(shifts: Shift[]): Promise<void> {
    const events = shifts.map(shiftToCalendarEvent);
    console.log("Events ready to push:", JSON.stringify(events, null, 2));
    // TODO: implement actual Google Calendar API calls
}