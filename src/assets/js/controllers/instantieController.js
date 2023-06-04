/**
 * Controller responsible for all events in Account settings
 * @author Aaron Agyeman-Prempeh
 */
import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UsersRepository } from "../repositories/usersRepository.js";

export class InstantieController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #instantieView;

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();

        this.#setupView();
    }

    /**
     * Set up the view and attach event listeners
     * @private
     */
    async #setupView() {
        // this.#accountSettingsView = await super.loadHtmlIntoContent("html_views/accountSettings.html");
        this.#instantieView = await super.loadHtmlIntoContent("html_views/instantie.html");

        // Attach event listeners for navigation links
        this.#instantieView.querySelector(".algemeen").addEventListener("click", (event) => {
            window.location.href = "#accountSettings";
        });
        this.#instantieView.querySelector(".instantie").addEventListener("click", (event) => {
            window.location.href = "#instantie";
        });
        this.#instantieView.querySelector(".beveiliging").addEventListener("click", (event) => {
            window.location.href = "#beveiliging";
        });
        this.#instantieView.querySelector(".socialMedia").addEventListener("click", (event) => {
            window.location.href = "#socialMedia";
        });

        // Attach event listener for the confirmIdentity button
        this.#instantieView.querySelector("#confirmIdentity").addEventListener("click", (event) => this.#handleIdentityUpdate(event));
    }

    /**
     * Handle the identity update event
     * @param {Event} event - The event object
     * @private
     */
    #handleIdentityUpdate(event) {
        event.preventDefault();

        const identity = this.#instantieView.querySelector("#identiteit").value;
        const userId = App.sessionManager.get("id");
        console.log("Retrieved userId from sessionManager:", userId);

        this.#accountSettingsRepository
            .updateIdentity(userId, identity)
            .then(() => {
                this.#instantieView.querySelector(".identity-update-message").textContent = "Identity updated successfully!";
            })
            .catch(error => {
                console.error("Error updating identity:", error);
                this.#instantieView.querySelector(".identity-update-message").textContent = "Error updating identity: " + error.message;
            });
    }
}
