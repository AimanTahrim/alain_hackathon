it("TC003", () => {
  cy.login();
  cy.url().should("include", "/order");
});
