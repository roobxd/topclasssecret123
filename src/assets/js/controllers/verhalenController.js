/**
 * Controller voor Verhalen Pagina
 */
import { Controller } from "./controller.js"
import { App } from "../app.js";

export class VerhalenController extends Controller {
    #verhalenView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#verhalenView = await super.loadHtmlIntoContent("html_views/verhalen.html")
        this.#verhalenView.querySelector(".story").addEventListener("click", event => App.loadController(App.CONTROLLER_READ));

        console.log(this.#verhalenView);
    }
}