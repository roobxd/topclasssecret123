/**
 * Controller for Verhalen Pagina
 * @author Rocco van Baardwijk
 */
import { PostsRepository } from "../repositories/postsRepository.js";
import { Controller } from "./controller.js"
import { App } from "../app.js";
import {TijdlijnRodinRepository} from "../repositories/tijdlijnRodinRepository.js";

export class VerhalenController extends Controller {
    #PostsRepository
    #RodinRepository
    #verhalenView
    isSorted = 0;

    constructor(data) {
        super();
        this.#RodinRepository = new TijdlijnRodinRepository();
        this.#PostsRepository = new PostsRepository();

        this.#setupView();
    }

    /**
     * Sets up the view and adds event listeners
     * @private
     */
    async #setupView() {
        this.#verhalenView = await super.loadHtmlIntoContent("html_views/verhalen.html");
        await this.#fetchPosts();

        let filtertype = document.querySelector(".type");
        filtertype.addEventListener("click", (event) => this.#sorteerType());

        let filterlikes = document.querySelector(".likes");
        filterlikes.addEventListener("click", (event) => this.#sorteerLikes());

        let searchpost = document.querySelector(".searchbar-icon");
        searchpost.addEventListener("click", (event) => this.#searchPost());
    }

    /**
     * Handles the search functionality
     * @private
     */
    #searchPost() {
        let searchvalue = document.querySelector(".searchbar").value;

        if (searchvalue.trim() === '') {
            this.cachedData = [...this.originalData];
        } else {
            let filteredData = this.originalData.filter((story) => {
                return story.onderwerp.toLowerCase().includes(searchvalue.toLowerCase());
            });
            this.cachedData = filteredData;
        }

        let container = document.querySelector(".story-container-verhalen");
        container.innerHTML = "";

        this.#displayPosts(this.cachedData);
    }

    /**
     * Sorts the posts by type
     * @private
     */
    #sorteerType() {
        if(this.isSorted == 0) {
            this.cachedData.sort((a, b) => {
                if (a.soortBericht < b.soortBericht) {
                    return -1;
                }
                if (a.soortBericht > b.soortBericht) {
                    return 1;
                }
                return 0;
            });

            this.isSorted = 1;
        } else {
            this.cachedData = [...this.originalData];
            this.isSorted = 0;
        }

        let container = document.querySelector(".story-container-verhalen");
        container.innerHTML = "";

        this.#displayPosts(this.cachedData);
    }

    /**
     * Sorts the posts by likes
     * @private
     */
    #sorteerLikes() {
        if(this.isSorted == 0) {
            this.cachedData.sort((a, b) => {
                if (a.aantalLikes < b.aantalLikes) {
                    return -1;
                }
                if (a.aantalLikes > b.aantalLikes) {
                    return 1;
                }
                return 0;
            });

            this.isSorted = 1;
        } else {
            this.cachedData = [...this.originalData];
            this.isSorted = 0;
        }

        let container = document.querySelector(".story-container-verhalen");
        container.innerHTML = "";

        this.#displayPosts(this.cachedData);
    }


    /**
     * Fetches the posts from the repository
     * @private
     */
    async #fetchPosts() {
        try {
            const month = new URLSearchParams(window.location.hash.slice(1).split('?')[1]).get("month");
            let data;
            if(month !== undefined) {
                data = await this.#RodinRepository.getStoriesByMonth(month);
            } else {
                data = await this.#PostsRepository.getAll();
            }

            this.originalData = [...data];
            this.cachedData = [...this.originalData];

            this.#displayPosts(data);

        } catch (e) {
            console.log("Error while fetching stories: ", e);
        }
    }

    /**
     * Displays the posts on the page
     * @param {Array} posts - The array of posts to display
     * @private
     */
    async #displayPosts(posts) {
        const targetElement = document.querySelector(".story-container-verhalen");
        targetElement.innerHTML = "";

        posts.reverse().forEach(story => {
            let stitel = story.onderwerp;
            let scontent = story.bericht;
            let sid = story.id;
            let sLikes = story.aantalLikes;
            let sDislikes = story.aantalDislikes;
            let difference = sLikes - sDislikes;
            let sum = sLikes + sDislikes;
            let userType = story.persoon;
            let soort = story.soortBericht;
            let imagepath = story.plaatje;

            this.#createCard(stitel, scontent, sid, difference, sum, userType, soort, imagepath);
        });
    }


    /**
     * Creates a card for a post and appends it to the container
     * @param {string} stitel - The title of the post
     * @param {string} scontent - The content of the post
     * @param {string} sid - The ID of the post
     * @param {number} difference - The difference between likes and dislikes
     * @param {number} sum - The sum of likes and dislikes
     * @param {string} userType - The type of user
     * @param {string} soort - The type of post
     * @param {string} imagepath - The path to the post image
     * @private
     */
    async #createCard(stitel, scontent, sid, difference, sum, userType, soort, imagepath){
        let storygradient = "verhaal-gradient";
        switch(soort) {
            case "bulletin":
                storygradient = "bulletin-gradient"
            break;

            case "instantie":
                storygradient = "instantie-gradient"
            break;
        }

        const tienProcent = 10 / 100 * sum;
        const twentigProcent = 20 / 100 * sum;
        const vijftigProcent = 50 / 100 * sum;

        const story = document.createElement('div');
        story.className = "story";
        story.classList.add("one");
        story.classList.add(storygradient);


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

        if (difference >= 0 && difference <= tienProcent) {
            const heartIcon = document.createElement("i");
            heartIcon.className = "bi bi-heart-fill heart";
            trending.appendChild(heartIcon);

        } else if (difference > tienProcent && difference <= twentigProcent) {

            const graphIcon = document.createElement("i");
            graphIcon.className = "bi bi-graph-up-arrow";
            trending.appendChild(graphIcon);

        } else if (difference >= vijftigProcent) {
            const fireIcon = document.createElement("i");
            fireIcon.className = "bi bi-fire trending";
            trending.appendChild(fireIcon);

        } else if (difference < 0) {
            story.classList.add("unlikedstory");
            story.classList.remove("verhaal-gradient");
            const canIcon = document.createElement("i");
            canIcon.className = "bi bi-trash3-fill trash";
            trending.appendChild(canIcon);
        } else {
            const heartIcon = document.createElement("i");
            heartIcon.className = "bi bi-heart-fill heart";
            trending.appendChild(heartIcon);
        }

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
        if (difference > 0) {
            iconnumberText.textContent  = "+" + difference;
        } else {
            iconnumberText.textContent  = difference;
        }

        iconnumber.appendChild(iconnumberText);

        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';

        iconsadd.appendChild(iconnumber);
        iconsadd.appendChild(emptyDiv);

        story.appendChild(image);
        story.appendChild(text);
        story.appendChild(icons);
        story.appendChild(iconsadd);

        const targetElement = document.querySelector(".story-container-verhalen");
        story.addEventListener("click", ()=>{
            window.location = "http://localhost:3000/#read/" + sid
        })
        targetElement.appendChild(story);
    }
}
