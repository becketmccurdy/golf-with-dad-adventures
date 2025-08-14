
import * as Sentry from "@sentry/react";
// ...existing code...
import { Replay } from "@sentry/replay";

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
  // Tracing is automatic in Sentry v8+; no need for BrowserTracing integration
        new Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  }
}
