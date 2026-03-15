export interface Shift {
    date: string;           // ISO format: "2026-03-15"
    startTime: string;      // "09:00"
    endTime: string;        // "17:00"
    location?: string;
    role?: string;
}

export interface ScrapedSchedule {
    shifts: Shift[];
    scrapedAt: string;      // ISO timestamp
}

export interface CalendarEvent {
    summary: string;
    location?: string;
    start: {
        dateTime: string;   // ISO 8601
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
}