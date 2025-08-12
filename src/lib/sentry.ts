import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.BrowserTracing({
          // Set sampling rate for performance monitoring
          tracePropagationTargets: ['localhost', 'your-domain.com'],
        }),
        new Sentry.Integrations.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in development
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample rate for all sessions
      replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors
    });
  }
};
