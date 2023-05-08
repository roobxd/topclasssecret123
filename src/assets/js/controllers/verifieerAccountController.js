import {Controller} from "./controller.js"

export class VerifieerAccountController extends Controller {
    #verifierView;
    #verificatieRepository;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#verifierView = await super.loadHtmlIntoContent("html_views/verification.html")

        // this.#verifierView.querySelector("#verifierAccount").addEventListener("click", () =>
        // this.#verificatieRepository.verifier(mail))
    }
}