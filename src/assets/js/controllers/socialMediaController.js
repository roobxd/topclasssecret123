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
        this.#socialMediaView.querySelector(".bulletinGedrag").addEventListener("click", event => {
            window.location.href = "#bulletinGedrag";
        });
        this.#socialMediaView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "html_views/instantie.html";
        });

    }


}
