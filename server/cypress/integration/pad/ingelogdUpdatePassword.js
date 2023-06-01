describe("IngelogdUpdatePassword", () => {
    const endpoint = "/updateUser";

    // Run before each test in this context
    beforeEach(() => {
        // Go to the specified URL or perform necessary login steps
        // cy.visit("http://localhost:8080");
        cy.visit("http://localhost:8080/")

        cy.get(".login").should("exist");
        cy.get(".login").click();


        cy.get("#email").should("exist");
        cy.get("#password").should("exist");
        cy.get(".submitbutton").should("exist");


        cy.get("#email").type("kkarroch@gmail.com");
        cy.get("#password").type("Newpassword12#");
        cy.get(".submitbutton").click();

        cy.visit("http://localhost:8080/#beveiliging")

        // cy.get(".account").should("exist");
        // cy.get(".account").click();

        // cy.get("#settings").should("exist");
        // cy.get("#settings").click();
        // ...
    });

    // // Test: Validate update password form
    it("Valid update password form", () => {
        expect(true).to.equal(true);
        //     // Find the field for the new password, check if it exists
        cy.get("#new-password").should("exist");
        cy.get("#confirm-password").should("exist");
        cy.get(".submitbutton").should("exist");
    });

    // Test: Successful password update
    it("Successful password update", () => {

        // Start a fake server
        cy.server();
        cy.wait(1000);
        cy.visit("http://localhost:8080/#beveiliging")
        const mockedResponse = {success: true};

        cy.intercept("POST", "/updateUser", {
            statusCode: 200,
            body: mockedResponse,
        }).as("updatePassword");


        // Find the field for the new password and type the new password
        cy.get("#new-password").should("exist");
        cy.get("#confirm-password").should("exist");
        cy.get(".submitbutton").should("exist");


        cy.get("#new-password").type("New-password12!");
        cy.get("#confirm-password").type("New-password12!");
        cy.get(".submitbutton").click()


        // Wait for the @updatePassword stub to be called by the click event
            cy.wait("@updatePassword");


        // Add a stub with the URL /users/update-password as a POST
        // Respond with a JSON-object when requested
        // Give the stub the alias: @updatePassword

        // The @updatePassword stub is called, check the contents of the incoming request
        cy.get("@updatePassword").should((xhr) => {
            // The new password should match what we typed earlier
            expect(xhr.request.body.password).equals("New-password12!");
        });

        // After a successful password update, make assertions based on the redirected URL or updated page content
        // For example, you can check if a success message is displayed
        // cy.get(".success-message").should("exist");
    });

    // Test: Failed password update
    it("Failed password update", () => {
        // cy.server();
        cy.wait(1000);
        cy.visit("http://localhost:8080/#beveiliging")

        // const mockedResponse = {
        //     success: false,
        //     error: "Password update failed",
        // };

        // cy.intercept("POST", "/updateUser", {
        //     statusCode: 400,
        //     body: mockedResponse,
        // }).as("updatePassword");

        cy.get("#new-password").type("Newpassword12#");
        cy.get("#confirm-password").type("OtherPassword123")
        cy.get(".submitbutton").click();


        cy.wait(1000);
        cy.get(".error").should("not.be.empty")

    })
});
