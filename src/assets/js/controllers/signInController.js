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

    #setupView() {
        this.#createSingInView = super.loadHtmlIntoContent("html_views/signIn.html");

    }
}