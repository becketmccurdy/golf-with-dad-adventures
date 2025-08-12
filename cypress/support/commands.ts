/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>
    logout(): Chainable<void>
    createRound(data: any): Chainable<void>
  }
}

// Login command
Cypress.Commands.add('login', () => {
  // Since we can't directly use Google OAuth in Cypress tests,
  // we'll need to use a custom token or test credentials
  cy.visit('/login');
  // You would implement a test-specific login mechanism here
  // This could involve using Firebase Admin SDK to generate custom tokens
  // or using test-specific credentials
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    return win.firebase.auth().signOut();
  });
});

// Create a new round
Cypress.Commands.add('createRound', (data) => {
  cy.window().then((win) => {
    const { currentUser } = win.firebase.auth();
    if (!currentUser) throw new Error('No authenticated user!');

    return win.firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('rounds')
      .add(data);
  });
});
