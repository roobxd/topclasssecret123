import {Controller} from "./controller.js";
import {loadAllUsersRepository} from "../repositories/loadAllUsersRepository.js";
import {App} from "../app.js";


export class PasswordUpdateMailController extends Controller {
    #MailUpdatePasswordView
    #loadAllUsersRepository


    constructor() {
        super();

        this.#loadAllUsersRepository = new loadAllUsersRepository();
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
                this.#setErrorfor(mail, "Mail bestaat niet")
            } else {
                this.#setSuccesfor(mail)
                App.loadController(alert("gelukt"))
                // location.reload()

                //send mail

            }

            //send mail
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


