//Context: Login
describe("Login", () => {
    const endpoint = "/users/login";

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#login");
    });

    //Test: Validate login form
    it("Valid login form", () => {
        //Find the field for the username, check if it exists.
        cy.get("#email").should("exist");

        //Find the field for the password, check if it exists.
        cy.get("#password").should("exist");

        //Find the button to login, check if it exists.
        cy.get(".submitbutton").should("exist");
    });

    //Test: Failed login
    it("Failed login", () => {
        //Start a fake server
        cy.server();


        const mockedResponse = {
            reason: "ERROR"
        };

        //Add a stub with the URL /users/login as a POST
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @login
        cy.intercept('POST', '/users/login', {
            statusCode: 401,
            body: mockedResponse,
        }).as('login');


        //Find the field for the username and type the text "test".
        cy.get("#email").type("test");

        //Find the field for the password and type the text "test".
        cy.get("#password").type("test");

        //Find the button to login and click it.
        cy.get(".submitbutton").click();

        //Wait for the @login-stub to be called by the click-event.
        cy.wait("@login");

        //After a failed login, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR");
    });


    it('should login successfully', () => {
        cy.get(".login").should("exist");
        cy.get(".login").click();

        cy.wait(5000);

        // Start a fake server
        cy.server();

        // Load the fixture data from login.json
        cy.fixture('login.json').then((loginData) => {
            // Add a stub with the URL /users/login as a POST
            // Respond with the fixture data when requested
            // Give the stub the alias: @login
            cy.intercept('POST', '/users/login', loginData).as('login');
        });

        // Find the field for the username and type the text "test".
        cy.get("#email").type("kiflemisgun15@gmail.com");

        // Find the field for the password and type the text "test".
        cy.get("#password").type("Test15@k");

        // Find the button to login and click it
        cy.get(".submitbutton").click();

        // Wait for the @login-stub to be called by the click-event.
        cy.wait("@login");

        // The @login-stub is called, check the contents of the incoming request.
        cy.get("@login").should((xhr) => {
            // The username should match what we typed earlier
            const body = xhr.request.body;
            expect(body.email).equals("kiflemisgun15@gmail.com");

            // The password should match what we typed earlier
            expect(body.password).equals("Test15@k");
        });


        // Check if the URL is as expected after successful login
        cy.url().should('eq', 'http://localhost:8080/#welcome');
    });

});