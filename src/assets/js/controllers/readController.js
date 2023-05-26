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
        this.#readView.querySelector(".submit-comment").addEventListener("click", (event) => this.#submitcomment(lastNumber));
    }

    #submitcomment(lastNumber){
        let message = document.querySelector(".commentsinput").value;
        let sid = lastNumber;
        if(document.querySelector(".commentsinput").value.length > 1){
            alert("test");
            this.#readRepository.submitComment(message, sid);

            this.#appendComment(message);
        }
    }

    #appendComment(message){
        // Create elements
        let comment = document.createElement('div');
        let commentIcon = document.createElement('img');
        let messageDiv = document.createElement('div');
        let commentInfo = document.createElement('div');
        let pUsername = document.createElement('p');
        let pDatePosted = document.createElement('p');
        let pMessage = document.createElement('p');
        let thumbsupdown = document.createElement('div');
        let upvoted = document.createElement('div');
        let downvoted = document.createElement('div');
        let iUpvoted = document.createElement('i');
        let iDownvoted = document.createElement('i');
        let pUpvotes = document.createElement('p');
        let pDownvotes = document.createElement('p');

        // Set classes
        comment.className = 'comment';
        commentIcon.className = 'comment-icon';
        messageDiv.className = 'message';
        commentInfo.className = 'comment-info';
        pUsername.className = 'username';
        pDatePosted.className = 'dateposted';
        thumbsupdown.className = 'thumbsupdown';
        upvoted.className = 'upvoted';
        downvoted.className = 'downvoted';
        iUpvoted.className = 'bi bi-hand-thumbs-up-fill';
        iDownvoted.className = 'bi bi-hand-thumbs-down-fill';

        // Set ID
        iUpvoted.id = 'upvoted';
        iDownvoted.id = 'downvoted';

        // Set attributes
        commentIcon.src = "assets/images/RoccoStar.png";
        commentIcon.alt = "";
        commentIcon.srcset = "";

        // Set text content
        pUsername.textContent = "Testuser";
        pDatePosted.textContent = "Just now...";
        pMessage.textContent = message;
        pUpvotes.textContent = 0;
        pDownvotes.textContent = 0;

        // Append elements
        upvoted.append(iUpvoted, pUpvotes);
        downvoted.append(iDownvoted, pDownvotes);
        thumbsupdown.append(upvoted, downvoted);
        commentInfo.append(pUsername, pDatePosted);
        messageDiv.append(commentInfo, pMessage);
        comment.append(commentIcon, messageDiv, thumbsupdown);

        // Finally, append the new comment to the parent container
        // Replace 'parentContainer' with the actual parent element's ID or class name
        let targetelement = document.querySelector(".comments-container");
        targetelement.append(comment);
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
            console.log(storyData);
            console.log(storyData.post[0]);
            if(storyData.post[0].commentsenabled == 0){
                let section2 = document.querySelector(".comment-inputbar");
                let section3 = document.querySelector(".comment-stripe");
                let section1 = document.querySelector(".comments-container");
                section1.classList.add("commentsdisabled");
                section2.classList.add("commentsdisabled");
                section3.classList.add("commentsdisabled");
                let commentstext = document.querySelector(".comments-section h2");
                commentstext.innerHTML = "Comments are disabled on this post by the creator.";
            }else{
                let sectioncomments = document.querySelector(".comments-section");
                let baseMinHeight = 300; // set base min-height in px
                let increasePerComment = 50; // set increase per comment in px
                sectioncomments.style.minHeight = baseMinHeight + "px";
                storyData.comments.forEach(comment => {
                    baseMinHeight += increasePerComment; // increase baseMinHeight for each comment
                    sectioncomments.style.minHeight = baseMinHeight + 'px'; // update min-height
                    this.#appendComment(comment.bericht);
                });
            }
    
            storyTitle.innerHTML = storyData.post[0].onderwerp;
            storyContent.innerHTML = storyData.post[0].bericht;
            storyAuthor.innerHTML = "Auteur: " + storyData.post[0].gebruiker;
            storyFlow.innerHTML = storyData.post[0].aantalLikes - storyData.post[0].aantalDislikes;
        } catch (error) {
            console.log("Error while fetching story", error)
        }
    }
    

    #getComments(lastNumber){
        let comments = this.#readRepository.getComments(lastNumber);
        console.log(comments);
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
