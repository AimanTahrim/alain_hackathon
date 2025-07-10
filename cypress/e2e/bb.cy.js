it("TC004", () => {
  cy.login();
  cy.url().should("include", "/sales");
  cy.contains("Select Your Items", { timeout: 10000 }).should("be.visible");
});
