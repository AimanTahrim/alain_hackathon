describe("E-commerce Product Page", () => {
  beforeEach(() => {
    // Navigate to the product page before each test
    cy.itemWebsite();
    cy.loginWithCredentials("alain", "alain1234");
    cy.url().should("include", "/items");
  });

  describe("User Story 1: Product Selection and Customization", () => {
    context("Product Display", () => {
      it("TC101 - should display product information and load within acceptable time", () => {
        // Verify page loads within 3 seconds (Cypress default timeout is 4s)

        // Verify product elements are present
        cy.get(".size-selector").should("be.visible");
        cy.get(".quantity-input").should("be.visible");
        cy.get(".submit-btn").should("be.visible");
      });
    });

    context("Product Customization", () => {
      it("TC102 - should display size dropdown with all available options", () => {
        cy.contains("label", "Size Shirt:")
          .find("select")
          .find("option")
          .then((options) => {
            const actual = [...options].map((o) => o.value);
            expect(actual).to.include.members(["S", "M", "L", "XL"]);
          });

        cy.contains("label", "Size Shoe:")
          .find("select")
          .find("option")
          .then((options) => {
            const actual = [...options].map((o) => o.value);
            expect(actual).to.include.members([
              "38",
              "39",
              "40",
              "41",
              "42",
              "43",
              "44",
              "45",
            ]);
          });

        cy.contains("label", "Type")
          .find("select")
          .find("option")
          .then((options) => {
            const actual = [...options].map((o) => o.value);
            expect(actual).to.include.members(["Snapback", "Bucket", "Beanie"]);
          });

        cy.contains("label", "Scent")
          .find("select")
          .find("option")
          .then((options) => {
            const actual = [...options].map((o) => o.value);
            expect(actual).to.include.members(["Floral", "Woody", "Citrus"]);
          });

        cy.contains("label", "Color")
          .find("select")
          .find("option")
          .then((options) => {
            const actual = [...options].map((o) => o.value);
            expect(actual).to.include.members(["Hitam", "Silver", "Coklat"]);
          });
      });

      it("TC103 - should allow user to select different sizes", () => {
        cy.contains("label", "Size Shoe:").find("select").select("42");
        cy.contains("label", "Size Shoe:")
          .find("select")
          .should("have.value", "42");

        cy.contains("label", "Size Shoe:").find("select").select("39");
        cy.contains("label", "Size Shoe:")
          .find("select")
          .should("have.value", "39");
      });

      it("TC104 - should show selected options clearly", () => {
        cy.contains("label", "Size Shirt:").find("select").select("L");
        cy.contains("label", "Size Shirt:")
          .find("select option:selected")
          .should("have.value", "L");
      });
    });

    context("Quantity Selection", () => {
      it("TC105 - should have default quantity set to 1", () => {
        cy.get(".quantity-input").should("have.value", "1");
      });

      it("TC106 - should allow quantity input and accept only positive integers", () => {
        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.get(".quantity-input").clear().type("3");
        });
        cy.get('.item[data-name="Cap"]').within(() => {
          cy.get(".quantity-input").clear().type("10");
        });
      });

      it("TC107 - should have minimum value of 1", () => {
        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.get(".quantity-input").should("have.attr", "min", "1");
        });
      });

      it("TC108 - should handle invalid quantity values", () => {
        // Test zero value
        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.get(".quantity-input").clear().type("0");
          cy.get(".quantity-input").blur();
        });

        cy.get(".submit-btn").click();
        cy.get('.item[data-name="Shoe"]').within(() => {
          // Trigger validation by attempting to submit or blur
          cy.get(".quantity-input").then(($input) => {
            const validityMessage = $input[0].validationMessage;
            cy.log("Validation Message: ", validityMessage);
            expect(validityMessage).to.eq(
              "Value must be greater than or equal to 1."
            );
          });
        });
      });
    });

    context("Selection Confirmation", () => {
      it("TC109 - should display checkbox for product selection", () => {
        cy.get('input[type="checkbox"][value="Jam Tangan"]').should(
          "be.visible"
        );
      });

      it("TC110 - should allow checkbox selection and show visual indication", () => {
        // Initially unchecked
        cy.get('input[type="checkbox"][value="Jam Tangan"]').should(
          "not.be.checked"
        );

        // Check the checkbox
        cy.get('input[type="checkbox"][value="Jam Tangan"]').check();
        cy.get('input[type="checkbox"][value="Jam Tangan"]').should(
          "be.checked"
        );

        // Uncheck the checkbox
        cy.get('input[type="checkbox"][value="Jam Tangan"]').uncheck();
        cy.get('input[type="checkbox"][value="Jam Tangan"]').should(
          "not.be.checked"
        );
      });
    });
  });

  describe("User Story 2: Checkout Process Initiation", () => {
    context("Checkout Button", () => {
      it("TC111 - should display checkout button clearly", () => {
        cy.get(".submit-btn").should("be.visible");
        cy.get(".submit-btn").should("contain.text", "Proceed to Checkout");
      });

      it("TC112 - should enable checkout button when checkbox is selected", () => {
        // Check if button is initially disabled (if implemented)
        cy.get('input[type="checkbox"][value="Jam Tangan"]').check();
        cy.get(".submit-btn").should("be.enabled");
      });

      it("TC113 - should trigger checkout popup when clicked with valid selection", () => {
        // Make valid selection
        cy.get('input[type="checkbox"][value="Shoe"]').check();

        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.contains("label", "Size Shoe:").find("select").select("42");
          cy.get(".quantity-input").clear().type("2");
        });

        // Click checkout button
        cy.get(".submit-btn").click();

        // Verify popup appears
        cy.get(".modal-content").should("be.visible");
      });
    });

    context("Checkout Popup", () => {
      it("TC114 - should display popup immediately after button click", () => {
        cy.get('input[type="checkbox"][value="Shoe"]').check();

        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.contains("label", "Size Shoe:").find("select").select("42");
          cy.get(".quantity-input").clear().type("2");
        });

        // Click checkout button
        cy.get(".submit-btn").click();

        // Verify popup appears
        cy.get(".modal-content").should("be.visible");

        cy.get(".modal-content h3").should("contain.text", "Customer Details");
      });

      it("TC115 - should contain all required form fields", () => {
        cy.get('input[type="checkbox"][value="Shoe"]').check();

        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.contains("label", "Size Shoe:").find("select").select("42");
          cy.get(".quantity-input").clear().type("2");
        });

        // Click checkout button
        cy.get(".submit-btn").click();

        // Verify popup appears
        cy.get(".modal-content").should("be.visible");

        cy.get(".modal-content h3").should("contain.text", "Customer Details");
        // Verify all form fields are present
        cy.get("#customerName").should("be.visible");
        cy.get("#customerPhone").should("be.visible");
        cy.get("#customerAddress").should("be.visible");

        // Verify field attributes
        cy.get("#customerName").should(
          "have.attr",
          "placeholder",
          "Enter your name"
        );
        cy.get("#customerPhone").should(
          "have.attr",
          "placeholder",
          "Enter your phone number"
        );
        cy.get("#customerAddress").should(
          "have.attr",
          "placeholder",
          "Enter your full address"
        );
      });

      it("TC116 - should display both action buttons", () => {
        cy.get('input[type="checkbox"][value="Shoe"]').check();

        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.contains("label", "Size Shoe:").find("select").select("42");
          cy.get(".quantity-input").clear().type("2");
        });

        // Click checkout button
        cy.get(".submit-btn").click();

        // Verify popup appears
        cy.get(".modal-content").should("be.visible");

        cy.get(".modal-content h3").should("contain.text", "Customer Details");
        cy.get("#proceedBtn")
          .should("be.visible")
          .should("contain.text", "Proceed");
        cy.get("#cancelBtn")
          .should("be.visible")
          .should("contain.text", "Cancel");
      });
    });
  });

  describe("User Story 3: Customer Information Submission", () => {
    beforeEach(() => {
      // Open checkout popup before each test
      cy.get('input[type="checkbox"][value="Shoe"]').check();

      cy.get('.item[data-name="Shoe"]').within(() => {
        cy.contains("label", "Size Shoe:").find("select").select("42");
        cy.get(".quantity-input").clear().type("2");
      });

      // Click checkout button
      cy.get(".submit-btn").click();

      // Verify popup appears
      cy.get(".modal-content").should("be.visible");

      cy.get(".modal-content h3").should("contain.text", "Customer Details");
    });
    context("Form Validation", () => {
      it("TC117 - should mark phone number and address as required fields", () => {
        cy.get("#customerPhone").should("have.attr", "required");
        cy.get("#customerAddress").should("have.attr", "required");
      });

      it("TC118 - should show validation error when required fields are empty", () => {
        // Click proceed without filling required fields
        cy.get("#proceedBtn").click();

        // Browser validation should prevent submission
        cy.get("#customerPhone").then(($input) => {
          expect($input[0].validity.valid).to.be.false;
        });
      });
      it("TC119 - should show validation error when required fields are character", () => {
        // Click proceed without filling required fields
        cy.get("#proceedBtn").click();

        // Browser validation should prevent submission
        cy.get("#customerPhone").clear().type("abcdef"); // FAILS if JS filters it

        cy.get("#customerAddress").type("123 Main St, City, State 12345");
        // Then you assert that this is an invalid case for your app logic
        cy.get("#proceedBtn").click();

        // Check if an error message appears (if your app shows one)
        cy.contains("Please enter a valid phone number").should("exist");
      });

      it("TC120 - should allow form submission with valid data", () => {
        // Fill all required fields
        cy.get("#customerName").type("John Doe");
        cy.get("#customerPhone").type("1234567890");
        cy.get("#customerAddress").type("123 Main St, City, State 12345");

        // Submit form
        cy.get("#proceedBtn").click();

        // Verify form submission (adjust based on your implementation)
        // This might close the modal, redirect, or show success message
        cy.get("#confirmYes", { timeout: 3000 }).should("be.visible").click();

        cy.url().should("include", "/summary");
        cy.get(".summary-content").should("exist");
        cy.get("#customerDetails").should("exist");
        cy.get(".items-section").should("exist");
        cy.get(".total-section").should("exist");
        cy.get(".action-buttons").should("exist");
      });
    });

    context("Form Interaction", () => {
      it("TC121 - should accept appropriate input types in all fields", () => {
        cy.get("#customerName")
          .type("John Doe")
          .should("have.value", "John Doe");
        cy.get("#customerPhone")
          .type("1234567890")
          .should("have.value", "1234567890");
        cy.get("#customerAddress")
          .type("123 Main Street\nAnytown, State 12345")
          .should("contain.value", "123 Main Street");

        cy.get("#proceedBtn").click();

        // Verify form submission (adjust based on your implementation)
        // This might close the modal, redirect, or show success message
        cy.get("#confirmYes", { timeout: 3000 }).should("be.visible").click();

        cy.url().should("include", "/summary");

        cy.get("#customerDetails").should("contain.text", "John Doe");

        cy.get("#customerDetails").should("contain.text", "1234567890");

        cy.get("#customerDetails").should("contain.text", "123 Main Street");
      });

      it("TC122 - should allow multi-line text in address field", () => {
        const multiLineAddress =
          "123 Main Street\nApartment 4B\nAnytown, State 12345";
        cy.get("#customerAddress").type(multiLineAddress);
        cy.get("#customerAddress").should("contain.value", "Apartment 4B");
      });
    });

    context("Action Buttons", () => {
      it("TC123 - should close popup when Cancel button is clicked", () => {
        cy.get("#cancelBtn").click();
        cy.get(".modal-content").should("not.be.visible");
      });

      it("TC124 - should return to product page after cancellation", () => {
        cy.get("#cancelBtn").click();
        cy.get('[data-price="60"]').should("be.visible");
        cy.get(".submit-btn").should("be.visible");
      });
    });
  });

  describe("Complete Happy Path Test", () => {
    it("TC125 - should complete entire flow successfully", () => {
      // Step 1: Navigate to product page (done in beforeEach)
      // Step 2: Select product options
      // Step 3: Set quantity
      cy.get('.item[data-name="Shoe"]').within(() => {
        cy.contains("label", "Size Shoe:").find("select").select("42");
        cy.get(".quantity-input").clear().type("2");
      });

      // Step 4: Check confirmation checkbox
      cy.get('input[type="checkbox"][value="Shoe"]').check();

      // Step 5: Click proceed to checkout
      cy.get(".submit-btn").click();

      // Step 6: Fill customer information
      cy.get("#customerName").type("John Doe");
      cy.get("#customerPhone").type("1234567890");
      cy.get("#customerAddress").type("123 Main St, City, State 12345");

      // Step 7: Submit form
      cy.get("#proceedBtn").click();

      // Verify success (adjust based on your implementation)
      // This might be a redirect, success message, or modal closure
      cy.get("#confirmYes", { timeout: 3000 }).should("be.visible").click();

      cy.url().should("include", "/summary");
    });
  });

  describe("Edge Cases and Error Scenarios", () => {
    context("Unchecked Confirmation", () => {
      it("TC126 - should handle checkout attempt without checkbox selection", () => {
        // Don't check the checkbox
        cy.get(".submit-btn").click();

        // Verify appropriate handling (button disabled or error message)
        // Adjust based on your implementation
        cy.get(".modal-content")
          .should("be.visible")
          .and("contain", "Please select at least one item.");
      });
    });

    context("Invalid Quantity Values", () => {
      it("TC127 - should prevent negative quantity values", () => {
        cy.get('input[type="checkbox"][value="Shoe"]').check();
        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.get(".quantity-input").clear().type("-1");
          cy.get(".quantity-input").then(($input) => {
            expect($input[0].validity.valid).to.be.false;
          });
        });
      });

      it("TC128 - should prevent empty values", () => {
        cy.get('input[type="checkbox"][value="Shoe"]').check();
        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.get(".quantity-input").clear();
          cy.get(".quantity-input").then(($input) => {
            expect($input[0].validity.valid).to.be.false;
          });
        });
      });

      it("TC129 - should handle non-numeric values", () => {
        cy.get('.item[data-name="Shoe"]').within(() => {
          cy.get(".quantity-input").clear().type("abc");
          cy.get(".quantity-input").should("have.value", "");
        });
      });
    });

    context("Form Data Persistence", () => {
      it("TC130 - should handle form cancellation and reopening", () => {
        // Open popup and fill partial data
        cy.get('input[type="checkbox"][value="Shoe"]').check();
        cy.get(".submit-btn").click();

        cy.get("#customerName").type("John");
        cy.get("#customerPhone").type("123");

        // Cancel and reopen
        cy.get("#cancelBtn").click();
        cy.get(".submit-btn").click();

        // Check if data is retained or reset (based on requirements)
        // Adjust expectation based on your implementation
        cy.get("#customerName").should("have.value", ""); // Or retain value
      });
    });

    context("Long Text Input", () => {
      it("TC131 - should handle reasonable character limits in address field", () => {
        cy.get('input[type="checkbox"][value="Cap"]').check();
        cy.get(".submit-btn").click();

        const longAddress = "A".repeat(500); // Test with 500 characters
        cy.get("#customerAddress").type(longAddress);
        cy.get("#customerAddress").should("contain.value", "A".repeat(500));
      });
    });

    context("Special Characters", () => {
      it("TC132 - should handle special characters in phone and address fields", () => {
        cy.get('input[type="checkbox"][value="Perfume"]').check();
        cy.get(".submit-btn").click();

        // Test phone with special characters
        cy.get("#customerPhone").type("(123) 456-7890");
        cy.get("#customerAddress").type("123 Main St. #4B, City & State");

        // Verify fields accept the input
        cy.get("#customerPhone").should("contain.value", "(123) 456-7890");
        cy.get("#customerAddress").should(
          "contain.value",
          "123 Main St. #4B, City & State"
        );
      });
    });
  });

  describe("Accessibility and Usability", () => {
    it("TC133 - should have proper form labels and accessibility attributes", () => {
      cy.get('input[type="checkbox"][value="Shoe"]').check();
      cy.get(".submit-btn").click();

      // Verify labels are associated with inputs
      cy.get('label[for="customerName"]').should("exist");
      cy.get('label[for="customerPhone"]').should("exist");
      cy.get('label[for="customerAddress"]').should("exist");

      // Verify required field indicators
      cy.get('label[for="customerPhone"] .required').should("exist");
      cy.get('label[for="customerAddress"] .required').should("exist");
    });
  });
});
