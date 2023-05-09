/**
 * Controller for the timeline, to integrate the timeline with welcome page and show data from database in the timeline.
 */
import {Controller} from "./controller.js";
import {TijdlijnRepository} from "../repositories/tijdlijnRepository.js";

export class TijdlijnController extends Controller {
    #tijdlijnView;
    #tijdlijnRepository;

    constructor() {
        super();
        this.#tijdlijnRepository = new TijdlijnRepository();
        this.#initializeView();

    }

    async #initializeView() {
        // ;
        // 1.
        this.#tijdlijnView = await super.loadHtmlIntoContent("html_views/tijdlijn.html");
        this.#getStories();

        console.log(this.#tijdlijnView);
        this.#tijdlijnView.onclick = function () {
            this.#getStories();
        }


    }


    async #getStories() {
        console.log(" Het is loaded!");
        console.log("Hallo");
        // data
        const data = await this.#tijdlijnRepository.getStory();
        console.log(data.result);

        // animation time length for timeline
        // this.#tijdlijnView.querySelector(".timeline").style.animation = "moveline" +  data.result.length + "s linear forwards;"

        for (let i = 0; i < data.result.length; i++) {
            // Content container includes profiel img, date and story. Container is appended in .timeline
            const container = document.createElement("div");
            if (i % 2 === 0){
                container.className = "container right-container";
            } else {
                container.className = "container left-container";
            }

            this.#tijdlijnView.querySelector(".timeline").appendChild(container);

            // Image for profile inside container
            const image = document.createElement("img");
            image.alt = "Avatar";
            image.className = "avatar";
            image.src = "../assets/img/guus.jpg";
            container.appendChild(image);

            // Text-box for stroy
            const textBox = document.createElement("div");
            textBox.className = "text-box";
            container.appendChild(textBox);

            // title for the story
            const title = document.createElement("h2");
            title.className = "title";
            title.innerHTML = data.result[i].onderwerp
            textBox.appendChild(title);

            // date
            const date = document.createElement("small");
            date.className = "gebeurtenis";
            date.innerHTML = data.result[i].jaartalGebeurtenis;
            textBox.appendChild(date);

            // story
            const story = document.createElement("p");
            story.className = "story";
            story.innerHTML = data.result[i].bericht;
                textBox.appendChild(story);

            // arrow
            const arrow = document.createElement("span");
            if(i % 2 === 0 ){
                arrow.className = "right-container-arrow";
            } else {
                arrow.className = "left-container-arrow";
            }
            textBox.appendChild(arrow);
        }




    }
}