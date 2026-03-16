# ukg-calendar

Automatically scrapes your UKG/Kronos work schedule and syncs it to Google Calendar using Playwright and the Google Calendar API.

---

## Requirements

- Node.js 20+
- A UKG (Kronos) account
- A Google Cloud project with a Service Account

---

## Node.js Setup (via nvm)

If you don't have Node 20+, install nvm first:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # or ~/.zshrc if using zsh
nvm install --lts
nvm use --lts
nvm alias default lts/*
```

Verify:
```bash
node --version  # should be 20.x or 22.x
```

---

## Installation

```bash
git clone <repo-url>
cd ukg-calendar
npm install
npx playwright install chromium
```

---

## Google Calendar Setup

This project uses a **service account** to write to Google Calendar — no browser-based OAuth flow required.

### 1. Create a service account

1. Go to [Google Cloud Console](https://console.cloud.google.com) and create a project (or select an existing one)
2. Go to **APIs & Services → Credentials → Create Credentials → Service account**
3. Give it a name, click through the defaults, and finish
4. Open the service account, go to the **Keys** tab → **Add Key → Create new key → JSON**
5. Download the JSON file and save it as `google-credentials.json` in the project root

### 2. Share your calendar with the service account

1. Open [Google Calendar](https://calendar.google.com) in your browser
2. In the left sidebar, hover over the calendar you want to sync to and click the **three-dot menu → Settings and sharing**
3. Under **Share with specific people or groups**, click **+ Add people and groups**
4. Enter the service account's email address — it's the `client_email` value in the downloaded JSON (looks like `name@project-id.iam.gserviceaccount.com`)
5. Set permission to **"Make changes to events"** and click **Send**
6. On the same settings page, scroll down to **Integrate calendar** and copy the **Calendar ID** (e.g. `abc123@group.calendar.google.com`) — you'll need this for your env file

> Note: the service account cannot access your `primary` calendar. You must use a named calendar and share it explicitly as above.

---

## Environment Setup

This project uses [Varlock](https://varlock.dev) for type-safe environment variables.

### 1. Copy the example env file

```bash
cp .env.example .env.local
```

### 2. Fill in your values

```
UKG_URL=https://your-ukg-instance.com
UKG_USERNAME=your_username
UKG_PASSWORD=your_password
GOOGLE_CREDENTIALS_PATH=google-credentials.json
GOOGLE_CALENDAR_ID=abc123@group.calendar.google.com
TIMEZONE=America/Los_Angeles
HEADLESS=true
```

`HEADLESS=true` is recommended for regular use. Set to `false` if you need to watch the browser during debugging.

### 3. Generate typed env definitions

```bash
npm run env
```

This validates `.env.local` against `.env.schema` and generates `src/env.d.ts`. Re-run any time you change `.env.schema`.

---

## Running

```bash
# run once
npm run start

# development mode (auto-restarts on file save)
npm run dev
```

---

## How it works

1. **Scrape** — Playwright logs into UKG and intercepts the schedule API response
2. **Convert** — each shift is mapped to a Google Calendar event
3. **Sync** — existing managed events in the scraped date range are deleted and recreated fresh

Events written by this tool are tagged with a private extended property (`source=ukg-calendar`) so they can be identified and cleaned up on subsequent runs without touching any events you created manually.

---

## Scripts

| Command | Description |
|---|---|
| `npm run env` | Validate `.env.local` and regenerate `src/env.d.ts` |
| `npm run start` | Run the sync pipeline once |
| `npm run dev` | Run with auto-restart on file changes |
