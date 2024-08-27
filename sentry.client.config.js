import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "SENTRY_DSN",
  tracesSampleRate: 1.0,
});