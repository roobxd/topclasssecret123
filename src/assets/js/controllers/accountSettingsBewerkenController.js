/**
 *
 * Controller repsonsible for all events in Account settings view
 */
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";
import {UsersRepository} from "../repositories/usersRepository.js";

export class AccountSettingsBewerkenController extends Controller {
    #usersRepository;
    #accountSettingsRepository;
    #accountSettingsBewerkenView;


    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();

        this.#setupView();

    }

    async #setupView() {
        this.#accountSettingsBewerkenView = await super.loadHtmlIntoContent("html_views/accountSettingsBewerken.html");


        this.#accountSettingsBewerkenView.querySelector(".algemeen").addEventListener("click", event => {
            window.location.href = "#accountSettings";
        });
        this.#accountSettingsBewerkenView.querySelector(".instantie").addEventListener("click", event => {
            window.location.href = "#instantie";
        });
        this.#accountSettingsBewerkenView.querySelector(".beveiliging").addEventListener("click", event => {
            window.location.href = "#beveiliging";
        });
        this.#accountSettingsBewerkenView.querySelector(".socialMedia").addEventListener("click", event => {
            window.location.href = "#socialMedia";
        });
        this.#accountSettingsBewerkenView.querySelector(".bulletinGedrag").addEventListener("click", event => {
            window.location.href = "#bulletinGedrag";
        });

        //event listener for identity veranderen knop
        // this.#accountSettingsView.querySelector("#confirmIdentity").addEventListener("click", event => this.#handleIdentityUpdate(event));

        console.log(App.sessionManager.get("userId"));

       this.#accountSettingsBewerkenView.querySelector("#editEmail").addEventListener("click", event => this.#handleEmailUpdate(event));
       this.#accountSettingsBewerkenView.querySelector("#editName").addEventListener("click", event => this.#handleNameUpdate(event));

    }


    #handleProfilePicturePreview(event) {
        event.preventDefault();

        const profilePicInput = this.#accountSettingsBewerkenView.querySelector("#profilePic");
        const profilePicPreview = this.#accountSettingsBewerkenView.querySelector("#profilePicPreview");

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
    #handleNameUpdate(event){
        event.preventDefault();


        const newVoornaam = this.#accountSettingsBewerkenView.querySelector("#voornaam").value;
        const newAchternaam = this.#accountSettingsBewerkenView.querySelector("#achternaam").value;
        const currentId = App.sessionManager.get("id");
        const currentName = App.sessionManager.get("voornaam","achternaam")


        this.#accountSettingsRepository
            .updateNaam(currentId, newVoornaam, newAchternaam)
            .then(() => {
                this.#accountSettingsBewerkenView.querySelector(".naam-update-message").textContent = "Naam succesvol veranderd!";
                // this.#accountSettingsBewerkenView.querySelector("#currentEmail").textContent = newEmail;
                App.sessionManager.set("voornaam", newVoornaam);
                App.sessionManager.set("achternaam", newAchternaam);
                App.sessionManager.set("id", currentId);
            })
            .catch(error => {
                console.error("Error updating name:", error);
                this.#accountSettingsBewerkenView.querySelector(".naam-update-message").textContent = "Error updating name: " + error.message;
            });

    }
    #handleEmailUpdate(event) {
        event.preventDefault();

        const newEmail = this.#accountSettingsBewerkenView.querySelector("#email").value;
        const currentEmail = App.sessionManager.get("email");

        this.#accountSettingsRepository
            .updateEmail(currentEmail, newEmail)
            .then(() => {
                this.#accountSettingsBewerkenView.querySelector(".email-update-message").textContent = "Email updated successfully!";
                // this.#accountSettingsBewerkenView.querySelector("#currentEmail").textContent = newEmail;
                App.sessionManager.set("email", newEmail);
            })
            .catch(error => {
                console.error("Error updating email:", error);
                this.#accountSettingsBewerkenView.querySelector(".email-update-message").textContent = "Error updating email: " + error.message;
            });
    }

}
