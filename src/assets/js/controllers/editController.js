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

        const url = window.location.href;
        const lastNumber = url.substring(url.lastIndexOf("/") + 1);
        this.#fetchPost(lastNumber);

        this.#editView.querySelector(".bold").addEventListener("click", () => document.execCommand("bold", false, null));
        this.#editView.querySelector(".italic").addEventListener("click", () => document.execCommand("italic", false, null));
        this.#editView.querySelector(".underline").addEventListener("click", () => document.execCommand("underline", false, null));
        this.#editView.querySelector(".strikethrough").addEventListener("click", () => document.execCommand("strikeThrough", false, null));

        this.#editView.querySelector("#no").addEventListener("click", () => this.#toggleCommentsNo());
        this.#editView.querySelector("#yes").addEventListener("click", () => this.#toggleCommentsYes());

        this.#editView.querySelector(".instantietag").addEventListener("click", () => this.#toggleInstantie());
        this.#editView.querySelector(".gebruikertag").addEventListener("click", () => this.#toggleStory());

        this.#editView.querySelector(".postbutton").addEventListener("click", (event) => this.#updatePost(event, lastNumber));
    }

    #toggleCommentsNo(){
        let nobutton = document.querySelector("#no");
        nobutton.classList.add("commentno");

        let yesbutton = document.querySelector("#yes");
        yesbutton.classList.remove("commentyes");
    }

    #toggleCommentsYes(){
        let yesbutton = document.querySelector("#yes");
        yesbutton.classList.add("commentyes");

        let nobutton = document.querySelector("#no");
        nobutton.classList.remove("commentno");
    }

    #toggleInstantie(){
        let instantietag = document.querySelector(".instantietag");
        instantietag.classList.add("active-tag-instantie");

        let gebruikertag = document.querySelector(".gebruikertag");
        gebruikertag.classList.remove("active-tag-user");
    }

    #toggleStory(){
        let yesbutton = document.querySelector(".gebruikertag");
        yesbutton.classList.add("active-tag-user");

        let instantietag = document.querySelector(".instantietag");
        instantietag.classList.remove("active-tag-instantie");
    }


    async #updatePost(event, lastNumber) {
        const titelinput = this.#editView.querySelector(".titelinput");
        const dateinput = this.#editView.querySelector(".dateinput");
        const storyinput = this.#editView.querySelector(".storyinput");
        const fileinput = this.#editView.querySelector("#fileinput");


        const content = storyinput.innerHTML;


        let commentsenabled = 0;
        let storytype = "instantie";

        if(document.querySelector(".commentyes")){
            commentsenabled = 1;
        }

        if(document.querySelector(".active-tag-user")){
            storytype = "verhaal"
        }

        try {
            await this.#editRepository.update(this.#session, titelinput.value, storytype, dateinput.value, content, fileinput.value, lastNumber, commentsenabled );
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

            if(data[0].commentsenabled == 1){
                let nobutton = document.querySelector("#yes");
                nobutton.classList.add("commentyes");
            } else{
                let nobutton = document.querySelector("#no");
                nobutton.classList.add("commentno");
            }

            if(data[0].soortStory == "instantie"){
                let storytag = document.querySelector(".gebruikertag");
                storytag.classList.add("active-tag-user");
            } else{
                let storytag = document.querySelector(".instantietag");
                storytag.classList.add("active-tag-instantie");
            }


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
