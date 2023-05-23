import { Controller } from "./controller.js";
import { ReadRepository } from "../repositories/readRepository.js";

export class readController extends Controller {
    #readView;
    #readRepository;

    likedStatus = 0;
    dislikedStatus = 0;

    constructor() {
        super();
        this.#readRepository = new ReadRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#readView = await super.loadHtmlIntoContent("html_views/read.html");
        
        const url = window.location.href;
        const lastNumber = url.substring(url.lastIndexOf("/") + 1);
        this.#readStory(lastNumber);

        this.#readView.querySelector("#like").addEventListener("click", (event) => this.#likePost(event, lastNumber));
        this.#readView.querySelector("#dislike").addEventListener("click", (event) => this.#dislikePost(event, lastNumber));
        this.#readView.querySelector(".tts-button").addEventListener("click", (event) => this.#speak());
    }

    #likePost(event, lastNumber) {
        if (this.dislikedStatus === 1) {
            this.dislikedStatus = 0;
            console.log("Je hebt de like button gedrukt!");
            this.likedStatus = 1;

            event.target.classList.add("liked");
            document.querySelector("#dislike").classList.remove("disliked");

            this.#readRepository.updateLikes(lastNumber);
        } else if (this.dislikedStatus !== 1 && this.likedStatus === 0) {
            console.log("Je hebt de like button gedrukt!");
            this.likedStatus = 1;

            event.target.classList.add("liked");
            document.querySelector("#dislike").classList.remove("disliked");

            this.#readRepository.updateLikes(lastNumber);
        } else {
            console.log("U heeft al geliked!");
        }
    }

    #dislikePost(event, lastNumber) {
        if (this.likedStatus === 1) {
            this.likedStatus = 0;
            console.log("Je hebt de dislike button gedrukt!");
            this.dislikedStatus = 1;

            event.target.classList.add("disliked");
            document.querySelector("#like").classList.remove("liked");
            this.#readRepository.updateDislikes(lastNumber);
        } else if (this.likedStatus !== 1 && this.dislikedStatus === 0) {
            console.log("Je hebt de dislike button gedrukt!");
            this.dislikedStatus = 1;

            event.target.classList.add("disliked");
            document.querySelector("#like").classList.remove("liked");
            this.#readRepository.updateDislikes(lastNumber);
        } else {
            console.log("U heeft al gedisliked!");
        }
    }

    async #readStory(lastNumber) {
        const storyTitle = this.#readView.querySelector(".story-title");
        const storyContent = this.#readView.querySelector(".story-content p");
        const storyAuthor = this.#readView.querySelector(".author p");
        const storyFlow = this.#readView.querySelector(".post-status p");

        try {
            const storyData = await this.#readRepository.readStory(lastNumber);
            storyTitle.innerHTML = storyData[0].onderwerp;
            storyContent.innerHTML = storyData[0].bericht;
            storyAuthor.innerHTML = "Auteur: " + storyData[0].gebruiker;
            storyFlow.innerHTML = storyData[0].aantalLikes - storyData[0].aantalDislikes;
        } catch (error) {
            console.log("Error while fetching story", error)
        }
    }

    #speak() {
        console.log("klik op tts");
        // Check if speech synthesis is supported by the browser
        if ('speechSynthesis' in window) {
          const synthesis = window.speechSynthesis;
          const paragraphs = document.querySelectorAll('.story-content p');
          let fullText = '';
      
          // Concatenate the text content of each paragraph
          paragraphs.forEach(paragraph => {
            fullText += paragraph.textContent + ' ';
          });
      
          const utterance = new SpeechSynthesisUtterance(fullText.trim());
      
          // Speak the text
          synthesis.speak(utterance);
        } else {
          console.log('Speech synthesis is not supported.');
        }
      }
}
