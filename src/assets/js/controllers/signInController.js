/**
 * Controller for sign in View
 * @author Aaron Agyeman-Prempeh
 */

import {UsersRepository} from "../repositories/usersRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class signInController extends Controller {
    //# is a private field in Javascript
    #usersRepository
    #signInView

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();

        this.#setupView()
    }


    /**
     * Async function that does a login request via repository
     * @param event
     */
    async #handleRegistration(event) {
        event.preventDefault();

        const email = this.#signInView.querySelector("#inputEmail").value;
        const name = this.#signInView.querySelector("#inputFullname").value;
        const username = this.#signInView.querySelector("#inputUsername").value;
        const password = this.#signInView.querySelector("#inputPassword").value;
        console.log(email, name, username, password)
        // Validate input fields
        if (!email || !username || !password) {
            this.#signInView.querySelector(".error").innerHTML = "Please fill in all fields.";
            return;
        }

        try {
            // Check if user already exists with provided email
            const existingUser = await this.#usersRepository.getUserByEmail(email);
            if (existingUser) {
                this.#signInView.querySelector(".error").innerHTML = "Email already registered.";
                return;
            }

            // Create new user object and save to database
            const user = {
                email: email,
                fullname: fullname,
                username: username,
                password: password
            };
            await this.#usersRepository.saveUser(user);

            // Redirect to welcome page
            window.location.replace("index.html");
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        // this.#signInView = await super.loadHtmlIntoContent("html_views/signIn.html");

        // Add event listeners to buttons
        this.#signInView.querySelector(".submit-button").addEventListener("click", event => this.#handleLogin(event));
        this.#signInView.querySelector(".register-button").addEventListener("click", event => this.#handleRegistration(event));
    }
}
