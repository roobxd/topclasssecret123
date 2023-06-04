/**
 * Cypress test for editing account settings
 * @author: Aaron Agyeman-Prempeh
 */
describe("AccountSettingsController", () => {

    // The beforeEach block runs before each test in the suite.
    // This block logs the user in before running each test.
    beforeEach(() => {
        // Navigate to the account settings edit page
        cy.visit("http://localhost:8080/#accountSettingsBewerken");

        // Find and click on the login button
        cy.get(".login").should("exist");
        cy.get(".login").click();

        // Fill in the login form and submit it
        cy.get("#email").should("exist").type("gabriel@hva.nl");
        cy.get("#password").should("exist").type("Gabriel@1");
        cy.get(".submitbutton").should("exist").click();

        // If the URL does not include '#accountSettingsBewerken', navigate back to the account settings edit page
        cy.url().then((url) => {
            if (!url.includes('#accountSettingsBewerken')) {
                cy.visit("http://localhost:8080/#accountSettingsBewerken");
            }
        });
    });

    // Test that after login, the URL includes '#accountSettingsBewerken'
    it("Test navigation to accountSettingsBewerken after login", () => {
        cy.url().should('include', '#accountSettingsBewerken');
    });

    // Test that the necessary elements for updating names exist on the page
    it("Valid update names forms", () => {
        // Test that the fields for updating names exist
        cy.get("#voornaam").should("exist");
        cy.get("#tussenvoegsel").should("exist");
        cy.get("#achternaam").should("exist");
        cy.get("#editName").should("exist");
    });


    // Test that the account updates are loaded successfully on the account settings page
    it("Account updates loaded successfully", () => {
        // Navigate to the account settings page
        cy.visit("http://localhost:8080/#accountSettings");

        // Test that the updated name and email are displayed correctly
        cy.get("#name").should('contain', 'TestVoornaam TestTussenvoegsel TestAchternaam');
        cy.get(".currentEmail").should('contain', 'gabriel@hva.nl');
    });

    // Test a failed account update
    it("Failed account update", () => {
        // Set up a server and intercept the updateUser request with a mocked response
        cy.server();
        const mockedResponse = {success: false};
        cy.intercept("POST", "/updateUser", {
            statusCode: 400,
            body: mockedResponse,
        }).as("updateAccount");

        // Test the interaction with the form for updating names
        // Use invoke to clear the input fields should en .type("") wouldn't work because "type" can't be empty
        cy.get('#voornaam').invoke('val', '');
        cy.get('#tussenvoegsel').invoke('val', '');
        cy.get('#achternaam').invoke('val', '');
        cy.get('#editName').should('be.visible').click();

        // Test the interaction with the form for updating email
        cy.get('#email').invoke('val', '');
        cy.get('#editEmail').should('be.visible').click();

    });

    // Test a successful account update
    it("Successful account update", () => {
        // Set up a server and intercept the updateUser request with a mocked response
        cy.server();
        const mockedResponse = {success: true};
        cy.intercept("POST", "/updateUser", {
            statusCode: 200,
            body: mockedResponse,
        }).as("updateAccount");

        // Test the interaction with the form for updating names
        cy.get('#voornaam').should('be.visible').type('TestVoornaam');
        cy.get('#tussenvoegsel').should('be.visible').type('TestTussenvoegsel');
        cy.get('#achternaam').should('be.visible').type('TestAchternaam');
        cy.get('#editName').should('be.visible').click();

        // Test the interaction with the form for updating email
        cy.get('#email').should('be.visible').type('gabriel@hva.nl');
        cy.get('#editEmail').should('be.visible').click();

    });
});

