it("TC001", () => {
  cy.visit("https://www.google.com");
  cy.title().should("include", "Firefox");
});
