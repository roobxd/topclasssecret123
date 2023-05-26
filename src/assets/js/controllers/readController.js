// Importing necessary modules
import { Controller } from "./controller.js";
import { ReadRepository } from "../repositories/readRepository.js";

// ReadController class inherits from Controller class
export class readController extends Controller {
    // Private class variables
    #readView;
    #readRepository;

    likedStatus = 0; // Status of whether a post is liked or not
    dislikedStatus = 0; // Status of whether a post is disliked or not
    newMinHeight = 25; // Starting minimum height for comments section

    constructor() {
        super(); // Calling parent constructor
        // Creating a new instance of ReadRepository
        this.#readRepository = new ReadRepository();
        // Setup view for reading
        this.#setupView();
    }

    // Private async method to setup the view
    async #setupView() {
        this.#readView = await super.loadHtmlIntoContent("html_views/read.html");

        // Getting the last number from the current URL
        const url = window.location.href;
        const lastNumber = url.substring(url.lastIndexOf("/") + 1);
        
        // Reading the story associated with the last number
        this.#readStory(lastNumber);

        // Setting up event listeners for buttons and form submission
        this.#readView.querySelector("#like").addEventListener("click", (event) => this.#likePost(event, lastNumber));
        this.#readView.querySelector("#dislike").addEventListener("click", (event) => this.#dislikePost(event, lastNumber));
        this.#readView.querySelector(".tts-button").addEventListener("click", (event) => this.#speak());
        this.#readView.querySelector(".submit-comment").addEventListener("click", (event) => this.#submitcomment(lastNumber));

        let gaterugbutton = document.querySelector(".back-button")
        gaterugbutton.addEventListener("click", () => {
            // Go back to the previous page when the back button is clicked
            window.history.back();
        });
    }

    // Private method to submit a comment
    #submitcomment(lastNumber){
        let message = document.querySelector(".commentsinput").value;
        let sid = lastNumber;
        // Checking if comment input is greater than one character
        if(document.querySelector(".commentsinput").value.length > 1){
            // Submitting comment through repository
            this.#readRepository.submitComment(message, sid);

            // Appending comment to view
            this.#appendComment(message);
            
            // Increase minHeight for comments container based on number of comments
            let sectioncomments = document.querySelector(".comments-container");
            let increasePerComment = 100; // set increase per comment in px
            sectioncomments.style.minHeight = this.newMinHeight + "px";
            let updateMinHeight = this.newMinHeight += increasePerComment; // increase baseMinHeight for each comment
            sectioncomments.style.minHeight = updateMinHeight + 'px'; // update min-height
        }
    }
    // Private method to append a comment to the view
    #appendComment(message){
        // Create elements for the comment
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

        iUpvoted.id = 'upvoted';
        iDownvoted.id = 'downvoted';

        commentIcon.src = "assets/images/RoccoStar.png";
        commentIcon.alt = "";
        commentIcon.srcset = "";

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

        // Append the new comment to the parent container
        let targetelement = document.querySelector(".comments-container");
        targetelement.append(comment);
    }

    // Private method to like a post
    #likePost(event, lastNumber) {
        if (this.dislikedStatus === 1) {
            this.dislikedStatus = 0;
            this.likedStatus = 1;

            event.target.classList.add("liked");
            document.querySelector("#dislike").classList.remove("disliked");

            this.#readRepository.updateLikes(lastNumber);
        } else if (this.dislikedStatus !== 1 && this.likedStatus === 0) {
            this.likedStatus = 1;

            event.target.classList.add("liked");
            document.querySelector("#dislike").classList.remove("disliked");

            this.#readRepository.updateLikes(lastNumber);
        } else {
            console.log("U heeft al geliked!");
        }
    }

    // Private method to dislike a post
    #dislikePost(event, lastNumber) {
        if (this.likedStatus === 1) {
            this.likedStatus = 0;
            this.dislikedStatus = 1;

            event.target.classList.add("disliked");
            document.querySelector("#like").classList.remove("liked");
            this.#readRepository.updateDislikes(lastNumber);
        } else if (this.likedStatus !== 1 && this.dislikedStatus === 0) {
            this.dislikedStatus = 1;

            event.target.classList.add("disliked");
            document.querySelector("#like").classList.remove("liked");
            this.#readRepository.updateDislikes(lastNumber);
        } else {
            console.log("U heeft al gedisliked!");
        }
    }

    // Asynchronous method to read a story
    async #readStory(lastNumber) {
        // Get the DOM elements for the story
        const storyTitle = this.#readView.querySelector(".story-title");
        const storyContent = this.#readView.querySelector(".story-content p");
        const storyAuthor = this.#readView.querySelector(".author p");
        const storyFlow = this.#readView.querySelector(".post-status p");

        try {
            // Fetch the story data
            const storyData = await this.#readRepository.readStory(lastNumber);

            // Check if comments are enabled for this story
            // If not, disable the comments section
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
                let sectioncomments = document.querySelector(".comments-container");
                let baseMinHeight = 25;
                let increasePerComment = 100;
                sectioncomments.style.minHeight = baseMinHeight + "px";
                storyData.comments.forEach(comment => {
                    this.newMinHeight += increasePerComment;
                    baseMinHeight += increasePerComment;
                    sectioncomments.style.minHeight = baseMinHeight + 'px';
                    this.#appendComment(comment.bericht);
                });
            }
            // Set the story data
            storyTitle.innerHTML = storyData.post[0].onderwerp;
            storyContent.innerHTML = storyData.post[0].bericht;
            storyAuthor.innerHTML = "Auteur: " + storyData.post[0].gebruiker;
            storyFlow.innerHTML = storyData.post[0].aantalLikes - storyData.post[0].aantalDislikes;
        } catch (error) {
            // Log any errors during fetching the story
            console.log("Error while fetching story", error)
        }
    }

    // Method to read the story out loud using speech synthesis
    #speak() {
        if ('speechSynthesis' in window) {
          const synthesis = window.speechSynthesis;
          const paragraphs = document.querySelectorAll('.story-content p');
          let fullText = '';

          paragraphs.forEach(paragraph => {
            fullText += paragraph.textContent + ' ';
          });

          const utterance = new SpeechSynthesisUtterance(fullText.trim());

          synthesis.speak(utterance);
        } else {
          console.log('Speech synthesis is not supported.');
        }
      }
}
