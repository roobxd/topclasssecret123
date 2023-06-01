/**
 *
 * Controller responsible for all events in Account settings
 */
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UpdatePasswordRepository } from "../repositories/updatePasswordRepository.js";
import { loadAllUsersRepository } from "../repositories/loadAllUsersRepository.js";

export class BeveiligingController extends Controller {
    #updatePasswordRepository;
    #beveiligingView;
    #loadAllUsersRepository;

    constructor() {
        super();

        this.#updatePasswordRepository = new UpdatePasswordRepository();
        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#setupView();
    }

    // Set up the view and attach event listeners
    async #setupView() {
        this.#beveiligingView = await super.loadHtmlIntoContent("html_views/beveiliging.html");

        // Attach event listeners for navigation links
        this.#beveiligingView.querySelector(".algemeen").addEventListener("click", (event) => {
            window.location.href = "#accountSettings";
        });
        this.#beveiligingView.querySelector(".instantie").addEventListener("click", (event) => {
            window.location.href = "#instantie";
        });
        this.#beveiligingView.querySelector(".beveiliging").addEventListener("click", (event) => {
            window.location.href = "#beveiliging";
        });
        this.#beveiligingView.querySelector(".socialMedia").addEventListener("click", (event) => {
            window.location.href = "#socialMedia";
        });

        // Attach event listener for the submit button
        this.#beveiligingView.querySelector(".submitbutton").addEventListener("click", (event) => this.#updatePassword(event));
    }

    // Update the user's password
    async #updatePassword(event) {
        try {
            event.preventDefault();

            let passwordCheck;
            let emailCheck;

            const email = App.sessionManager.get("email");
            const password = this.#beveiligingView.querySelector("#new-password");
            const confirmPassword = this.#beveiligingView.querySelector("#confirm-password");

            emailCheck = false;

            if (email === "" || email === null) {
                this.#setErrorfor(email, "Email kan niet leeg zijn");
            } else {
                const data = await this.#loadAllUsersRepository.loadUsers(email);

                if (data.length === 0) {
                    this.#setErrorfor(email, "Email bestaat niet");
                } else {
                    this.#setSuccessfor(email);
                    emailCheck = true;
                }
            }

            passwordCheck = false;

            if (password.value === "" || password.value === null) {
                this.#setErrorfor(password, "Wachtwoord mag niet leeg zijn");
            } else if (!this.#passwordPatternCheck(password.value)) {
                this.#setErrorfor(password, "Wachtwoord moet minimaal 1 hoofdletter, 1 kleine letter, 1 leesteken en een cijfer hebben");
            } else if (password.value !== confirmPassword.value) {
                this.#setErrorfor(confirmPassword, "Wachtwoord komt niet overeen");
            } else {
                this.#setSuccessfor(confirmPassword);
                passwordCheck = true;
            }

            if (emailCheck && passwordCheck) {
                try {
                    const data = await this.#updatePasswordRepository.updatePassword(password.value, email);
                    alert("Het is gelukt!");
                    location.reload();
                } catch (e) {
                    // Handle error
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Set the error message for the input element
    #setErrorfor(input, message) {
        try {
            const parentElementInput = input.parentElement; // Get the parent element
            const small = parentElementInput.querySelector(".error");
            small.innerHTML = message;
        } catch (e) {
            console.log(e);
        }
    }

    // Clear the error message for the input element
    #setSuccessfor(input) {
        const parentElementInput = input.parentElement; // Get the parent element
        const small = parentElementInput.querySelector(".error");
        small.innerHTML = "";
    }

    // Check if the password meets the required pattern
    // Requires at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character,
    // and a minimum length of 5 characters
    #passwordPatternCheck(password) {
        return /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password) &&
            password.length > 4;
    }
}
