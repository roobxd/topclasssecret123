/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { PostsRepository } from "../repositories/postsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import {VerificatieRepository} from "../repositories/verificatieRepository.js";

export class WelcomeController extends Controller {
    #PostsRepository
    #welcomeView
    #verificatieRepository


    constructor() {
        super();
        this.#PostsRepository = new PostsRepository();
        this.#verificatieRepository = new VerificatieRepository();

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
        const mail = App.sessionManager.get("email");
        const statusGebruiker = await this.#verificatieRepository.verifierResult(mail)

        if (statusGebruiker[0].verificatie === 0){
            App.loadController(App.CONTROLLER_VERIFIEERACCOUNT)
        }

        //from here we can safely get elements from the view via the right getter
        // this.#welcomeView.querySelector("span.name").innerHTML = App.sessionManager.get("email");

        this.#welcomeView.querySelector(".toonmeer").addEventListener("click", event => App.loadController(App.CONTROLLER_BULLETIN));

        // values of the dates
        let beginDate = this.#welcomeView.querySelector("#beginDatum");
        let endDate = this.#welcomeView.querySelector("#eindDatum");
        let timelineContext = this.#welcomeView.querySelector(".timelineContext");

        this.#welcomeView.querySelector(".bekijken").onclick = function () {


            if (!beginDate.value || !endDate.value) {
                console.log('Input type date is empty');
               timelineContext.innerHTML = "Begin en eind datum moet allebei ingevuld worden!";
            } else {
                console.log('Input type date is NOT empty');
                timelineContext.innerHTML = "Top, begin en eind datum zijn gekozen!";
                window.location.href = `#tijdlijn/${beginDate.value}/${endDate.value}`;
                console.log(beginDate.value)
                console.log(endDate.value);


            }

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
            let last4stories = data.slice(-4);
            last4stories.reverse().forEach(story => {
                let stitel = story.onderwerp;
                let scontent = story.bericht;
                let sid = story.id;
                this.#createCard(stitel, scontent, sid);
            });
        } catch (e) {
            console.log("error while fetching posts: ", e);
        }
    }


    async #createCard(stitel, scontent, sid){
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

        const targetElement = document.querySelector(".story-container-welcome");
        story.addEventListener("click", ()=>{
            window.location = "http://localhost:3000/#read/" + sid
        })
        targetElement.appendChild(story);
    }
}