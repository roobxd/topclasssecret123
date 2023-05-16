import {Controller} from "./controller.js"
import {VerificatieRepository} from "../repositories/verificatieRepository.js";
import {App} from "../app.js";


export class VerifieerAccountController extends Controller {
    #verifierView;
    #verificatieRepository;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {

        this.#verifierView = await super.loadHtmlIntoContent("html_views/verification.html")
        this.#verificatieRepository = new VerificatieRepository();

        const mail = App.sessionManager.get("email")

        this.#verifierView.querySelector("#verifierAccount").addEventListener("click", () =>
            this.#verificatieRepository.verifier(mail))

             console.log("testest")
    }

    #verifieren(){
        // const mail = App.sessionManager.get("email");
        // this.#verificatieRepository.verifier(mail)
        // console.log("testest")


    }
}