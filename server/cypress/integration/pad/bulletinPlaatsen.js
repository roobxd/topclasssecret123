describe('Bulletin', () => {
    const endpoint = "/bulletin";

    beforeEach(() => {
        cy.visit("http://localhost:8080/#welcome");
    });

    it('Kan inloggen zodat de gebruiker een bulletin kan plaatsen', () => {
        cy.get(".login").should("exist");
        cy.get(".login").click();

        cy.get("#email").should("exist");
        cy.get("#password").should("exist");
        cy.get(".submitbutton").should("exist");

        cy.get("#email").type("sumeyra.dogan@hva.nl");
        cy.get("#password").type("Test1!");
        cy.get(".submitbutton").click();

        cy.visit("http://localhost:8080/#welcome")
    });

    it('Gebruiker is ingelogd en kan naar de bulletin pagina', () => {
        cy.get(".login").should("exist");
        cy.get(".login").click();

        cy.get("#email").should("exist");
        cy.get("#password").should("exist");
        cy.get(".submitbutton").should("exist");

        cy.get("#email").type("sumeyra.dogan@hva.nl");
        cy.get("#password").type("Test1!");
        cy.get(".submitbutton").click();

        cy.visit("http://localhost:8080/#welcome")

        cy.get(".bulletin").should("exist");
        cy.get(".bulletin").click();

    });

    it('Gebruiker is op de bulletin pagina en plaats een bulletin', () => {
        cy.get(".login").should("exist");
        cy.get(".login").click();

        cy.get("#email").should("exist");
        cy.get("#password").should("exist");
        cy.get(".submitbutton").should("exist");

        cy.get("#email").type("sumeyra.dogan@hva.nl");
        cy.get("#password").type("Test1!");
        cy.get(".submitbutton").click();

        cy.visit("http://localhost:8080/#welcome")

        cy.get(".bulletin").should("exist");
        cy.get(".bulletin").click();

        cy.get('.titleinput').should("exist");
        cy.get('.verhaal').should("exist");
        cy.get('.submitbutton').should("exist");

        cy.get('.titleinput').type('Test bulletin');
        cy.get('.verhaal').type('Test');
        cy.get('.submitbutton').click();

    });

});
