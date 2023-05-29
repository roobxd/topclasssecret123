/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import { Controller } from "./controller.js";
import { BulletinRepository } from "../repositories/bulletinRepository.js";

export class BulletinController extends Controller {
    #BulletinRepository;
    #welcomeView

    constructor() {
        super();
        this.#BulletinRepository = new BulletinRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/bulletin.html");
        console.log(this.#welcomeView)

        //from here we can safely get elements from the view via the right getter
        // this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("email");

        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchPosts();

        this.#welcomeView.querySelector(".bold").addEventListener("click", () => document.execCommand("bold", false, null));
        this.#welcomeView.querySelector(".italic").addEventListener("click", () => document.execCommand("italic", false, null));
        this.#welcomeView.querySelector(".underline").addEventListener("click", () => document.execCommand("underline", false, null));
        this.#welcomeView.querySelector(".strikethrough").addEventListener("click", () => document.execCommand("strikeThrough", false, null));

        let gaterugbutton = document.querySelector(".gaterug")
        
        gaterugbutton.addEventListener("click", () => {
            window.history.back();
        });
        

        this.#welcomeView.querySelector(".submitbutton").addEventListener("click", (event) => this.#savePost(event));

        var storyInput = document.querySelector('.verhaal');

        storyInput.addEventListener('keyup', function () {
            this.dataset.divPlaceholderContent = this.textContent;
        });

    }

    async #savePost(event) {
        const titel = this.#welcomeView.querySelector(".titleinput");
        const verhaal = this.#welcomeView.querySelector(".verhaal");

        const content = verhaal.innerHTML;

        try {
            await this.#BulletinRepository.create(titel.value, content);
            alert("Uw verhaal is geplaatst!");
        } catch (error) {
            console.log(error);
        }

        // console.log("Jouw post bevat de volgende titel: " + titel + " en de volgende tekst: " + verhaal);


    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */
    async #fetchPosts() {
        const storyTitel = this.#welcomeView.querySelector(".story-titel");
        const storyTekst = this.#welcomeView.querySelector(".story-tekst");

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#BulletinRepository.getAll();
            console.log(data);
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            // exampleResponse.innerHTML = e;
        }
    }
}