// tijdlijn
describe("tijdlijn", () => {
    const endpoint = "/#welcome";

    beforeEach(() => {
        cy.visit("http://localhost:8080");
    });

    // Test to log in successfully
    it('should login successfully', function () {
        // Click on login button
        cy.get(".login").should("exist");
        cy.get(".login").click();

        // Check the existence of email, password, and submit button
        cy.get("#email").should("exist");
        cy.get("#password").should("exist");
        cy.get(".submitbutton").should("exist");

        // Enter email and password
        cy.get("#email").type("kiflemisgun15@gmail.com");
        cy.get("#password").type("Test15@k");
        cy.get(".submitbutton").click();

        // Check if the URL is as expected after successful login
        cy.url().should('eq', 'http://localhost:8080/#welcome');
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
            .should('have.text', 'Begin en eind datum moet allebei ingevuld worden!');

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
