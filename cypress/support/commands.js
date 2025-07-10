// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("itemWebsite", (username, password) => {
  cy.visit("https://my-shop-eight-theta.vercel.app");
  cy.wait(2000);
});

Cypress.Commands.add("loginWithCredentials", (username, password) => {
  cy.get("#username").type(username);
  cy.get("#password").type(password);
  cy.get("button").contains("Login").click();
});

Cypress.Commands.add("verifyLoginSuccess", () => {
  cy.url().should("include", "/items");
  cy.contains("Welcome").should("be.visible");
});

Cypress.Commands.add("verifyLoginFailure", () => {
  cy.contains("Invalid username or password").should("be.visible");
  cy.url().should("include", "/login");
  cy.get("#password").should("have.value", "");
});

Cypress.Commands.add("clearLoginForm", () => {
  cy.get("#username").clear();
  cy.get("#password").clear();
});
