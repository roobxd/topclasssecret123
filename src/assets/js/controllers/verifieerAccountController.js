import {Controller} from "./controller.js"
import {VerificatieRepository} from "../repositories/verificatieRepository.js";
import {App} from "../app.js";
import {SendMailRepository} from "../repositories/sendMailRepository.js";


export class VerifieerAccountController extends Controller {
    #verifierView;
    #verificatieRepository;
    #sendMailRepository;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {

        this.#verifierView = await super.loadHtmlIntoContent("html_views/verification.html")
        this.#verificatieRepository = new VerificatieRepository();
        this.#sendMailRepository = new SendMailRepository();

        const mail = App.sessionManager.get("email")


        this.#verifierView.querySelector("#checkCode").addEventListener("click", this.#verifieren)

    }


    #verifieren = async () => {
        const mail = App.sessionManager.get("email");
        console.log(mail)
        const inputCode = document.querySelector("#inputCode").value

        await this.#verificatieRepository.verifier(mail, inputCode);

        const data = await this.#verificatieRepository.verifierResult(mail);
        console.log(mail)
        console.log(data[0].verificatie)
        console.log(data)


        if(data[0].verificatie === 1){
           App.loadController(App.CONTROLLER_WELCOME);
            alert("Gelukt")
        } else if (data[0].verificatie === 0) {
            alert("verkeerde code! check opnieuw")
        }



    }

}