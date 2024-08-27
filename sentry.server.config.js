import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "SENTRY_DSN",
});