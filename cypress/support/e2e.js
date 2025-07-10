// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "@shelex/cypress-allure-plugin";

Cypress.on("fail", (error, runnable) => {
  // Don't stop the entire test runner
  console.error("Test failed:", error.message);
  throw error; // keeps the test marked as failed
});

// Hide fetch/XHR requests from command log
Cypress.on("window:before:load", (win) => {
  win.fetch = null;
});

// Global error handling
Cypress.on("uncaught:exception", (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // that might occur in the application
  return false;
});

// Custom assertions
chai.use((chai, utils) => {
  chai.Assertion.addMethod("containMessage", function (message) {
    const obj = this._obj;
    const found = obj.find((el) => el.textContent.includes(message));
    this.assert(
      found,
      `expected to find element containing "${message}"`,
      `expected not to find element containing "${message}"`
    );
  });
});

// Global test configuration
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();

  // Set up any global test data or configurations
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});
