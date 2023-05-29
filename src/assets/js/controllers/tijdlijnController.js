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
        // ;
        // 1.
        this.#tijdlijnView = await super.loadHtmlIntoContent("html_views/tijdlijn.html");
        this.#getStories();

        console.log(this.#tijdlijnView);


    }


    async #getStories() {

        let session = App.sessionManager.get("id");

        // event.preventDefault();
        console.log(" Het is loaded!");
        console.log("Hallo");


        // data

        // if(!(beginDate.length ===0 && enddate.length === 0)){
        console.log(window.location.hash.replace("#tijdlijn/", ""))
        let dates = window.location.hash.replace("#tijdlijn/", "").split("/");
        console.log(dates);

        const data = await this.#tijdlijnRepository.getStory(dates[0], dates[1]);

        for (let i = 0; i < data.result.length; i++) {
            console.log("Is gebruiker persoon of instantie: ")
            console.log(data.result[i].persoon);

            /*
            Some important calculations for likes and trend would be first calculated
             */

            // difference of likes and dislikes
            const likes = data.result[i].aantalLikes
            const dislikes = data.result[i].aantalDislikes
            const difference = likes - dislikes;

            const tienProcent = 10 / 100 * (likes + dislikes);
            console.log("10%: " + tienProcent);
            const vijtienProcent = 15 / 100 * (likes + dislikes);
            console.log("15%: " + vijtienProcent)
            const twentigProcent = 20 / 100 * (likes + dislikes);
            console.log("20%: " + twentigProcent)
            const vijftigProcent = 50 / 100 * (likes + dislikes);
            console.log("50%: " + vijftigProcent)



            // the difference between the day of post and of today, in order to determine trending post
            const postDay = data.result[i].jaartalGebeurtenis;
            const today = new Date();
            const postDateObj = new Date(postDay);
            const millisecondsInDay = 1000 * 60 * 60 * 24;

            const difference_in_time = today.getTime() - postDateObj.getTime();
            const difference_in_day = Math.floor(difference_in_time / millisecondsInDay);


            console.log("Days: " + difference_in_day)
            // Content container includes profiel img, date and story. Container is appended in .timeline
            const container = document.createElement("div");
            if (i % 2 === 0) {
                container.className = "container right-container";
            } else {
                container.className = "container left-container";
            }

            this.#tijdlijnView.querySelector(".timeline").appendChild(container);

            // a div for specific type of stroy based on the likes and/or type of the customer
            const story = document.createElement("div");
            story.className = "story";
            story.classList.add("one");
            if (data.result[i].persoon === 0 ){
                story.classList.add("instantieStory");

            } else {
                story.classList.add("persoonstory");
            }
            // if the container is clicked, the user would be directed to read page
            story.addEventListener("click", ()=>{
                window.location = "http://localhost:3000/#read/" + data.result[i].id;
            })
            // story is child of container
            container.appendChild(story);

            // div for the image
            const divImage = document.createElement("div");
            divImage.className = "image";
            story.appendChild(divImage);

            // Image for profile inside container
            const image = document.createElement("img");
            image.alt = "Avatar";
            image.className = "trendingimage";
            image.src = "../assets/img/petje.jpg";
            divImage.appendChild(image);

            // Text-box for stroy
            const text = document.createElement("div");
            text.className = "text";
            story.appendChild(text);

            // div for text-info
            const textInfo = document.createElement("div");
            textInfo.className = "text-info";
            text.appendChild(textInfo);

            // h2 for the date
            const date = document.createElement("h2");
            date.className = "gebeurtenis";
            date.innerHTML = postDay.slice(0, 10);
            textInfo.appendChild(date);


            // title for the story
            const title = document.createElement("p");
            title.className = "story-title";
            title.innerHTML = data.result[i].onderwerp
            textInfo.appendChild(title);


            // story - text
            const storyText = document.createElement("p");
            storyText.className = "story-text";
            storyText.innerHTML = data.result[i].bericht;
            textInfo.appendChild(storyText);

            // div for the Icons, is child of story div
            const icons = document.createElement("div");
            icons.className = "icons";
            story.appendChild(icons);

            // div for the type of the icon
            const iconType = document.createElement("div");
            iconType.className = "trending";
            icons.appendChild(iconType);

            // the type of the icon would be determined depending on the number of likes of the story
            if (difference_in_day <= 7) {
                console.log("Het is niet een week geweest")
                if (difference >= 0 && difference <= tienProcent) {
                    console.log("difference: " + difference + ", 10%: " + tienProcent)
                    // i for the icons
                    const heartIcon = document.createElement("i");
                    heartIcon.className = "bi bi-heart-fill heart";
                    iconType.appendChild(heartIcon);

                } else if (difference > tienProcent && difference <= twentigProcent) {
                    console.log("difference: " + difference + ", 20%: " + twentigProcent)

                    const graphIcon = document.createElement("i");
                    graphIcon.className = "bi bi-graph-up-arrow";
                    iconType.appendChild(graphIcon);

                } else if (difference >= vijftigProcent) {
                    console.log("difference: " + difference + ", 50%: " + vijftigProcent)

                    const fireIcon = document.createElement("i");
                    fireIcon.className = "bi bi-fire trending";
                    iconType.appendChild(fireIcon);

                } else if (difference < 0) {
                    console.log("difference: " + difference + ", -10%: min " + tienProcent)
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
                console.log(" meer dan een week ")

                if (difference >= 0 && difference <= tienProcent) {
                    // i for the icons
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


            // div for readme icon
            const readme = document.createElement("div")
            readme.className = " readme";
            icons.appendChild(readme);

            // icon of readme
            const readmeIcon = document.createElement("i");
            readmeIcon.className = "bi bi-arrow-right gonext";
            readme.appendChild(readmeIcon);


            // div for the number of likes/dislikes
            const differentialLikes = document.createElement("div");
            differentialLikes.className = "iconsadd";
            story.appendChild(differentialLikes);

            // holder div for differentialLikes
            const iconnumber = document.createElement("div");
            iconnumber.className = "iconnumber";
            differentialLikes.appendChild(iconnumber);

            // p for the real differentialLikes
            const likeDifference = document.createElement("p");
            if (difference > 0) {
                likeDifference.innerHTML = "+" + difference;
            } else {
                likeDifference.innerHTML = difference;
            }

            iconnumber.appendChild(likeDifference);


            // arrow
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