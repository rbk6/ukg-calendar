# ukg-calendar

Automatically scrapes your UKG/Kronos work schedule and syncs it to Google Calendar using Playwright and the Google Calendar API.

---

## Requirements

- Node.js 20+
- A UKG account
- A Google account with Calendar API access

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

## Environment Setup (Varlock)

This project uses [Varlock](https://varlock.dev) for type-safe, schema-validated environment variables.

### 1. Copy the example env file

```bash
cp .env.example .env
```

### 2. Fill in your values in `.env`

```bash
UKG_URL=https://your-ukg-instance.com
UKG_USERNAME=your_username
UKG_PASSWORD=your_password
GOOGLE_CREDENTIALS_PATH=google-credentials.json
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Los_Angeles
HEADLESS=false
```

### 3. Generate typed env definitions

```bash
npm run env
```

This validates your `.env` against `.env.schema` and generates `src/env.d.ts` which provides full TypeScript types for all env vars via `ENV.VARIABLE_NAME`.

> Re-run `npm run env` any time you add new variables to `.env.schema`.

---

## Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the **Google Calendar API**
4. Create OAuth 2.0 credentials (Desktop app)
5. Download the credentials JSON and save it as `google-credentials.json` in the project root
6. On first run you will be prompted to authorize via browser — this generates a token that is cached for future runs

---

## Running

```bash
# Run once
npm run start

# Development mode (auto-restarts on save)
npm run dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run env` | Validate `.env` and regenerate `src/env.d.ts` |
| `npm run start` | Run the scraper once |
| `npm run dev` | Run with auto-restart on file changes |
