/**
 * Controller responsible for all events in login view
 * @author Pim Meijer
 */

import { UsersRepository } from "../repositories/usersRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class LoginController extends Controller {
    //# is a private field in Javascript
    #usersRepository
    #loginView

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();

        this.#setupView()
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#loginView = await super.loadHtmlIntoContent("html_views/login.html")

        //from here we can safely get elements from the view via the right getter
        this.#loginView.querySelector(".submitbutton").addEventListener("click", event => this.#handleLogin(event));


        this.#loginView.querySelector(".registreren-container").addEventListener("click", event => App.loadController(App.CONTROLLER_SIGNUP));
        this.#loginView.querySelector(".wwvergeten").addEventListener("click", event => App.loadController(App.CONTROLLER_PASSWORDUPDATEMAIL));
    }
    /**
     * Async function that does a login request via repository
     * @param event
     */
    async #handleLogin(event) {
        //prevent actual submit and page refresh
        event.preventDefault();

        //get the input field elements from the view and retrieve the value
        const username = this.#loginView.querySelector("#email").value;
        const password = this.#loginView.querySelector("#password").value;

        try {
            const user = await this.#usersRepository.login(username, password);
            console.log(user.result[0])


            //let the session manager know we are logged in by setting the username, never set the password in localstorage
            App.sessionManager.set("email", user.result[0].email);
            App.sessionManager.set("id", user.result[0].id);
            console.log(App.sessionManager.get("id"))

            App.loadController(App.CONTROLLER_NAVBAR_LOGGEDIN);
            App.loadController(App.CONTROLLER_WELCOME);
        } catch (error) {
            //if unauthorized error code, show error message to the user
            if (error.code === 401) {
                this.#loginView.querySelector(".error").innerHTML = "ERROR: " + error.reason
            } else {
                console.error(error);
            }
        }


    }

    #SendEmail() {



    }
}