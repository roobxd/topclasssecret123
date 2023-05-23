/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { PostsRepository } from "../repositories/postsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class WelcomeController extends Controller {
    #PostsRepository
    #welcomeView

    constructor() {
        super();
        this.#PostsRepository = new PostsRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/welcome.html")


        //from here we can safely get elements from the view via the right getter
        // this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("email");

        this.#welcomeView.querySelector(".toonmeer").addEventListener("click", event => App.loadController(App.CONTROLLER_BULLETIN));

        // values of the dates
        let beginDate = this.#welcomeView.querySelector("#beginDatum");
        let endDate = this.#welcomeView.querySelector("#eindDatum");



        if (!beginDate || !endDate) {
            console.log('Input type date is empty');
            this.#welcomeView.querySelector(".timelineContext").innerHTML = "Begin en eind datum moet allebei ingevuld worden!";
        } else {
            console.log('Input type date is NOT empty');
            this.#welcomeView.querySelector(".timelineContext").innerHTML = "Top, begin en eind datum zijn gekozen!";
            // setTimeout(this.#welcomeView.querySelector(".timelineContext").innerHTML = "eyyyyyyyyy", 30000)
        this.#welcomeView.querySelector(".bekijken").onclick = function () {
                    window.location.href = `#tijdlijn/${beginDate.value}/${endDate.value}`;
                    console.log(beginDate.value)
                    console.log(endDate.value);

                };
        }







        //for demonstration a hardcoded room id that exists in the database of the back-end
        this.#fetchPosts();

        // Show the time-line page when it is clicked in welcome page.
        // this.#welcomeView.querySelector(".bekijken").addEventListener("click", event => App.loadController(App.CONTROLLER_TIJDLIJN));

    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */

    async #fetchPosts() {
        const storyTitel = this.#welcomeView.querySelector(".story-titel");
        const storyTekst = this.#welcomeView.querySelector(".story-text");

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#PostsRepository.getAll();
            let length = data.length - 1;
            let last4stories = data.slice(-4);
            last4stories.reverse().forEach(story => {
                let stitel = story.onderwerp;
                let scontent = story.bericht;
                this.#createCard(stitel, scontent);
            });
            // storyTitel.innerHTML = data[length].onderwerp;
            // storyTekst.innerHTML = data[length].bericht;

            console.log(data);
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            // exampleResponse.innerHTML = e;
        }
    }


    async #createCard(stitel, scontent){
        const story = document.createElement('div');
        story.className = 'story one persoonstory';

        const image = document.createElement('div');
        image.className = 'image';

        const img = document.createElement('img');
        img.className = 'trendingimage';
        img.src = '/assets/img/guus.jpg';
        img.alt = '';

        image.appendChild(img);

        const text = document.createElement('div');
        text.className = 'text';

        const textInfo = document.createElement('div');
        textInfo.className = 'text-info';

        const title = document.createElement('p');
        title.className = 'story-titel';
        title.textContent = stitel;

        const content = document.createElement('p');
        content.className = 'story-text';
        content.innerHTML = scontent;

        textInfo.appendChild(title);
        textInfo.appendChild(content);

        text.appendChild(textInfo);

        const icons = document.createElement('div');
        icons.className = 'icons';

        const trending = document.createElement('div');
        trending.className = 'trending';

        const trendingIcon = document.createElement('i');
        trendingIcon.className = 'bi bi-fire trending';

        trending.appendChild(trendingIcon);

        const readme = document.createElement('div');
        readme.className = 'readme';

        const readmeIcon = document.createElement('i');
        readmeIcon.className = 'bi bi-arrow-right gonext';

        readme.appendChild(readmeIcon);

        icons.appendChild(trending);
        icons.appendChild(readme);

        const iconsadd = document.createElement('div');
        iconsadd.className = 'iconsadd';

        const iconnumber = document.createElement('div');
        iconnumber.className = 'iconnumber';

        const iconnumberText = document.createElement('p');
        iconnumberText.textContent = '+19';

        iconnumber.appendChild(iconnumberText);

        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';

        iconsadd.appendChild(iconnumber);
        iconsadd.appendChild(emptyDiv);

        story.appendChild(image);
        story.appendChild(text);
        story.appendChild(icons);
        story.appendChild(iconsadd);

        const targetElement = document.querySelector(".story-container");
        targetElement.appendChild(story);
    }
}