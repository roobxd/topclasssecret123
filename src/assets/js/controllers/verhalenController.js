/**
 * Controller voor Verhalen Pagina
 */
import {Controller} from "./controller.js"

export class VerhalenController extends Controller {
    #verhalenView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#verhalenView = await super.loadHtmlIntoContent("html_views/verhalen.html")

        console.log(this.#verhalenView);
    }
}