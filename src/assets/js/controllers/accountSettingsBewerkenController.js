
import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UsersRepository } from "../repositories/usersRepository.js";
/**
 * Controller responsible for all events in Account Settings Edit view
 * @extends {Controller}
 * @author Aaron
 */
export class AccountSettingsBewerkenController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #accountSettingsBewerkenView;


    /**
     * Constructs an AccountSettingsBewerkenController instance, initializes repositories,
     * and sets up the view.
     */
    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();

        this.#setupView();
    }

    /**
     * Sets up the view by loading HTML, attaching event listeners.
     * @private
     * @async
     */
    async #setupView() {
        this.#accountSettingsBewerkenView = await super.loadHtmlIntoContent(
            "html_views/accountSettingsBewerken.html"
        );

        // Attach event listeners for navigation links
        this.#accountSettingsBewerkenView
            .querySelector(".algemeen")
            .addEventListener("click", (event) => {
                window.location.href = "#accountSettings";
            });
        this.#accountSettingsBewerkenView
            .querySelector(".instantie")
            .addEventListener("click", (event) => {
                window.location.href = "#instantie";
            });
        this.#accountSettingsBewerkenView
            .querySelector(".beveiliging")
            .addEventListener("click", (event) => {
                window.location.href = "#beveiliging";
            });
        this.#accountSettingsBewerkenView
            .querySelector(".socialMedia")
            .addEventListener("click", (event) => {
                window.location.href = "#socialMedia";
            });

        // Attach event listeners for form interactions
        this.#accountSettingsBewerkenView
            .querySelector("#editEmail")
            .addEventListener("click", (event) => this.#handleEmailUpdate(event));
        this.#accountSettingsBewerkenView
            .querySelector("#editName")
            .addEventListener("click", (event) => this.#handleNameUpdate(event));

        // Log the current user's ID
        console.log(App.sessionManager.get("userId"));
    }

    /**
     * Handles the update of the user's name.
     * Updates the user's name in the repository and session, and provides feedback in the view.
     * @param {Event} event - The DOM event triggered by the form submission.
     * @private
     */
    #handleNameUpdate(event) {
        event.preventDefault();

        const newVoornaam = this.#accountSettingsBewerkenView.querySelector(
            "#voornaam"
        ).value;
        const newTussenvoegsel = this.#accountSettingsBewerkenView.querySelector(
            "#tussenvoegsel"
        ).value;
        const newAchternaam = this.#accountSettingsBewerkenView.querySelector(
            "#achternaam"
        ).value;
        const currentId = App.sessionManager.get("id");
        const currentName = App.sessionManager.get("voornaam", "achternaam");

        this.#accountSettingsRepository
            .updateNaam(currentId, newVoornaam, newAchternaam, newTussenvoegsel)
            .then(() => {
                this.#accountSettingsBewerkenView.querySelector(
                    ".naam-update-message"
                ).textContent = "Naam succesvol veranderd!";
                App.sessionManager.set("voornaam", newVoornaam);
                App.sessionManager.set("achternaam", newAchternaam);
                App.sessionManager.set("tussenvoegsel", newTussenvoegsel);
                App.sessionManager.set("id", currentId);
            })
            .catch((error) => {
                console.error("Error updating name:", error);
                this.#accountSettingsBewerkenView.querySelector(
                    ".naam-update-message"
                ).textContent = "Error updating name: " + error.message;
            });
    }
    /**
     * Handles the update of the user's email.
     * Updates the user's email in the repository and session, and provides feedback in the view.
     * @param {Event} event - The DOM event triggered by the form submission.
     * @private
     */
    #handleEmailUpdate(event) {
        event.preventDefault();

        const newEmail = this.#accountSettingsBewerkenView.querySelector(
            "#email"
        ).value;
        const currentEmail = App.sessionManager.get("email");

        this.#accountSettingsRepository
            .updateEmail(currentEmail, newEmail)
            .then(() => {
                this.#accountSettingsBewerkenView.querySelector(
                    ".email-update-message"
                ).textContent = "Email updated successfully!";
                App.sessionManager.set("email", newEmail);
            })
            .catch((error) => {
                console.error("Error updating email:", error);
                this.#accountSettingsBewerkenView.querySelector(
                    ".email-update-message"
                ).textContent = "Error updating email: " + error.message;
            });
    }
}
