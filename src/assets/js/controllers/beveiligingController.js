/**
 *
 * Controller repsonsible for all events in Account settings
 */
import {App} from "../app.js";
import {Controller} from "./controller.js";
import { UpdatePasswordRepository } from "../repositories/updatePasswordRepository.js";
import { loadAllUsersRepository } from "../repositories/loadAllUsersRepository.js";

export class BeveiligingController extends Controller {

    #updatePasswordRepository
    #beveiligingView
    #loadAllUsersRepository


    constructor() {
        super();

        this.#updatePasswordRepository = new UpdatePasswordRepository();
        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#setupview()

    }

    async #setupview() {
        this.#beveiligingView = await super.loadHtmlIntoContent("html_views/beveiliging.html");

        this.#beveiligingView.querySelector(".algemeen").addEventListener("click", event => {
            window.location.href = "#accountSettings";
        });
        this.#beveiligingView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "#instantie";
        });
        this.#beveiligingView.querySelector(".beveiliging").addEventListener("click", event => {
            window.location.href = "#beveiliging";
        });
        this.#beveiligingView.querySelector(".socialMedia").addEventListener("click", event => {
            window.location.href = "#socialMedia";
        });
        // this.#beveiligingView.querySelector(".bulletinGedrag").addEventListener("click", event => {
        //     window.location.href = "#bulletinGedrag";
        // });

        this.#beveiligingView.querySelector(".submitbutton").addEventListener("click", (event) => this.#updatePassword(event));


    }

    async #updatePassword(event) {

        event.preventDefault()
        let passwordCheck;
        let emailCheck;

        const email = App.sessionManager.get("email")
        const password = this.#beveiligingView.querySelector("#new-password")
        const confirmPassword = this.#beveiligingView.querySelector("#confirm-password")

            emailCheck = false;

        if (email === "" || email === null) {
            this.#setErrorfor(email, "email kan niet leeg zijn")
        } else {
            const data = await this.#loadAllUsersRepository.loadUsers(email)

            if (data.length === 0) {
                this.#setErrorfor(email, "Email bestaat niet")
            } else {
                this.#setSuccesfor(email)
                emailCheck = true;
            }
        }

        passwordCheck = false;

        if (password.value === "" || password.value === null) {
            this.#setErrorfor(password, "wachtwoord mag niet leeg zijn")
        } else if (!this.#paswordPatternCheck(password.value)) {
            this.#setErrorfor(password, "wachtwoord moet minimaal 1 hoofdletter,1 kleine letter, " +
                "1 leesteken en een cijfer hebben")
        } else if (password.value !== confirmPassword.value) {
            this.#setErrorfor(confirmPassword, "Wachtwoord komt niet overeen")
        } else {
            this.#setSuccesfor(confirmPassword)
            passwordCheck = true;
        }


        if (emailCheck && passwordCheck) {
            try {
                const data = await this.#updatePasswordRepository.updatePassword(password.value, email)
                alert("Het is gelukt!")
                location.reload()
            } catch (e) {

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
