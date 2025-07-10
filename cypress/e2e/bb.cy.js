it("TC004", () => {
  cy.login();
  cy.url().should("include", "/product");
});
