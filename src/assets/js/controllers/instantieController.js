/**
 *
 * Controller repsonsible for all events in Account settings
 */
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {UsersRepository} from "../repositories/usersRepository.js";

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

    async #setupView() {
        // this.#accountSettingsView = await super.loadHtmlIntoContent("html_views/accountSettings.html");
        this.#instantieView = await super.loadHtmlIntoContent("html_views/instantie.html");

        this.#instantieView.querySelector(".algemeen").addEventListener("click", event => {
            window.location.href = "#accountSettings";
        });
        this.#instantieView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "#instantie";
        });
        this.#instantieView.querySelector(".beveiliging").addEventListener("click", event => {
            window.location.href = "#beveiliging";
        });
        this.#instantieView.querySelector(".socialMedia").addEventListener("click", event => {
            window.location.href = "#socialMedia";
        });
        this.#instantieView.querySelector(".bulletinGedrag").addEventListener("click", event => {
            window.location.href = "#bulletinGedrag";
        });


        this.#instantieView.querySelector("#confirmIdentity").addEventListener("click", event => this.#handleIdentityUpdate(event));

    }


    #handleIdentityUpdate(event) {
        event.preventDefault();

        const identity = this.#instantieView.querySelector("#identiteit").value;
        const userId = App.sessionManager.get("userId");
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
