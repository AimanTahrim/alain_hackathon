describe("Simple Smoke Test", () => {
  it("should visit Google and check title", () => {
    cy.visit("https://www.google.com");
    cy.title().should("include", "Google");
  });
});
