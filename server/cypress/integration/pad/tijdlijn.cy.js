// tijdlijn
describe("tijdlijn", () => {
    const endpoint = "/#welcome";

    beforeEach(() => {
        cy.visit("http://localhost:8080");
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



// // Test if welcome page components exist
    it('should have welcome page components', () => {
        cy.get('.main-wrapper').should('exist');
        cy.get('.story-container-welcome').should('exist');
        cy.get('.filler').should('exist');
        cy.get('.bulletinboard').should('exist');
        cy.get('.timelineWelcome').should('exist');
    });


    // test if components exits
    it('should test if components exits', function () {

        cy.get(".timelineContext").should("exist");
        cy.get("#beginDatum").should("exist");
        cy.get("#eindDatum").should("exist");
        cy.get(".bekijken").should("exist");

    });

    // Test to display error message when date values are not filled
    it('should display error message when date values are not filled', function () {

        // Wait for 1 second
        cy.wait(1000);

        // Click on home button and then bekijken button
        cy.get(".bekijken").click();

        // Check if the timelineContext has red color and the correct error message is displayed
        cy.get(".timelineContext")
            .should('have.css', 'color')
            .and('equal', 'rgb(255, 0, 0)');

        cy.get(".timelineContext")
            .should('have.text', 'Begin en eind datum moeten allebei ingevuld worden!');


        // Wait for 1 second
        cy.wait(5000);
    });

    // Test to display error message when begin date is after end date
    it('should display error message when begin date is after end date', function () {



        const beginDate = '2023-06-01';
        const endDate = '2023-05-31';

        // Enter the begin date and end date
        cy.get("#beginDatum").clear().type(beginDate);
        cy.get("#eindDatum").clear().type(endDate);

        // Click on bekijken button
        cy.get(".bekijken").click();

        // Check if the timelineContext has yellow color and the correct error message is displayed
        cy.get(".timelineContext")
            .should('have.css', 'color', 'rgb(255, 255, 0)')
            .should('have.text', 'Begin datum kan niet na eind datum liggen!');

        // Wait for 5 second
        cy.wait(5000);
    });

    // Test to verify date values and URL
    it('should have date values and change URL', function () {
        const beginDate = '2020-01-01';
        const endDate = new Date().toISOString().split('T')[0];

        // Start a fake server
        cy.server();

        // Load the fixture data from tijdlijn.json
        cy.fixture('tijdlijn.json').then((tijdlijnData) => {
            // Add a stub with the URL /tijdlijn/${beginDate}/${endDate} as a GET
            // Respond with the fixture data when requested
            // Give the stub the alias: @tijdlijn
            cy.intercept('GET', `/tijdlijn/${beginDate}/${endDate}`, tijdlijnData).as('tijdlijn');
        });

        // Enter the begin date and end date
        cy.get("#beginDatum").clear().type(beginDate);
        cy.get("#eindDatum").clear().type(endDate);

        // Check if the entered date values are correct
        cy.get("#beginDatum").should('have.value', beginDate);
        cy.get("#eindDatum").should('have.value', endDate);

        // Click on bekijken knop
        cy.get(".bekijken").click();

        // Check if the URL is as expected after clicking on bekijken button
        cy.url().should("eq", `http://localhost:8080/#tijdlijn/${beginDate}/${endDate}`);

        // Wait for 10 seconds to allow the timeline animation to complete
        cy.wait(10000);
    });

});
