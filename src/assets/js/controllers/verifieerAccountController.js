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

        this.#verifierView.querySelector("#checkCode").addEventListener("click", this.#verifieren)
        this.#verifierView.querySelector("#resendCode").addEventListener("click", this.#resendCode)

    }


    #verifieren = async () => {

        const mail = App.sessionManager.get("email");
        const inputCode = document.querySelector("#inputCode").value
        const dataBefore = await this.#verificatieRepository.verifierResult(mail);
        console.log(dataBefore[0].OTP)
        await this.#verificatieRepository.verifier(mail, inputCode);


        // const data = await this.#verificatieRepository.verifierResult(mail);
        // console.log(mail)
        // console.log(data[0].verificatie)
        // console.log(data)


        console.log("inputcode: " + inputCode.trim())
        console.log( "data otp before:  "+ dataBefore[0].OTP)
        console.log(dataBefore)

        if (dataBefore[0].OTP == inputCode.trim()) {
            App.loadController(App.CONTROLLER_WELCOME);
            alert("Gelukt")
        } else if (dataBefore[0].OTP != inputCode) {
            alert("verkeerde code! check je mail")
        }


    }

    #resendCode = async () => {
        const mail = App.sessionManager.get("email");

        this.#sendMailRepository.sendVerificationMail(mail)
        alert("Mail is verzonden!")

    }

}