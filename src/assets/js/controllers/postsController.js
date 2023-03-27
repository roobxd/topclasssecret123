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

    constructor() {
        super();
        this.#postsRepository = new PostsRepository();
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
        //this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("email");

        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchPosts();

        this.#welcomeView.querySelector(".submitbutton").addEventListener("click", (event) => this.#savePost(event));
    }


    async #savePost(event) {
        const subject = this.#welcomeView.querySelector("#subject");
        const jaartal = this.#welcomeView.querySelector("#jaartal");
        const typeOfPost = this.#welcomeView.querySelector("#typeOfPost");
        const post = this.#welcomeView.querySelector("#post");
        const sampleFile = this.#welcomeView.querySelector("#sampleFile");

        //console.log(subject.value + " " + year.value + " " + typeOfPost.value + " " + post.value)

        try {
            await this.#postsRepository.create(subject.value, jaartal.value, typeOfPost.value, post.value, sampleFile.value );
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
    async #fetchPosts() {
        const storyTitel = this.#welcomeView.querySelector(".story-titel");
        const storyTekst = this.#welcomeView.querySelector(".story-tekst");

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#postsRepository.getAll();
            console.log(data);
        } catch (e) {
            console.log("error while fetching rooms", e);


            //for now just show every error on page, normally not all errors are appropriate for user
            //exampleResponse.innerHTML = e;
        }
    }
}