import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9eca628c07829595fc821f2eb3dc4b37@o4507771466153984.ingest.de.sentry.io/4507771469955152",
  tracesSampleRate: 1.0,
});