/**
 * Controller responsible for all events in Account settings
 * @author Aaron Agyeman-Prempeh
 */
import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UsersRepository } from "../repositories/usersRepository.js";

export class SocialMediaController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #socialMediaView;

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
        this.#socialMediaView = await super.loadHtmlIntoContent("html_views/socialMedia.html");

        // Attach event listeners for navigation links
        this.#socialMediaView.querySelector(".algemeen").addEventListener("click", (event) => {
            window.location.href = "#accountSettings";
        });
        this.#socialMediaView.querySelector(".instantie").addEventListener("click", (event) => {
            window.location.href = "#instantie";
        });
        this.#socialMediaView.querySelector(".beveiliging").addEventListener("click", (event) => {
            window.location.href = "#beveiliging";
        });
        this.#socialMediaView.querySelector(".socialMedia").addEventListener("click", (event) => {
            window.location.href = "#socialMedia";
        });

        // Attach event listeners for edit buttons
        this.#socialMediaView.querySelector(".edit-button1").addEventListener("click", (event) => {
            this.#handleSocials(event);
        });
        this.#socialMediaView.querySelector(".edit-button2").addEventListener("click", (event) => {
            this.#handleSocials(event);
        });
        this.#socialMediaView.querySelector(".edit-button3").addEventListener("click", (event) => {
            this.#handleSocials(event);
        });
    }

    /**
     * Handle the social media update event
     * @param {Event} event - The event object
     * @private
     */
    #handleSocials(event) {
        event.preventDefault();

        const newInstagram = this.#socialMediaView.querySelector("#instagramUser").value;
        const newTiktok = this.#socialMediaView.querySelector("#tiktokUser").value;
        const newFacebook = this.#socialMediaView.querySelector("#facebookUser").value;
        const currentId = App.sessionManager.get("id");

        this.#accountSettingsRepository
            .updateSocials(currentId, newInstagram, newTiktok, newFacebook)
            .then(() => {
                this.#socialMediaView.querySelector(".socials-update-message").textContent = "Socials updated successfully!";
                App.sessionManager.set("instagram", newInstagram);
                App.sessionManager.set("achternaam", newTiktok);
                App.sessionManager.set("tussenvoegsel", newFacebook);
                App.sessionManager.set("id", currentId);
            })
            .catch(error => {
                console.error("Error updating socials:", error);
                this.#socialMediaView.querySelector(".socials-update-message").textContent = "Error updating socials: " + error.message;
            });
    }
}
