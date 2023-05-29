/**
 *
 * Controller repsonsible for all events in Account settings
 */
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {UsersRepository} from "../repositories/usersRepository.js";

export class BulletinGedragController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #bulletinGedragView;


    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();

        this.#setupView();

    }

    async #setupView() {
        this.#bulletinGedragView = await super.loadHtmlIntoContent("html_views/bulletinGedrag.html");

        this.#bulletinGedragView.querySelector(".algemeen").addEventListener("click", event => {
            window.location.href = "#accountSettings";
        });
        this.#bulletinGedragView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "#instantie";
        });
        this.#bulletinGedragView.querySelector(".beveiliging").addEventListener("click", event => {
            window.location.href = "#beveiliging";
        });
        this.#bulletinGedragView.querySelector(".socialMedia").addEventListener("click", event => {
            window.location.href = "#socialMedia";
        });
        this.#bulletinGedragView.querySelector(".bulletinGedrag").addEventListener("click", event => {
            window.location.href = "#bulletinGedrag";
        });


    }



}
