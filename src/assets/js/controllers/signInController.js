/**
 *
 * controller for sign in screen
 *//* test */
import { Controller } from "./controller.js";

export class signInController extends Controller {
    #createSingInView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#createSingInView = await super.loadHtmlIntoContent("html_views/signIn.html");



        this.#createSingInView.querySelector(".register-button").addEventListener("click", (event) => {

            event.preventDefault()
            const name = this.#createSingInView.querySelector("#fullname").value
            const email = this.#createSingInView.querySelector("#email").value
            const password = this.#createSingInView.querySelector("#password").value
            const confirmPassword = this.#createSingInView.querySelector("#confirm_password").value


            console.log(name + email + password + confirmPassword)
        })

    }


}