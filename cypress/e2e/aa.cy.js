it("should visit Google and check title1", () => {
  cy.visit("https://www.google.com");
  cy.title().should("include", "Firefox");
});
