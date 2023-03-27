import {UpdatePasswordRepository} from "../repositories/updatePasswordRepository.js";
import {loadAllUsersRepository} from "../repositories/loadAllUsersRepository.js";
import {Controller} from "./controller.js";
import {App} from "../app.js";


export class IngelogdUpdatePasswordController extends Controller {
    #updatePasswordRepository
    #PasswordView
    #loadAllUsersRepository


    constructor() {
        super();

        this.#updatePasswordRepository = new UpdatePasswordRepository();
        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#setupView()
        // this.#PasswordView.querySelector("#updatePassword").addEventListener((event) => this.#updatePassword(event))
    }

    async #setupView() {
        this.#PasswordView = await super.loadHtmlIntoContent("html_views/ingelogdUpdatePassword.html");

        this.#PasswordView.querySelector(".submitbutton").addEventListener("click", (event) => this.#updatePassword(event));


    }

    async #updatePassword(event) {

        event.preventDefault()
        let passwordcheck;


        const password = this.#PasswordView.querySelector("#new-password")
        const confirmpassword = this.#PasswordView.querySelector("#confirm-password")


        passwordcheck = false;

        if (password.value === "" || password.value === null) {
            this.#setErrorfor(password, "wachtwoord mag niet leeg zijn")
        } else if (!this.#paswordPatternCheck(password.value)) {
            this.#setErrorfor(password, "wachtwoord moet minimaal 1 hoofdletter,1 kleine letter, " +
                "1 leesteken en een cijfer hebben")
        } else if (password.value !== confirmpassword.value) {
            this.#setErrorfor(confirmpassword, "Wachtwoord komt niet overeen")
        } else {
            this.#setSuccesfor(confirmpassword)
            passwordcheck = true;
        }


        if (passwordcheck) {
            try {
               const email = await App.sessionManager.get("email");
                const data = await this.#updatePasswordRepository.updatePassword(password.value, email)
                alert("Het is gelukt!")
                App.loadController(App.CONTROLLER_ACCOUNT_SETTINGS)
                console.log(data)
                // location.reload()
            } catch (e) {
                console.log({ reason: e})
            }
        }
    }


    #setErrorfor(input, message) {

        const parentElementInput = input.parentElement;  // pakt parentelement
        const small = document.querySelector('.error')

        small.innerHTML = message;

    }

    #setSuccesfor(input) {

        const parentElementInput = input.parentElement;  // pakt parentelement
        const small = document.querySelector('.error')

        small.innerHTML = "";

    }

    //minimaal 1 hoofdletter,1 kleine letter, 1 leesteken en een cijfer
    #paswordPatternCheck(password) {
        return /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password) &&
            password.length > 4;
    }

}