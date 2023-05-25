/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { App } from "../app.js";
import { Controller } from "./controller.js";
import { PostsRepository } from "../repositories/postsRepository.js";

export class PostsController extends Controller {
    #postsRepository;
    #welcomeView;
    #PostsRepository;
    #session;

    constructor() {
        super();
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

        //from here we can safely get elements from the view via the right getter
        // this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("email");

        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchPosts();

        this.#welcomeView.querySelector(".bold").addEventListener("click", () => document.execCommand("bold", false, null));
        this.#welcomeView.querySelector(".italic").addEventListener("click", () => document.execCommand("italic", false, null));
        this.#welcomeView.querySelector(".underline").addEventListener("click", () => document.execCommand("underline", false, null));
        this.#welcomeView.querySelector(".strikethrough").addEventListener("click", () => document.execCommand("strikeThrough", false, null));

        let nobutton = document.querySelector("#no");
        nobutton.classList.add("commentno");

        this.#welcomeView.querySelector("#no").addEventListener("click", () => this.#toggleCommentsNo());
        this.#welcomeView.querySelector("#yes").addEventListener("click", () => this.#toggleCommentsYes());

        this.#welcomeView.querySelector(".storyinput").addEventListener('input', () => {
            // Get the HTML content of the editor
            //const content = editor.innerHTML;

            // Do something with the HTML content (e.g. save it to a database)
            //console.log(html);
        });

        this.#welcomeView.querySelector(".postbutton").addEventListener("click", (event) => this.#savePost(event));
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


    async #savePost(event) {
        const titelinput = this.#welcomeView.querySelector(".titelinput");
        const dateinput = this.#welcomeView.querySelector(".dateinput");
        const storyinput = this.#welcomeView.querySelector(".storyinput");
        const fileinput = this.#welcomeView.querySelector("#fileinput");
        const content = storyinput.innerHTML;

        if(document.querySelector(".commentyes")){
            try {
                await this.#postsRepository.create(this.#session, titelinput.value, dateinput.value, content, fileinput.value, 1 );
                alert("Uw verhaal is geplaatst!");
            } catch (error) {
                console.log(error);
            }
        } else{
            try {
                await this.#postsRepository.create(this.#session, titelinput.value, dateinput.value, content, fileinput.value, 0 );
                alert("Uw verhaal is geplaatst!");
            } catch (error) {
                console.log(error);
            }
        }

    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */
    async #fetchPosts() {
        const storyPlaatje = this.#welcomeView.querySelector(".story-plaatje");


        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#PostsRepository.getAll();
            let length = data.length - 1;
            storyPlaatje.innerHTML = data[length].sampleFile;
            console.log(data);
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            // exampleResponse.innerHTML = e;
        } }
            //for now just show every error on page, normally not all errors are appropriate for user
            //exampleResponse.innerHTML = e;
        }
