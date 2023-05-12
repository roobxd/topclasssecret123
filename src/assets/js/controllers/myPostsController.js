/**
 * Controller voor Verhalen Pagina
 */
import { Controller } from "./controller.js"

export class myPostsController extends Controller {
    #myPostsView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#myPostsView = await super.loadHtmlIntoContent("html_views/myposts.html")

        console.log(this.#myPostsView);
    }
}