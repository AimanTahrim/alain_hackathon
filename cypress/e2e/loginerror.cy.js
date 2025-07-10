it("TC002", () => {
  cy.login();
  cy.url().should("include", "/dashboard");
});
