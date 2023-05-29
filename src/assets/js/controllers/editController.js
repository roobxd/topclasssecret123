/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
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

    constructor() {
        super();
        this.#networkManager = new NetworkManager();
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

        this.#editView.querySelector("#sampleFile").addEventListener("change", () => this.#imagePreview());
    }

    #imagePreview(){
        let input = this.#editView.querySelector("#sampleFile");
        const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                const imagePreview = document.querySelector(".image-preview");
                const selectorIcon = document.querySelector(".image-icon");
                reader.addEventListener("load", function () {
                    // Convert image file to Base64 string
                    imagePreview.src = reader.result;
                    selectorIcon.style.display = "none";
                });
        
                reader.readAsDataURL(file);
            }
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
        event.preventDefault();
        
        const titelinput = this.#editView.querySelector(".titelinput");
        const dateinput = this.#editView.querySelector(".dateinput");
        const storyinput = this.#editView.querySelector(".storyinput");
        const fileinput = this.#editView.querySelector("#sampleFile");

        const content = storyinput.innerHTML;

        if(fileinput.files.length > 0){
            //TODO: you should add validation to check if an actual file is selected
            let file = fileinput.files[0];
            let formData = new FormData();

            let fileName = file.name; // Extract the file name from the uploaded file
            let imagePath = `/img/${fileName}`; // Example: Assuming 'uploads' is the directory where you store the images


            //set "sampleFile" as key, we read this key in de back-end
            formData.append("sampleFile", file)

            try {
                let repsonse = await this.#networkManager.doFileRequest("/upload", "POST", formData);

                //here we know file upload is successful, otherwise would've triggered catch
                fileinput.value = "";

                // Set imagePath to the uploaded file path
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
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */
    async #fetchPost(lastNumber) {
        let storyPlaatje = this.#editView.querySelector(".story-plaatje");
        let titelinput = this.#editView.querySelector(".titelinput");
        let dateinput = this.#editView.querySelector(".dateinput");
        let storyinput = this.#editView.querySelector(".storyinput");
        let fileinput = this.#editView.querySelector("#sampleFile");
        let imagepreview = this.#editView.querySelector(".image-preview");

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#editRepository.getPost(lastNumber);
            let length = data[0].plaatje.length;
            titelinput.value = data[0].onderwerp;
            if(length > 0){
                this.previousImage = data[0].plaatje;
            }
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

            if(length > 0){
                imagepreview.src= this.previousImage;
                let selectorIcon = document.querySelector(".image-icon");
                selectorIcon.style.display = "none";
            }

            imagepreview.src= this.previousImage;
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            // exampleResponse.innerHTML = e;
        } }
            //for now just show every error on page, normally not all errors are appropriate for user
            //exampleResponse.innerHTML = e;
        }
