import * as Sentry from "@sentry/nextjs";

// Sólo se activa si hay DSN configurado (si no, es no-op y no rompe nada).
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === "production",
  });
}
