/**
 * Controller for the timeline, to integrate the timeline with welcome page and show data from database in the timeline.
 */
import {Controller} from "./controller.js";
import {TijdlijnRepository} from "../repositories/tijdlijnRepository.js";
import {AccountSettingsRepository} from "../repositories/accountSettingsRepository.js";
import {App} from "../app.js";

export class TijdlijnController extends Controller {
    #tijdlijnView;
    #tijdlijnRepository;
    #accountSettingsRepository;
    #app

    constructor() {
        super();
        this.#tijdlijnRepository = new TijdlijnRepository();
        this.#accountSettingsRepository =  new AccountSettingsRepository();
        this.#app = App;
        this.#initializeView();
    }

    async #initializeView() {
        this.#tijdlijnView = await super.loadHtmlIntoContent("html_views/tijdlijn.html");
        this.#getStories();
    }

    async #getStories() {
        let session = App.sessionManager.get("id");
        let dates = window.location.hash.replace("#tijdlijn/", "").split("/");
        const data = await this.#tijdlijnRepository.getStory(dates[0], dates[1]);

        for (let i = 0; i < data.result.length; i++) {
            let soort = data.result[i].soortBericht;

            let storygradient = "verhaal-gradient";
            switch(soort) {
                case "bulletin":
                    storygradient = "bulletin-gradient"
                break;
    
                case "instantie":
                    storygradient = "instantie-gradient"
                break;
            }

            const likes = data.result[i].aantalLikes
            const dislikes = data.result[i].aantalDislikes
            const difference = likes - dislikes;

            const tienProcent = 10 / 100 * (likes + dislikes);
            const vijftienProcent = 15 / 100 * (likes + dislikes);
            const twentigProcent = 20 / 100 * (likes + dislikes);
            const vijftigProcent = 50 / 100 * (likes + dislikes);

            const postDay = data.result[i].jaartalGebeurtenis;
            const today = new Date();
            const postDateObj = new Date(postDay);
            const millisecondsInDay = 1000 * 60 * 60 * 24;

            const difference_in_time = today.getTime() - postDateObj.getTime();
            const difference_in_day = Math.floor(difference_in_time / millisecondsInDay);

            const container = document.createElement("div");
            if (i % 2 === 0) {
                container.className = "container right-container";
            } else {
                container.className = "container left-container";
            }

            this.#tijdlijnView.querySelector(".timeline").appendChild(container);

            const story = document.createElement("div");
            story.className = "story";
            story.classList.add("one");
            story.classList.add(storygradient);

            container.appendChild(story);

            story.addEventListener("click", () => {
                window.location.href = "/#read/" + data.result[0].story_id;
            })

            const divImage = document.createElement("div");
            divImage.className = "image";
            story.appendChild(divImage);

            const image = document.createElement("img");
            image.alt = "Avatar";
            image.className = "trendingimage";
            image.src = "../assets/img/petje.jpg";
            divImage.appendChild(image);

            const text = document.createElement("div");
            text.className = "text";
            story.appendChild(text);

            const textInfo = document.createElement("div");
            textInfo.className = "text-info";
            text.appendChild(textInfo);

            const date = document.createElement("h2");
            date.className = "gebeurtenis";
            date.innerHTML = postDay.slice(0, 10);
            textInfo.appendChild(date);

            const title = document.createElement("p");
            title.className = "story-title";
            title.innerHTML = data.result[i].onderwerp
            textInfo.appendChild(title);

            const storyText = document.createElement("p");
            storyText.className = "story-text";
            storyText.innerHTML = data.result[i].bericht;
            textInfo.appendChild(storyText);

            const icons = document.createElement("div");
            icons.className = "icons";
            story.appendChild(icons);

            const iconType = document.createElement("div");
            iconType.className = "trending";
            icons.appendChild(iconType);

            if (difference_in_day <= 7) {
                if (difference >= 0 && difference <= tienProcent) {
                    const heartIcon = document.createElement("i");
                    heartIcon.className = "bi bi-heart-fill heart";
                    iconType.appendChild(heartIcon);

                } else if (difference > tienProcent && difference <= twentigProcent) {
                    const graphIcon = document.createElement("i");
                    graphIcon.className = "bi bi-graph-up-arrow";
                    iconType.appendChild(graphIcon);

                } else if (difference >= vijftigProcent) {
                    const fireIcon = document.createElement("i");
                    fireIcon.className = "bi bi-fire trending";
                    iconType.appendChild(fireIcon);

                } else if (difference < 0) {
                    story.classList.replace("persoonstory", "unlikedStory");
                    const canIcon = document.createElement("i");
                    canIcon.className = "bi bi-trash3-fill trash";
                    iconType.appendChild(canIcon);
                } else {
                    const heartIcon = document.createElement("i");
                    heartIcon.className = "bi bi-heart-fill heart";
                    iconType.appendChild(heartIcon);
                }
            } else {
                if (difference >= 0 && difference <= tienProcent) {
                    const heartIcon = document.createElement("i");
                    heartIcon.className = "bi bi-heart-fill heart";
                    iconType.appendChild(heartIcon);

                } else if (difference > tienProcent && difference <= twentigProcent) {
                    const graphIcon = document.createElement("i");
                    graphIcon.className = "bi bi-graph-up-arrow";
                    iconType.appendChild(graphIcon);

                } else if (difference >= vijftigProcent) {
                    const fireIcon = document.createElement("i");
                    fireIcon.className = "bi bi-fire trending";
                    iconType.appendChild(fireIcon);

                } else if (difference < 0) {
                    story.classList.replace("persoonstory", "unlikedStory");
                    const canIcon = document.createElement("i");
                    canIcon.className = "bi bi-trash3-fill trash";
                    iconType.appendChild(canIcon);
                } else {
                    const heartIcon = document.createElement("i");
                    heartIcon.className = "bi bi-heart-fill heart";
                    iconType.appendChild(heartIcon);
                }
            }

            const readme = document.createElement("div")
            readme.className = " readme";
            icons.appendChild(readme);

            const readmeIcon = document.createElement("i");
            readmeIcon.className = "bi bi-arrow-right gonext";
            readme.appendChild(readmeIcon);

            const differentialLikes = document.createElement("div");
            differentialLikes.className = "iconsadd";
            story.appendChild(differentialLikes);

            const iconnumber = document.createElement("div");
            iconnumber.className = "iconnumber";
            differentialLikes.appendChild(iconnumber);

            const likeDifference = document.createElement("p");
            if (difference > 0) {
                likeDifference.innerHTML = "+" + difference;
            } else {
                likeDifference.innerHTML = difference;
            }
            iconnumber.appendChild(likeDifference);

            const arrow = document.createElement("div");
            if (i % 2 === 0) {
                arrow.className = "right-container-arrow";
            } else {
                arrow.className = "left-container-arrow";
            }
            differentialLikes.appendChild(arrow);
        }

        let length = data.result.length ;
        document.styleSheets[0].addRule('div.timeline:after', `animation: moveline ${length}s linear forwards`)
    }
}
