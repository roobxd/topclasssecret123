import { Controller } from "./controller.js";
import { UpdatePasswordRepository } from "../repositories/updatePasswordRepository.js";
import { loadAllUsersRepository } from "../repositories/loadAllUsersRepository.js";
import { App } from "../app.js";

export class UpdatePasswordController extends Controller {

    #updatePasswordRepository
    #PasswordView
    #loadAllUsersRepository


    constructor() {
        super();

        this.#updatePasswordRepository = new UpdatePasswordRepository();
        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#setupview()
    }

    async #setupview() {
        this.#PasswordView = await super.loadHtmlIntoContent("html_views/updatePassword.html")

        const email = this.#PasswordView.querySelector("#gebruikersnaam")
        const password = this.#PasswordView.querySelector("#password")
        const confirmpassword = this.#PasswordView.querySelector("#confirm_password")

        this.#PasswordView.querySelector(".gaterug").addEventListener("click", event => App.loadController(App.CONTROLLER_LOGIN));

        let passwordcheck;
        let emailcheck;


        emailcheck = false;
        if (email.value === "" || email.value === null) {
            this.#setErrorfor(email, "email kan niet leeg zijn")
        } else {
            const data = await this.#loadAllUsersRepository.loadUsers(email)

            if (data.length === 0) {
                this.#setErrorfor(email, "Email bestaat niet")
            } else {
                this.#setSuccesfor(email)
                emailcheck = true;
            }
        }

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


        if (emailcheck && passwordcheck) {
            try {
                const data = await this.#updatePasswordRepository.updatePassword(password.value, email.value)
            } catch (e) {

            }
        }

    }


    #setErrorfor(input, message) {

        const parentElementInput = input.parentElement;  // pakt parentelement
        const small = parentElementInput.querySelector('.error')

        small.innerText = message;

    }

    #setSuccesfor(input) {

        const parentElementInput = input.parentElement;  // pakt parentelement
        const small = parentElementInput.querySelector('.error')

        small.innerText = "";

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
