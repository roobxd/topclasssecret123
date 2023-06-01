/**
 *
 * Controller responsible for all events in Account settings view
 */
import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UsersRepository } from "../repositories/usersRepository.js";

export class AccountSettingsBewerkenController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #accountSettingsBewerkenView;

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();

        this.#setupView();
    }

    // Set up the view and attach event listeners
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

    // Handle the update of the user's name
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

    // Handle the update of the user's email
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
