import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  setupNodeEvents() {
      // implement node event listeners here
      // and load any plugins that require the Node environment
    },
  },
  env: {
    // Add environment variables that should be available in Cypress tests
    FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
  },
});
