/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import { Controller } from "./controller.js";
import { EditRepository } from "../repositories/editRepository.js";

export class EditController extends Controller {
    #editView;
    #editRepository;
    #session;

    constructor() {
        super();
        this.#editRepository = new EditRepository();
        this.#session = App.sessionManager.get("id");
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#editView = await super.loadHtmlIntoContent("html_views/edit.html")

        //from here we can safely get elements from the view via the right getter
        // this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("email");


        const url = window.location.href;
        const lastNumber = url.substring(url.lastIndexOf("/") + 1);
        console.log(lastNumber);
        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchPost(lastNumber);

        this.#editView.querySelector(".bold").addEventListener("click", () => document.execCommand("bold", false, null));
        this.#editView.querySelector(".italic").addEventListener("click", () => document.execCommand("italic", false, null));
        this.#editView.querySelector(".underline").addEventListener("click", () => document.execCommand("underline", false, null));
        this.#editView.querySelector(".strikethrough").addEventListener("click", () => document.execCommand("strikeThrough", false, null));

        this.#editView.querySelector(".storyinput").addEventListener('input', () => {
            // Get the HTML content of the editor
            //const content = editor.innerHTML;

            // Do something with the HTML content (e.g. save it to a database)
            //console.log(html);
        });

        this.#editView.querySelector(".postbutton").addEventListener("click", (event) => this.#updatePost(event, lastNumber));
    }


    async #updatePost(event, lastNumber) {
        const titelinput = this.#editView.querySelector(".titelinput");
        const dateinput = this.#editView.querySelector(".dateinput");
        const storyinput = this.#editView.querySelector(".storyinput");
        const fileinput = this.#editView.querySelector("#fileinput");


        const content = storyinput.innerHTML;
        // console.log(subject.value + " " + year.value + " " + typeOfPost.value + " " + post.value)
        console.log(this.#session);

        try {
            await this.#editRepository.update(this.#session, titelinput.value, dateinput.value, content, fileinput.value, lastNumber );
            alert("Uw verhaal is geplaatst!");
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */
    async #fetchPost(lastNumber) {
        let storyPlaatje = this.#editView.querySelector(".story-plaatje");
        let titelinput = this.#editView.querySelector(".titelinput");
        let dateinput = this.#editView.querySelector(".dateinput");
        let storyinput = this.#editView.querySelector(".storyinput");
        let fileinput = this.#editView.querySelector("#fileinput");

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#editRepository.getPost(lastNumber);
            let length = data.length - 1;
            titelinput.value = data[0].onderwerp;

            // Reformat date received from db to date with input format.
            let datumreceived = data[0].publicatieDatum;
            let date = new Date(datumreceived);
            let year = date.getUTCFullYear();
            let month = date.getUTCMonth() + 1;  // getUTCMonth() returns a 0-based month (where 0 is January), so we add 1
            let day = date.getUTCDate();

            // Pad the month and day with leading zeros if they are less than 10
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;

            let formattedDate = `${year}-${month}-${day}`;

            storyinput.innerHTML = data[0].bericht;

            dateinput.value = formattedDate;


            // storyPlaatje.innerHTML = data[length].sampleFile;
            console.log(data);
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            // exampleResponse.innerHTML = e;
        } }
            //for now just show every error on page, normally not all errors are appropriate for user
            //exampleResponse.innerHTML = e;
        }
