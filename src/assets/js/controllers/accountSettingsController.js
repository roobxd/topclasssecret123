/**
 *
 * Controller repsonsible for all events in Account settings view
 */
import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UsersRepository } from "../repositories/usersRepository.js";

export class AccountSettingsController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #accountSettingsView;

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();

        this.#setupView();
    }

    async #setupView() {
        this.#accountSettingsView = await super.loadHtmlIntoContent("html_views/accountSettings.html");

        // const userEmail = App.sessionManager.get("email");
        // this.#accountSettingsView.querySelector("#currentEmail").textContent = userEmail;

        this.#accountSettingsView.querySelector("#editLoginForm").addEventListener("submit", event => this.#handlePasswordUpdate(event));
    }

    #handlePasswordUpdate(event) {
        event.preventDefault();

        const newPassword = this.#accountSettingsView.querySelector("#newPassword").value;
        const confirmPassword = this.#accountSettingsView.querySelector("#confirmPassword").value;
        const email = App.sessionManager.get("email");

        if (newPassword === confirmPassword) {
            this.#accountSettingsRepository
                .updatePassword(email, newPassword, confirmPassword)
                .then(() => {
                    this.#accountSettingsView.querySelector(".password-update-message").textContent = "Password updated successfully!";
                })
                .catch(error => {
                    console.error("Error updating password:", error);
                    this.#accountSettingsView.querySelector(".password-update-message").textContent = "Error updating password: " + error.message;
                });
        } else {
            this.#accountSettingsView.querySelector(".password-update-message").textContent = "Passwords do not match!";
        }
    }
}
