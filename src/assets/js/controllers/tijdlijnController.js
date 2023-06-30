/**
 * Controller for the timeline, to integrate the timeline with the welcome page and show data from the database in the timeline.
 * @author Kifleyesus Musgun Sium
 */
import { Controller } from "./controller.js";
import { TijdlijnRepository } from "../repositories/tijdlijnRepository.js";
import { AccountSettingsRepository } from "../repositories/accountSettingsRepository.js";
import { App } from "../app.js";
import {TijdlijnRodinRepository} from "../repositories/tijdlijnRodinRepository.js";

export class TijdlijnController extends Controller {
    #tijdlijnView;
    #tijdlijnRepository;
    #accountSettingsRepository;
    #rodinTimelineRepository
    #app;

    constructor() {
        super();
        this.#tijdlijnRepository = new TijdlijnRepository();
        this.#rodinTimelineRepository = new TijdlijnRodinRepository();
        this.#accountSettingsRepository = new AccountSettingsRepository();
        this.#app = App;
        this.#initializeView();
    }

    /**
     * Initializes the timeline view and fetches the stories.
     * @private
     */
    async #initializeView() {
        this.#tijdlijnView = await super.loadHtmlIntoContent("html_views/tijdlijn.html");
        // this.#getStories();
        this.#addStoriesPerMonth();
    }

    async #addStoriesPerMonth() {
        const storiesPerMonth = await this.#rodinTimelineRepository.getStoriesPerMonth();
        const container = document.querySelector('.timeline');

        for (let i = 0; i < storiesPerMonth.length; i++) {
            const story = storiesPerMonth[i];
            const isEven = i % 2 === 0;
            const date = new Date(story.jaartalGebeurtenis);
            const monthDate = date.toLocaleString('default', {month: "long"})
            const monthFormat = monthDate.charAt(0).toUpperCase() + monthDate.slice(1);
            const month = `${monthFormat}/${date.toLocaleString('default', {year: "numeric"})}`

            // Create the HTML elements
            const div = document.createElement('div');
                div.addEventListener("click", () => {
                    App.loadController(App.CONTROLLER_VERHALEN, {month: date.getMonth() + 1})
                })

                div.classList.add("containertijdlijn", isEven ? "left-container" : "right-container")
                div.innerHTML = `
                <div class="text-box">
                    <div class="profile-image">
                        <img src="/assets/images/RoccoStar.png" alt="User Profile Image">
                    </div>
                    <div class="content">
                        <h2>${month}</h2>
                        <small>${story.gebruikersnaam}, heeft recent een verhaal geplaatst op dit tijdstip</small>
                        <p><br>Bekijk alle verhalen -></p>
                    </div>
                </div>
            `;

            // Append the element to the container
            container.appendChild(div);
        }
    }




    /**
     * Retrieves the stories from the repository.
     * @private
     */
    async #getStories() {
        let dates = window.location.hash.replace("#tijdlijn/", "").split("/");
        const data = await this.#tijdlijnRepository.getStory(dates[0], dates[1]);
        console.log(data)

        for (let i = 0; i < data.result.length; i++) {
            let soort = data.result[i].soortBericht;

            let storygradient = "verhaal-gradient";
            switch (soort) {
                case "bulletin":
                    storygradient = "bulletin-gradient";
                    break;

                case "instantie":
                    storygradient = "instantie-gradient";
                    break;
            }

            const likes = data.result[i].aantalLikes;
            const dislikes = data.result[i].aantalDislikes;
            const difference = likes - dislikes;

            const tienProcent = (10 / 100) * (likes + dislikes);
            const vijftienProcent = (15 / 100) * (likes + dislikes);
            const twentigProcent = (20 / 100) * (likes + dislikes);
            const vijftigProcent = (50 / 100) * (likes + dislikes);

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

            if (data.result[i].persoon === 0) {
                story.classList.add("instantieStory");
            } else {
                story.classList.add("persoonstory");
            }

            // Redirects the user to the read page when the container is clicked
            story.addEventListener("click", () => {
                window.location = "http://localhost:3000/#read/" + data.result[i].id;
            });

            container.appendChild(story);

            // Div for the image
            const divImage = document.createElement("div");
            divImage.className = "image";
            story.appendChild(divImage);

            // Image for profile inside container
            const image = document.createElement("img");
            image.alt = "Avatar";
            image.className = "trendingimage";
            image.src = "../assets/img/petje.jpg";
            divImage.appendChild(image);

            // Text-box for story
            const text = document.createElement("div");
            text.className = "text";
            story.appendChild(text);

            // Div for text-info
            const textInfo = document.createElement("div");
            textInfo.className = "text-info";
            text.appendChild(textInfo);

            // H2 for the date
            const date = document.createElement("h2");
            date.className = "gebeurtenis";
            date.innerHTML = postDay.slice(0, 10);
            textInfo.appendChild(date);

            // Title for the story
            const title = document.createElement("p");
            title.className = "story-title";
            title.innerHTML = data.result[i].onderwerp;
            textInfo.appendChild(title);

            // Story text
            const storyText = document.createElement("p");
            storyText.className = "story-text";
            storyText.innerHTML = data.result[i].bericht;
            textInfo.appendChild(storyText);

            // Div for the Icons, child of story div
            const icons = document.createElement("div");
            icons.className = "icons";
            story.appendChild(icons);

            // Div for the type of the icon
            const iconType = document.createElement("div");
            iconType.className = "trending";
            icons.appendChild(iconType);

            // The type of the icon depends on the number of likes of the story
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

            // Div for readme icon
            const readme = document.createElement("div");
            readme.className = " readme";
            icons.appendChild(readme);

            // Icon for readme
            const readmeIcon = document.createElement("i");
            readmeIcon.className = "bi bi-arrow-right gonext";
            readme.appendChild(readmeIcon);

            // Div for the number of likes/dislikes
            const differentialLikes = document.createElement("div");
            differentialLikes.className = "iconsadd";
            story.appendChild(differentialLikes);

            // Holder div for differentialLikes
            const iconnumber = document.createElement("div");
            iconnumber.className = "iconnumber";
            differentialLikes.appendChild(iconnumber);

            // P for the real differentialLikes
            const likeDifference = document.createElement("p");
            if (difference > 0) {
                likeDifference.innerHTML = "+" + difference;
            } else {
                likeDifference.innerHTML = difference;
            }
            iconnumber.appendChild(likeDifference);

            // Arrow
            const arrow = document.createElement("div");
            if (i % 2 === 0) {
                arrow.className = "right-container-arrow";
            } else {
                arrow.className = "left-container-arrow";
            }
            differentialLikes.appendChild(arrow);
        }

        let length = data.result.length;
        document.styleSheets[0].addRule(
            "div.timeline:after",
            `animation: moveline ${length}s linear forwards`
        );
    }
}
