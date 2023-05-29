/**
 *
 * Controller repsonsible for all events in Account settings view
 */
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {UsersRepository} from "../repositories/usersRepository.js";
import {VerificatieRepository} from "../repositories/verificatieRepository.js";


export class AccountSettingsController extends Controller {
    #usersRepository;
    #geverifierdRepository;
    #accountSettingsRepository;
    #accountSettingsView;


    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();
        this.#geverifierdRepository = new VerificatieRepository();

        this.#setupView();

    }

    async #setupView() {
        this.#accountSettingsView = await super.loadHtmlIntoContent("html_views/accountSettings.html");


        this.#accountSettingsView.querySelector(".algemeen").addEventListener("click", event => {
            window.location.href = "#accountSettings";
        });
        this.#accountSettingsView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "#instantie";
        });
        this.#accountSettingsView.querySelector(".beveiliging").addEventListener("click", event => {
            window.location.href = "#beveiliging";
        });
        this.#accountSettingsView.querySelector(".socialMedia").addEventListener("click", event => {
            window.location.href = "#socialMedia";
        });
        this.#accountSettingsView.querySelector(".bulletinGedrag").addEventListener("click", event => {
            window.location.href = "#bulletinGedrag";
        });

        //event listener for identity veranderen knop
        // this.#accountSettingsView.querySelector("#confirmIdentity").addEventListener("click", event => this.#handleIdentityUpdate(event));

        console.log(App.sessionManager.get("email"));

        this.#accountSettingsView.querySelector("#editEmail").addEventListener("click", event => this.#handleTextToInput(event));

        this.#loadUserInfo();
    }

    #handleTextToInput(event) {
        event.preventDefault();

        // Get the paragraph element
        const emailParagraaf = this.#accountSettingsView.querySelector("#currentEmail");

        // Check if emailPara is null
        if (!emailParagraaf) {
            console.log('No element found with id "currentEmail".');
            return;
        }

        // Log the found element
        console.log('Found element:', emailParagraaf);

        // Create a new input element
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = emailParagraaf.textContent;  // set the initial input value to the text of the paragraph

        // Replace the paragraph element with the input element
        emailParagraaf.parentNode.replaceChild(newInput, emailParagraaf);
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

    async #loadUserInfo() {
        const userMail = App.sessionManager.get("email")

        try {
            const users = await this.#accountSettingsRepository.getUsers();
            console.log(users)

            // Find the current user in the list of users
            const userInfo = users.find(user => user.email === userMail);
            console.log(userInfo)

            if (!userInfo) {
                console.error("User not found:", userMail);
                return;
            }

            // Update user info in the HTML
            this.#accountSettingsView.querySelector("#contact").textContent = userInfo.email;
            this.#accountSettingsView.querySelector("#email").textContent = userInfo.email;
            this.#accountSettingsView.querySelector("#name").textContent = `${userInfo.voornaam} ${userInfo.tussenvoegsel} ${userInfo.achternaam}`;

        } catch (error) {
            console.error("Error loading user info:", error);
        }

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

}
