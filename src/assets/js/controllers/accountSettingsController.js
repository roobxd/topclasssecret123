import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { UsersRepository } from "../repositories/usersRepository.js";
import { VerificatieRepository } from "../repositories/verificatieRepository.js";

/**
 * Controller responsible for all events in Account settings view
 * @extends {Controller}
 * @author Aaron
 */
export class AccountSettingsController extends Controller {
    #usersRepository;
    #geverifierdRepository;
    #accountSettingsRepository;
    #accountSettingsView;


    /**
     * Constructs an AccountSettingsController instance, initializes repositories,
     * and sets up the view.
     */
    constructor() {
        super();
        this.#usersRepository = new UsersRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();
        this.#geverifierdRepository = new VerificatieRepository();

        this.#setupView();
    }

    /**
     * Sets up the view by loading HTML, attaching event listeners, fetching user info,
     * and updating the DOM accordingly.
     * @private
     * @async
     */
    async #setupView() {
        this.#accountSettingsView = await super.loadHtmlIntoContent(
            "html_views/accountSettings.html"
        );

        // Attach event listeners for navigation links
        this.#accountSettingsView
            .querySelector(".algemeen")
            .addEventListener("click", (event) => {
                window.location.href = "#accountSettings";
            });
        this.#accountSettingsView
            .querySelector(".instantie")
            .addEventListener("click", (event) => {
                window.location.href = "#instantie";
            });
        this.#accountSettingsView
            .querySelector(".beveiliging")
            .addEventListener("click", (event) => {
                window.location.href = "#beveiliging";
            });
        this.#accountSettingsView
            .querySelector(".socialMedia")
            .addEventListener("click", (event) => {
                window.location.href = "#socialMedia";
            });

        // Log the user's email
        console.log(App.sessionManager.get("email"));

        // Attach event listener for the "bewerken" button
        this.#accountSettingsView
            .querySelector(".bewerken")
            .addEventListener("click", (event) => {
                window.location.href = "#accountSettingsBewerken";
            });

        // Log the user's ID
        console.log(App.sessionManager.get("userId"));

        // Get user information from session manager
        const name = App.sessionManager.get("voornaam");
        const achternaam = App.sessionManager.get("achternaam");
        const email = App.sessionManager.get("email");

        // Update user information in the HTML
        this.#accountSettingsView.querySelector("#name").textContent = name;
        this.#accountSettingsView.querySelector("#email").textContent = email;

        // Set up social media links and image URLs
        const instagram = App.sessionManager.get("instagram");
        const tiktok = App.sessionManager.get("tiktok");
        const facebook = App.sessionManager.get("facebook");

        this.#accountSettingsView.querySelector(".instagram-link").href = instagram;
        this.#accountSettingsView.querySelector(".tiktok-link").href = tiktok;
        this.#accountSettingsView.querySelector(".facebook-link").href = facebook;

        this.#accountSettingsView.querySelector(".instagram").src = "uploads/instagram.png";
        this.#accountSettingsView.querySelector(".tiktok").src = "uploads/tik-tok.png";
        this.#accountSettingsView.querySelector(".facebook").src = "uploads/facebook.png";

        // Load user info asynchronously
        await this.#loadUserInfo();
    }


    /**
     * Loads user information from the repository, verifies the user's email,
     * and updates the view with the user's information.
     * @private
     * @async
     */
    async #loadUserInfo() {
        const userMail = App.sessionManager.get("email");

        try {
            const users = await this.#accountSettingsRepository.getUsers();
            console.log(users);

            // Find the current user in the list of users
            const userInfo = users.find((user) => user.email === userMail);
            console.log(userInfo);

            if (!userInfo) {
                console.error("User not found:", userMail);
                return;
            }

            // Check verification status
            const isGeverifieerd = await this.#geverifierdRepository.verifierResult(userMail);
            let klopt;

            console.log(isGeverifieerd[0].verificatie);

            if (isGeverifieerd[0].verificatie == 1) {
                klopt = "geverifieerd";
            } else {
                klopt = "niet geverifieerd";
            }

            // Update user info in the HTML
            this.#accountSettingsView.querySelector("#email").textContent = userInfo.email;
            this.#accountSettingsView.querySelector("#name").textContent = `${userInfo.voornaam} ${userInfo.tussenvoegsel} ${userInfo.achternaam}`;
            this.#accountSettingsView.querySelector(".verificatie-status").textContent = klopt;
        } catch (error) {
            console.error("Error loading user info:", error);
        }
    }
}
