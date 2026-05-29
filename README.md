# LabX — Developer Landing (test task)

Single-page developer landing with working API form, email delivery, optional Telegram notifications, and a small AI helper.

## Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express
- Email: Nodemailer (SMTP)
- AI: OpenAI API (optional) with local fallback summary mode
- Tests: Node built-in test runner

## Features

- Adaptive landing page with sections: about, workflow, cases, contacts
- Contact form with states: loading, success, error
- API validation and error handling
- Basic anti-spam (honeypot) and API rate limiting for contact endpoint
- Email to site owner + copy email to user
- Optional Telegram notification
- AI helper: quick summary generation for form comment

## Quick start with Docker

1. (Optional) copy `.env.example` to `.env` and set your own values.
2. Run one command:

```bash
docker compose up --build
```

3. Open `http://localhost:3000`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` (you only put your own credentials, no чужие токены):

```env
PORT=3000
OWNER_EMAIL=owner@example.com

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=example
SMTP_PASS=example

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

3. Start dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Tests

```bash
npm test
```

## Form implementation

- Frontend sends `POST /api/contact` with `name`, `phone`, `email`, `comment`.
- Backend validates fields and returns clear errors for invalid input.
- Backend returns `requestId` for easier debugging and support communication.
- Backend sends:
  - message to owner (`OWNER_EMAIL`),
  - copy to user (`email` from form).
- If SMTP is not configured, backend keeps API stable and returns a warning so UI can show that message.

## AI usage in project

- Added endpoint `POST /api/ai-summary` to generate a short text summary.
- If `OPENAI_API_KEY` is set, summary is generated through OpenAI API.
- Without key, local fallback summary is used to keep the feature testable.

## What was done with AI vs manually

- With AI: generated initial project scaffold, baseline section copy, first-pass validation and tests.
- Manual improvements: final structure, UX states, content edits, animation tuning, API error handling details, and README cleanup.
