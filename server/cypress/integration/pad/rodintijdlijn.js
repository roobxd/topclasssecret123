// tijdlijn
describe("Tijdlijn", () => {
    const endpoint = "/#welcome";

    beforeEach(() => {
        cy.visit("http://localhost:8080/#tijdlijn");
        cy.on("uncaught:exception", (err, runnable) => {
            return false;
        })
    });

    //Test of tijdlijn klikbaar is
    it('Valideert of button bestaat', () => {
        cy.get("#new-time-line-from-rodin").should("exist");
        });

    //Klikt op nieuwe timeline button
    it('Presses button to go to new timeline', () => {
        cy.get("#new-time-line-from-rodin").click();
    });
});






