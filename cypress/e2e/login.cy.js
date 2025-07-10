describe("Login Feature Tests", () => {
  beforeEach(() => {
    cy.itemWebsite();
  });

  describe("Successful Login Tests", () => {
    it("TC001 - Should login successfully with valid credentials", () => {
      cy.loginWithCredentials("alain", "alain1234");
      // Verify successful login
      cy.url().should("include", "/items");
      cy.contains("Select Your Items").should("be.visible");
    });
  });

  describe("Invalid Credentials Tests", () => {
    it("TC002 - Should fail login with invalid username", () => {
      // Test data
      const invalidUsername = "invaliduser";
      const validPassword = "alain1234";

      cy.window().then((win) => {
        cy.stub(win, "alert").as("windowAlert");
      });

      // Enter invalid username with valid password
      cy.get("#username").type(invalidUsername);
      cy.get("#password").type(validPassword);

      // Click login button
      cy.get("button").contains("Login").click();

      cy.get("@windowAlert").should("have.been.calledWith", "Invalid login");

      cy.url().should("include", "/");
    });

    it("TC003 - Should fail login with invalid password", () => {
      // Test data
      const validUsername = "alain";
      const invalidPassword = "wrongpassword";

      cy.window().then((win) => {
        cy.stub(win, "alert").as("windowAlert");
      });

      // Enter valid username with invalid password
      cy.get("#username").type(validUsername);
      cy.get("#password").type(invalidPassword);

      // Click login button
      cy.get("button").contains("Login").click();

      cy.get("@windowAlert").should("have.been.calledWith", "Invalid login");

      // Verify user remains on login page
      cy.url().should("include", "/");
    });

    it("TC006 - Should fail login with incorrect password case (DEFECT TEST)", () => {
      // Test data - testing the known defect
      const validUsername = "alain";
      const uppercasePassword = "ALAIN1234";

      cy.window().then((win) => {
        cy.stub(win, "alert").as("windowAlert");
      });

      // Enter valid username with uppercase password
      cy.get("#username").type(validUsername);
      cy.get("#password").type(uppercasePassword);

      // Click login button
      cy.get("button").contains("Login").click();

      // Expected behavior: Should fail with error message
      // Actual behavior: Login succeeds (DEFECT)
      // This test will document the defect
      cy.get("@windowAlert").should("have.been.calledWith", "Invalid login");
      cy.url().should("include", "/");
    });
  });

  describe("Field Validation Tests", () => {
    it("TC004 - Should show validation message for empty username", () => {
      // Leave username empty, enter password
      cy.get("#password").type("alain1234");

      cy.window().then((win) => {
        cy.stub(win, "alert").as("windowAlert");
      });

      // Click login button
      cy.get("button").contains("Login").click();

      // Verify validation message
      cy.get("@windowAlert").should("have.been.calledWith", "Invalid login");

      // Verify login doesn't proceed
      cy.url().should("include", "/");
    });

    it("TC005 - Should show validation message for empty password", () => {
      // Enter username, leave password empty
      cy.get("#username").type("alain");

      cy.window().then((win) => {
        cy.stub(win, "alert").as("windowAlert");
      });

      // Click login button
      cy.get("button").contains("Login").click();

      // Verify validation message
      cy.get("@windowAlert").should("have.been.calledWith", "Invalid login");

      // Verify login doesn't proceed
      cy.url().should("include", "/");
    });

    it("Should show validation messages for both empty fields", () => {
      cy.window().then((win) => {
        cy.stub(win, "alert").as("windowAlert");
      });
      // Click login button without entering any credentials
      cy.get("button").contains("Login").click();

      // Verify validation messages for both fields
      cy.get("@windowAlert").should("have.been.calledWith", "Invalid login");

      // Verify login doesn't proceed
      cy.url().should("include", "/");
    });
  });

  describe("Edge Case Tests", () => {
    it("TC007 - Should handle username case sensitivity correctly", () => {
      // Test data
      const uppercaseUsername = "ALAIN";
      const validPassword = "alain1234";

      // Enter uppercase username
      cy.get("#username").type(uppercaseUsername);
      cy.get("#password").type(validPassword);

      // Click login button
      cy.get("button").contains("Login").click();

      // Result depends on system requirements
      // Typically usernames are case-insensitive, so this should succeed
      // Adjust assertion based on actual system behavior
      cy.url().should("include", "/items");
    });

    it("TC008 - Should handle leading/trailing spaces in credentials", () => {
      // Test data with spaces
      const usernameWithSpaces = " alain ";
      const passwordWithSpaces = " alain1234 ";

      // Enter credentials with spaces
      cy.get("#username").type(usernameWithSpaces);
      cy.get("#password").type(passwordWithSpaces);

      // Click login button
      cy.get("button").contains("Login").click();

      // System should trim spaces and authenticate successfully
      cy.url().should("include", "/items");
    });

    it("TC009 - Should handle special characters in password", () => {
      // Test data with special characters
      const username = "alain";
      const specialPassword = "alain@1234#";

      // Enter credentials with special characters
      cy.get("#username").type(username);
      cy.get("#password").type(specialPassword);

      // Click login button
      cy.get("button").contains("Login").click();

      // Should work if password contains special characters
      cy.url().should("include", "/items");
    });

    it("TC010 - Should handle maximum length input gracefully", () => {
      // Test data with extremely long strings
      const longUsername = "a".repeat(500);
      const longPassword = "b".repeat(500);

      // Enter extremely long credentials
      cy.get("#username").type(longUsername);
      cy.get("#password").type(longPassword);

      // Click login button
      cy.get("button").contains("Login").click();

      // System should handle gracefully
      cy.contains("Invalid username or password").should("be.visible");
      //cy.url().should("include", "/login");
    });
  });
});
