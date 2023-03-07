/**
 *
 * controller for sign in screen
 */
import {Controller} from "./controller.js";

export class signInController extends Controller {
    #createSingInView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#createSingInView = await super.loadHtmlIntoContent("html_views/signIn.html");


       
        console.log(this.#createSingInView)
    }
}