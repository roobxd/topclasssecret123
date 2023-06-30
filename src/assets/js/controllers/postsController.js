/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import { Controller } from "./controller.js";
import { PostsRepository } from "../repositories/postsRepository.js";
import { NetworkManager } from "../framework/utils/networkManager.js";


export class PostsController extends Controller {
    #postsRepository;
    #welcomeView;
    #networkManager
    #session;

    constructor() {
        super();
        this.#networkManager = new NetworkManager();
        this.#postsRepository = new PostsRepository();
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
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/posts.html")

        // this.#fetchPosts();
        const date = new Date(new URLSearchParams(window.location.hash.slice(1).split('?')[1]).get("date"));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        this.#welcomeView.querySelector(".dateinput").value = formattedDate
        this.#welcomeView.querySelector(".bold").addEventListener("click", () => document.execCommand("bold", false, null));
        this.#welcomeView.querySelector(".italic").addEventListener("click", () => document.execCommand("italic", false, null));
        this.#welcomeView.querySelector(".underline").addEventListener("click", () => document.execCommand("underline", false, null));
        this.#welcomeView.querySelector(".strikethrough").addEventListener("click", () => document.execCommand("strikeThrough", false, null));

        let nobutton = document.querySelector("#no");
        nobutton.classList.add("commentno");

        this.#welcomeView.querySelector("#no").addEventListener("click", () => this.#toggleCommentsNo());
        this.#welcomeView.querySelector("#yes").addEventListener("click", () => this.#toggleCommentsYes());

        this.#welcomeView.querySelector(".instantietag").addEventListener("click", () => this.#toggleInstantie());
        this.#welcomeView.querySelector(".gebruikertag").addEventListener("click", () => this.#toggleStory());

        this.#welcomeView.querySelector(".postbutton").addEventListener("click", (event) => this.#savePost(event));

        this.#welcomeView.querySelector("#sampleFile").addEventListener("change", () => this.#imagePreview());

        var storyInput = document.querySelector('.storyinput');

        storyInput.addEventListener('keyup', function () {
            this.dataset.divPlaceholderContent = this.textContent;
        });

    }

    #imagePreview(){
        let input = this.#welcomeView.querySelector("#sampleFile");
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


    async #savePost(event) {
        event.preventDefault();

        const titelinput = this.#welcomeView.querySelector(".titelinput");
        const dateinput = this.#welcomeView.querySelector(".dateinput");
        const storyinput = this.#welcomeView.querySelector(".storyinput");
        const fileinput = this.#welcomeView.querySelector("#sampleFile");
        const content = storyinput.innerHTML;
        let commentsenabled = 0;
        let storytype = "instantie";

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
            imagePath = `/uploads/${repsonse.fileName}`;
        } catch (e) {
            console.error(e);
        }

        if(document.querySelector(".commentyes")){
            commentsenabled = 1;
        }

        if(document.querySelector(".active-tag-user")){
            storytype = "verhaal"
        }

        try {
            await this.#postsRepository.create(this.#session, titelinput.value, storytype, dateinput.value, content, imagePath, commentsenabled );
            App.loadController(App.CONTROLLER_WELCOME);
        } catch (error) {
            console.log(error);
        }

    }
}
