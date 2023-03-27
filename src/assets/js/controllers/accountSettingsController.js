/**
 *
 * Controller repsonsible for all events in Account settings view
 */
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {UsersRepository} from "../repositories/usersRepository.js";

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


        ///// MORGEN MET ALI BESPREKEN
        
        // this.#accountSettingsView.querySelector(".resetPassword").addEventListener("click",event => App.loadController(App.CONTROLLER_INGELOGDUPDATEPASSWORD));
        // Add event listener for profile picture input change
        // this.#accountSettingsView.querySelector("#profilePic").addEventListener("change", event => this.#handleProfilePicturePreview(event));

        // Add event listener for email update button
        this.#accountSettingsView.querySelector("#confirmEmail").addEventListener("click", event => this.#handleEmailUpdate(event));


        this.#accountSettingsView.querySelector("#editLoginForm").addEventListener("submit", event => this.#handlePasswordUpdate(event));
    }

    #handleProfilePicturePreview(event) {
        event.preventDefault();

        const profilePicInput = this.#accountSettingsView.querySelector("#profilePic");
        const profilePicPreview = this.#accountSettingsView.querySelector("#profilePicPreview");

        if (profilePicInput.files.length === 0) {
            profilePicPreview.style.display = "none";
            return;
        }

        const profilePicFile = profilePicInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            profilePicPreview.src = e.target.result;
            profilePicPreview.style.display = "block";
        };

        reader.readAsDataURL(profilePicFile);
    }

    #handleEmailUpdate(event) {
        event.preventDefault();

        const newEmail = this.#accountSettingsView.querySelector("#email").value;
        const currentEmail = App.sessionManager.get("email");

        this.#accountSettingsRepository
            .updateEmail(currentEmail, newEmail)
            .then(() => {
                this.#accountSettingsView.querySelector(".email-update-message").textContent = "Email updated successfully!";
                App.sessionManager.set("email", newEmail);
                this.#accountSettingsView.querySelector("#currentEmail").textContent = newEmail;
            })
            .catch(error => {
                console.error("Error updating email:", error);
                this.#accountSettingsView.querySelector(".email-update-message").textContent = "Error updating email: " + error.message;
            });
    }

    #handlePasswordUpdate(event) {
        event.preventDefault();

        const newPassword = this.#accountSettingsView.querySelector("#newPassword").value;
        const confirmPassword = this.#accountSettingsView.querySelector("#confirmPassword").value;
        const email = App.sessionManager.get("email");

        // if (newPassword === confirmPassword) {
        //     this.#accountSettingsRepository
        //         .updatePassword(email, newPassword, confirmPassword)
        //         .then(() => {
        //             this.#accountSettingsView.querySelector(".password-update-message").textContent = "Password updated successfully!";
        //         })
        //         .catch(error => {
        //             console.error("Error updating password:", error);
        //             this.#accountSettingsView.querySelector(".password-update-message").textContent = "Error updating password: " + error.message;
        //         });
        // } else {
        //     this.#accountSettingsView.querySelector(".password-update-message").textContent = "Passwords do not match!";
        // }
    }
}
