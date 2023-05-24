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


        console.log(this.#verhalenView);
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param roomId the room id to retrieve
     * @private
     */

    async #fetchPosts() {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            let data = await this.#PostsRepository.getAll();
            console.log(data);
            data.reverse().forEach(story => {
                let stitel = story.onderwerp;
                let scontent = story.bericht;
                let sid = story.id;
                let sLikes = story.aantalLikes;
                let sDislikes = story.aantalDislikes;
                let difference = sLikes - sDislikes;
                let sum = sLikes + sDislikes;
                let userType = story.persoon;

                this.#createCard(stitel, scontent, sid, difference, sum, userType);
            });
        } catch (e) {
            console.log("Error while fetching stories: ", e);
        }
    }

    async #createCard(stitel, scontent, sid, difference, sum, userType){
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

        if (userType === 0 ){
            story.classList.add("instantiestory");
        } else {
            story.classList.add("persoonstory");
        }

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
            story.classList.replace("persoonstory", "unlikedstory");
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