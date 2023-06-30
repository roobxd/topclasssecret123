/**
Responsible for handling the actions happening on the welcome view.
It retrieves data from repositories and interacts with the app.
@class
@extends Controller
@author Rocco van Baardwijk
*/

import { PostsRepository } from "../repositories/postsRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { VerificatieRepository } from "../repositories/verificatieRepository.js";
import { BulletinRepository } from "../repositories/bulletinRepository.js";

export class WelcomeController extends Controller {
    #PostsRepository
    #welcomeView
    #verificatieRepository
    #BulletinRepository

    constructor() {
        super();
        this.#PostsRepository = new PostsRepository();
        this.#verificatieRepository = new VerificatieRepository();
        this.#BulletinRepository = new BulletinRepository();
        this.#setupView();
    }

    /**
     * Sets up the welcome view and initializes the required actions.
     * @private
     */
    async #setupView() {
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/welcome.html")

        const buttonrodin = document.querySelector("button.rodin-button");
        this.#welcomeView.querySelector("button.rodin-button").addEventListener("click", event => this.#handleRedirect());
        console.log(buttonrodin)
        try {
            this.#checkVerification;
        } catch (error) {
            console.log("Not redirecting to verification since you aren't logged in...")
        }

        this.#welcomeView.querySelector(".toonmeer").addEventListener("click", event => App.loadController(App.CONTROLLER_BULLETIN));

        let beginDate = this.#welcomeView.querySelector("#beginDatum");
        let endDate = this.#welcomeView.querySelector("#eindDatum");
        let timelineContext = this.#welcomeView.querySelector(".timelineContext");

        this.#welcomeView.querySelector(".bekijken").onclick = function () {
            if (!beginDate.value || !endDate.value) {
                timelineContext.style.color = "red";
                timelineContext.innerHTML = "Begin en eind datum moeten allebei ingevuld worden!";
            } else if (beginDate.value >= endDate.value){
                timelineContext.style.color = "yellow";
                timelineContext.innerHTML = "Begin datum kan niet na eind datum liggen!";
            }else {
                console.log('Input type date is NOT empty');
                timelineContext.innerHTML = "Top, begin en eind datum zijn gekozen!";
                window.location.href = `#tijdlijn/${beginDate.value}/${endDate.value}`;
                console.log(beginDate.value)
                console.log(endDate.value);
            }
        }

        this.#fetchPosts();
        this.#fetchBulletinPosts();
    }

    #handleRedirect() {
        event.preventDefault();
        App.loadController(App.CONTROLLER_TIJDLIJN);
        console.log("gelukt")
    }

    /**
     * Checks the verification status of the user and redirects if necessary.
     * @private
     */
    async #checkVerification() {
        const mail = App.sessionManager.get("email");

        try{
            const statusGebruiker = await this.#verificatieRepository.verifierResult(mail)

            if (statusGebruiker[0].verificatie === 0) {
                App.loadController(App.CONTROLLER_VERIFIEERACCOUNT)
            }
        } catch (e) {
            console.log(reason)
        }
    }

    /**
     * Fetches the latest posts and displays them on the welcome view.
     * @private
     */
    async #fetchPosts() {
        const storyTitel = this.#welcomeView.querySelector(".story-titel");
        const storyTekst = this.#welcomeView.querySelector(".story-text");

        try {
            let data = await this.#PostsRepository.getAll();
            let last4stories = data.slice(-4);
            last4stories.reverse().forEach(story => {
                let stitel = story.onderwerp;
                let storyBericht = story.bericht;
                let scontent = storyBericht.substring(0, 160) + "....";
                let sid = story.id;
                let soort = story.soortBericht;
                let imagepath = story.plaatje;
                try {
                    this.#createCard(stitel, scontent, sid, soort, imagepath);
                } catch (e) {
                    console.log(reason)
                }
            });
        } catch (e) {
            console.log("error while fetching posts: ", e);
        }
    }

    /**
     * Creates a card element and adds it to the welcome view.
     * @param {string} stitel - The title of the story.
     * @param {string} scontent - The content of the story.
     * @param {number} sid - The ID of the story.
     * @param {string} soort - The type of the story.
     * @param {string} imagepath - The path to the story's image.
     * @private
     */
    async #createCard(stitel, scontent, sid, soort, imagepath) {
        const story = document.createElement('div');
        let storygradient = "verhaal-gradient";
        switch (soort) {
            case "bulletin":
                storygradient = "bulletin-gradient"
                break;

            case "instantie":
                storygradient = "instantie-gradient"
                break;
        }
        story.className = 'story one ' + storygradient;

        try{
            const image = document.createElement('div');
            image.className = 'image';

            const img = document.createElement('img');
            img.className = 'trendingimage';
            img.src = imagepath;
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
            story.addEventListener("click", () => {
                window.location = "http://localhost:3000/#read/" + sid
            })
            targetElement.appendChild(story);
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Fetches the latest bulletin posts and displays them on the welcome view.
     * @private
     */
    async #fetchBulletinPosts() {
        try {
            const dataBulletin = await this.#BulletinRepository.getAll();
            const bulletinPosts = dataBulletin.filter(bulletin => bulletin.soortBericht === 'bulletin');
            const laatste3bulletin = bulletinPosts
                .sort((a, b) => new Date(b.publicatieDatum) - new Date(a.publicatieDatum))
                .slice(0, 3);
            const bulletinsList = document.querySelector('.bulletpoints');
            const datesList = document.querySelector('.dates');

            const options = {year: 'numeric', month: 'long', day: 'numeric'};

            laatste3bulletin.forEach(bulletin => {
                const btitel = bulletin.onderwerp;
                const bdatum = bulletin.publicatieDatum;

                const titleItem = document.createElement('li');
                titleItem.textContent = btitel;
                bulletinsList.appendChild(titleItem);

                const dateItem = document.createElement('li');
                const formattedDate = new Date(bdatum).toLocaleDateString(undefined, options);
                dateItem.textContent = formattedDate;
                datesList.appendChild(dateItem);
            });
        } catch (e) {
            console.log("error while fetching bulletin: ", e);
        }
    }
}