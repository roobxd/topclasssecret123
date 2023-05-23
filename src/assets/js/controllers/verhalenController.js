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
            data.reverse().forEach(story => {
                let stitel = story.onderwerp;
                let scontent = story.bericht;
                let sid = story.id;
                this.#createCard(stitel, scontent, sid);
            });
        } catch (e) {
            console.log("Error while fetching stories: ", e);
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

        const targetElement = document.querySelector(".story-container");
        story.addEventListener("click", ()=>{
            window.location = "http://localhost:3000/#read/" + sid
        })
        targetElement.appendChild(story);
    }
}