
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class FooterController extends Controller{
    #app;
    #footerView;

    constructor(app) {
        super();
        this.#app = app;

        this.#initializeView();
    }

    async #initializeView(){
        this.#footerView = await  super.loadHtmlIntoNavigation("html_views/footer.html");
        console.log(this.#footerView)

    }

}
