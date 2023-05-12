import {Controller} from "./controller.js";
import {loadAllUsersRepository} from "../repositories/loadAllUsersRepository.js";
import {App} from "../app.js";
import {SendMailRepository} from "../repositories/sendMailRepository.js";


export class PasswordUpdateMailController extends Controller {
    #MailUpdatePasswordView
    #loadAllUsersRepository
    #sendMailRepository


    constructor() {
        super();

        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#sendMailRepository = new SendMailRepository();
        this.#setupView()
    }


    async #setupView() {
        this.#MailUpdatePasswordView = await super.loadHtmlIntoContent("html_views/passwordUpdateMail.html")
        this.#MailUpdatePasswordView.querySelector("#submitmailcheck").addEventListener("click", (event) => this.#checkMail(event))
    }


    async #checkMail(event) {
        event.preventDefault()

        try {

            const mail = this.#MailUpdatePasswordView.querySelector("#email")
            let data = await this.#loadAllUsersRepository.loadUsers(email.value)
            console.log(data.length)

            if (data.length === 0) {
                this.#setErrorfor("Mail bestaat niet")
            } else {
                // App.loadController(alert("gelukt"))
                // location.reload()

                alert("gelukt")


                //send mail
                const mail = this.#MailUpdatePasswordView.querySelector("#email").value
                this.#sendMailRepository.sendMail(mail)
                this.#setSuccesfor()

            }

            console.log(data[0].email)


        } catch (e) {

        }
    }

    #setErrorfor(message) {

        const small = this.#MailUpdatePasswordView.querySelector(".error");

        small.innerHTML = message;

    }

    #setSuccesfor() {

        const small = this.#MailUpdatePasswordView.querySelector(".error");

        small.innerHTML = "";

    }

}


