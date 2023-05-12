/**
 * Controller voor Verhalen Pagina
 */
import { Controller } from "./controller.js"

export class readController extends Controller {
    #readView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#readView = await super.loadHtmlIntoContent("html_views/read.html")

        console.log(this.#readView);
    }
}