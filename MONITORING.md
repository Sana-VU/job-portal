# Monitoring and Alerts

This project includes health checks, Sentry error tracking (optional), and email alert scaffolding.

## Health Endpoints (Backend)

- `GET /api/health` – service health, MongoDB status/latency, Cloudinary status.
- `GET /api/version` – package info and commit SHA (if available).

## Sentry (Optional)

Set in backend `.env`:

- `SENTRY_DSN` – enables Sentry when present.
- `NODE_ENV`, `COMMIT_SHA` – improve event context.

## Uptime Checks

Script: `scripts/setup-uptime-robot.js` can automate UptimeRobot monitor creation.

## Email Alerts (Optional)

Routes (secured with `ADMIN_API_KEY`):

- `POST /api/monitoring/alerts/config` – set alert emails and thresholds.
- `POST /api/monitoring/alerts/test` – send a test email.
- `GET /api/monitoring/alerts/history` – returns mock history (for demo).

Backend `.env` for email:

- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`
- `ADMIN_API_KEY` – simple API key to call alert endpoints.

