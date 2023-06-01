/**
 *
 * Controller repsonsible for all events in Account settings
 */
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {UsersRepository} from "../repositories/usersRepository.js";

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

    async #setupView() {
        this.#socialMediaView = await super.loadHtmlIntoContent("html_views/socialMedia.html");
        this.#socialMediaView.querySelector(".algemeen").addEventListener("click", event => {
            window.location.href = "#accountSettings";
        });

        this.#socialMediaView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "#instantie";
        });
        this.#socialMediaView.querySelector(".beveiliging").addEventListener("click", event => {
            window.location.href = "#beveiliging";
        });
        this.#socialMediaView.querySelector(".socialMedia").addEventListener("click", event => {
            window.location.href = "#socialMedia";
        });
        // this.#socialMediaView.querySelector(".bulletinGedrag").addEventListener("click", event => {
        //     window.location.href = "#bulletinGedrag";
        // });

        this.#socialMediaView.querySelector(".edit-button1").addEventListener("click", event => {
            this.#handleSocials(event);
        });
        this.#socialMediaView.querySelector(".edit-button2").addEventListener("click", event => {
            this.#handleSocials(event);
        });
        this.#socialMediaView.querySelector(".edit-button3").addEventListener("click", event => {
            this.#handleSocials(event);
        });


    }


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
                // this.#accountSettingsBewerkenView.querySelector("#currentEmail").textContent = newEmail;
                // App.sessionManager.set("email", newEmail);
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
