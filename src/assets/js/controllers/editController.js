/**
 * EditController class responsible for handling the actions in the edit view.
 * 
 * @author Rocco van Baardwijk
 */

import { App } from "../app.js";
import { Controller } from "./controller.js";
import { EditRepository } from "../repositories/editRepository.js";
import { NetworkManager } from "../framework/utils/networkManager.js";

export class EditController extends Controller {
    #editView;
    #networkManager
    #editRepository;
    #session;
    previousImage = "";

    /**
     * Constructor of EditController. Initializes network manager, edit repository and session.
     */
    constructor() {
        super();
        this.#networkManager = new NetworkManager();
        this.#editRepository = new EditRepository();
        this.#session = App.sessionManager.get("id");
        this.#setupView();
    }

    /**
     * Load HTML content and setup event listeners.
     */
    async #setupView() {
        this.#editView = await super.loadHtmlIntoContent("html_views/edit.html")
        const url = window.location.href;
        const lastNumber = url.substring(url.lastIndexOf("/") + 1);
        this.#fetchPost(lastNumber);

        // Setting up event listeners for text formatting and post submission.
        this.#editView.querySelector(".bold").addEventListener("click", () => document.execCommand("bold", false, null));
        this.#editView.querySelector(".italic").addEventListener("click", () => document.execCommand("italic", false, null));
        this.#editView.querySelector(".underline").addEventListener("click", () => document.execCommand("underline", false, null));
        this.#editView.querySelector(".strikethrough").addEventListener("click", () => document.execCommand("strikeThrough", false, null));

        // Setting up event listeners for comment toggling.
        this.#editView.querySelector("#no").addEventListener("click", () => this.#toggleCommentsNo());
        this.#editView.querySelector("#yes").addEventListener("click", () => this.#toggleCommentsYes());

        // Setting up event listeners for instance and user story toggling.
        this.#editView.querySelector(".instantietag").addEventListener("click", () => this.#toggleInstantie());
        this.#editView.querySelector(".gebruikertag").addEventListener("click", () => this.#toggleStory());

        // Setting up event listener for post update.
        this.#editView.querySelector(".postbutton").addEventListener("click", (event) => this.#updatePost(event, lastNumber));

        // Setting up event listener for image preview.
        this.#editView.querySelector("#sampleFile").addEventListener("change", () => this.#imagePreview());
    }

    /**
     * Function to show the image preview.
     */
    #imagePreview(){
        let input = this.#editView.querySelector("#sampleFile");
        const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                const imagePreview = document.querySelector(".image-preview");
                const selectorIcon = document.querySelector(".image-icon");
                reader.addEventListener("load", function () {
                    imagePreview.src = reader.result;
                    selectorIcon.style.display = "none";
                });
        
                reader.readAsDataURL(file);
            }
    }

    /**
     * Function to toggle the "no" comments button.
     */
    #toggleCommentsNo(){
        let nobutton = document.querySelector("#no");
        nobutton.classList.add("commentno");

        let yesbutton = document.querySelector("#yes");
        yesbutton.classList.remove("commentyes");
    }

    /**
     * Function to toggle the "yes" comments button.
     */
    #toggleCommentsYes(){
        let yesbutton = document.querySelector("#yes");
        yesbutton.classList.add("commentyes");

        let nobutton = document.querySelector("#no");
        nobutton.classList.remove("commentno");
    }

    /**
     * Function to toggle the instance tag.
     */
    #toggleInstantie(){
        let instantietag = document.querySelector(".instantietag");
        instantietag.classList.add("active-tag-instantie");

        let gebruikertag = document.querySelector(".gebruikertag");
        gebruikertag.classList.remove("active-tag-user");
    }

    /**
     * Function to toggle the user story tag.
     */
    #toggleStory(){
        let yesbutton = document.querySelector(".gebruikertag");
        yesbutton.classList.add("active-tag-user");

        let instantietag = document.querySelector(".instantietag");
        instantietag.classList.remove("active-tag-instantie");
    }

    /**
     * Function to update a post.
     * @param {object} event - The event object.
     * @param {string} lastNumber - The last number in the URL.
     */
    async #updatePost(event, lastNumber) {
        event.preventDefault();
        
        const titelinput = this.#editView.querySelector(".titelinput");
        const dateinput = this.#editView.querySelector(".dateinput");
        const storyinput = this.#editView.querySelector(".storyinput");
        const fileinput = this.#editView.querySelector("#sampleFile");

        const content = storyinput.innerHTML;

        if(fileinput.files.length > 0){
            let file = fileinput.files[0];
            let formData = new FormData();

            formData.append("sampleFile", file)

            try {
                let repsonse = await this.#networkManager.doFileRequest("/upload", "POST", formData);
                fileinput.value = "";
                this.previousImage = `/uploads/${repsonse.fileName}`;
            } catch (e) {
                console.error(e);
            }
        }

        let commentsenabled = 0;
        let storytype = "instantie";

        if(document.querySelector(".commentyes")){
            commentsenabled = 1;
        }

        if(document.querySelector(".active-tag-user")){
            storytype = "verhaal"
        }

        try {
            await this.#editRepository.update(this.#session, titelinput.value, storytype, dateinput.value, content, this.previousImage, lastNumber, commentsenabled );
            App.loadController(App.CONTROLLER_MYPOSTS);
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * Function to fetch a post.
     * @param {string} lastNumber - The last number in the URL.
     */
    async #fetchPost(lastNumber) {
        let titelinput = this.#editView.querySelector(".titelinput");
        let dateinput = this.#editView.querySelector(".dateinput");
        let storyinput = this.#editView.querySelector(".storyinput");
        let imagepreview = this.#editView.querySelector(".image-preview");

        try {
            let data = await this.#editRepository.getPost(lastNumber);
            let length = data[0].plaatje.length;
            titelinput.value = data[0].onderwerp;
            if(length > 0){
                this.previousImage = data[0].plaatje;
            }
            let datumreceived = data[0].publicatieDatum;
            let date = new Date(datumreceived);
            let year = date.getUTCFullYear();
            let month = date.getUTCMonth() + 1;
            let day = date.getUTCDate();
            dateinput.value = `${year}-${month}-${day}`;
            storyinput.innerHTML = data[0].verhaal;
            imagepreview.src = this.previousImage;

            if(data[0].reactiesMogelijk){
                document.querySelector("#yes").classList.add("commentyes");
            } else {
                document.querySelector("#no").classList.add("commentno");
            }

            if(data[0].typePost == "instantie"){
                document.querySelector(".instantietag").classList.add("active-tag-instantie");
            } else {
                document.querySelector(".gebruikertag").classList.add("active-tag-user");
            }
        } catch (error) {
            console.log(error);
        }
    }
}
