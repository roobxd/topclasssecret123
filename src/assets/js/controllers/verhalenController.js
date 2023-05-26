/**
 * Controller voor Verhalen Pagina
 */
import { PostsRepository } from "../repositories/postsRepository.js";
import { Controller } from "./controller.js"
import { App } from "../app.js";

export class VerhalenController extends Controller {
    #PostsRepository
    #verhalenView

    constructor() {
        super();
        this.#PostsRepository = new PostsRepository();

        this.#setupView();
    }

    async #setupView() {
        this.#verhalenView = await super.loadHtmlIntoContent("html_views/verhalen.html");
        await this.#fetchPosts();

        let searchpost = document.querySelector(".searchbar-icon");
        searchpost.addEventListener("click", (event) => this.#searchPost());
        console.log(this.#verhalenView);
    }

    #searchPost() {
        let searchvalue = document.querySelector(".searchbar").value;
    
        if (searchvalue.trim() === '') {
            // If search value is empty, reset cachedData to the original data
            this.cachedData = [...this.originalData];
        } else {
            // Otherwise, filter the originalData
            let filteredData = this.originalData.filter((story) => {
                return story.onderwerp.toLowerCase().includes(searchvalue.toLowerCase());
            });
            this.cachedData = filteredData;
        }
    
        // Clear the story container
        let container = document.querySelector(".story-container-verhalen");
        container.innerHTML = "";
    
        this.#displayPosts(this.cachedData);  // Update the page info
    }

    async #fetchPosts() {
        try {
            // await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#PostsRepository.getAll();
            console.log(data);
    
            // Store original fetched data
            this.originalData = [...data];
            this.cachedData = [...this.originalData];
    
            this.#displayPosts(data);  // Update the page info
    
        } catch (e) {
            console.log("Error while fetching stories: ", e);
        }
    }

    async #displayPosts(posts) {
        // Clear existing posts before displaying new ones
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
    
            this.#createCard(stitel, scontent, sid, difference, sum, userType, soort);
        });
    }
    

    async #createCard(stitel, scontent, sid, difference, sum, userType, soort){
        console.log(soort);
        let storygradient = "verhaal-gradient";
        switch(soort) {
            case "bulletin":
                storygradient = "bulletin-gradient"
            break;

            case "instantie":
                storygradient = "instantie-gradient"
            break;
        }

       /*
       Percentage calculations that are important for determining icons. The calculation is based on the sum of likes.
        */
        const tienProcent = 10 / 100 * sum;
        console.log("10%: " + tienProcent);
        const vijtienProcent = 15 / 100 * sum;
        console.log("15%: " + vijtienProcent)
        const twentigProcent = 20 / 100 * sum;
        console.log("20%: " + twentigProcent)
        const vijftigProcent = 50 / 100 * sum;
        console.log("50%: " + vijftigProcent)

        const story = document.createElement('div');
        story.className = "story";
        story.classList.add("one");
        story.classList.add(storygradient);


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

        if (difference >= 0 && difference <= tienProcent) {
            // i for the icons
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