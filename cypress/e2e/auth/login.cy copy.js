it("logs in using custom command", () => {
  cy.login();
  cy.url().should("include", "/dashboard");
});
