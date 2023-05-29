// Importing necessary modules
import { App } from "../app.js";
import { Controller } from "./controller.js";
import { ReadRepository } from "../repositories/readRepository.js";

// ReadController class inherits from Controller class
export class readController extends Controller {
    // Private class variables
    #readView;
    #readRepository;
    user = App.sessionManager.get("id");

    likedStatus = 0; // Status of whether a post is liked or not
    dislikedStatus = 0; // Status of whether a post is disliked or not

    
    likedCommentStatus = 0; // Status of whether a post is liked or not
    dislikedCommentStatus = 0; // Status of whether a post is disliked or not

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
        await this.#readStory(lastNumber);

        // Setting up event listeners for buttons and form submission
        this.#readView.querySelector("#like").addEventListener("click", (event) => this.#likePost(event, lastNumber));
        this.#readView.querySelector("#dislike").addEventListener("click", (event) => this.#dislikePost(event, lastNumber));
        if(this.#readView.querySelector("#upvoted")){
            this.#readView.querySelector("#upvoted").addEventListener("click", (event) => this.#likeComment(event, lastNumber));
        }
        if(this.#readView.querySelector("#downvoted")){
            this.#readView.querySelector("#downvoted").addEventListener("click", (event) => this.#dislikeComment(event, lastNumber));
        }
        this.#readView.querySelector(".tts-button").addEventListener("click", (event) => this.#speak());
        this.#readView.querySelector(".submit-comment").addEventListener("click", (event) => this.#submitcomment(lastNumber));

        let commentInput = this.#readView.querySelector(".commentsinput");

        commentInput.addEventListener('input', function () {
            let remaining = 150 - commentInput.value.length;
            let charCount =  document.querySelector(".charCount");
            charCount.textContent = `${remaining} karakters over`;
        });

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
            this.#readRepository.submitComment(message, sid, this.user);

            // Appending comment to view
            this.#appendComment(message, this.user, "Just now");
            
            // Increase minHeight for comments container based on number of comments
            let sectioncomments = document.querySelector(".comments-container");
            let increasePerComment = 100; // set increase per comment in px
            sectioncomments.style.minHeight = this.newMinHeight + "px";
            let updateMinHeight = this.newMinHeight += increasePerComment; // increase baseMinHeight for each comment
            sectioncomments.style.minHeight = updateMinHeight + 'px'; // update min-height
        }
    }
    // Private method to append a comment to the view
    #appendComment(message, user, date, likes, dislikes){
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
        pMessage.className = "comment-message";
        pUpvotes.className = "upvotesNumber";
        pDownvotes.className = "downvotesNumber";


        iUpvoted.id = 'upvoted';
        iDownvoted.id = 'downvoted';

        commentIcon.src = "assets/images/RoccoStar.png";
        commentIcon.alt = "";
        commentIcon.srcset = "";
        console.log(date);
        pUsername.textContent = "dbpgebruiker" + this.user;
        pDatePosted.textContent = date;
        pMessage.textContent = message;
        pUpvotes.textContent = likes;
        pDownvotes.textContent = dislikes;

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
            this.#readRepository.updateCommentDislikes(lastNumber);
        } else if (this.likedStatus !== 1 && this.dislikedStatus === 0) {
            this.dislikedStatus = 1;

            event.target.classList.add("disliked");
            document.querySelector("#like").classList.remove("liked");
            this.#readRepository.updateCommentDislikes(lastNumber);
        } else {
            console.log("U heeft al gedisliked!");
        }
    }

    // Private method to like a post
    #likeComment(event, lastNumber) {
        let parentCommentDiv = event.target.closest('.comment');
        let nearestDownvoteIcon = parentCommentDiv.querySelector("#downvoted");
        let upvotesNumber = parentCommentDiv.querySelector(".upvotesNumber");
        let downvotesNumber = parentCommentDiv.querySelector(".downvotesNumber");
        
        console.log(nearestDownvoteIcon);
        let commentText = parentCommentDiv.querySelector('.comment-message').textContent;
        // alert(commentText);

        if (this.dislikedCommentStatus === 1) {
            this.dislikedCommentStatus = 0;
            this.likedCommentStatus = 1;

            event.target.classList.add("liked");
            nearestDownvoteIcon.classList.remove("disliked");

            this.#readRepository.updateCommentLikes(lastNumber, commentText);
            upvotesNumber.textContent = parseInt(upvotesNumber.textContent) + 1;
        } else if (this.dislikedCommentStatus !== 1 && this.likedCommentStatus === 0) {
            this.likedCommentStatus = 1;

            event.target.classList.add("liked");
            nearestDownvoteIcon.classList.remove("disliked");

            upvotesNumber.textContent = parseInt(upvotesNumber.textContent) + 1;
            this.#readRepository.updateCommentLikes(lastNumber, commentText);
        } else {
            console.log("U heeft al geliked!");
        }
    }

    // Private method to dislike a post
    #dislikeComment(event, lastNumber) {
        let parentCommentDiv = event.target.closest('.comment');
        let nearestUpvoteIcon = parentCommentDiv.querySelector("#upvoted")
        let commentText = parentCommentDiv.querySelector('.comment-message').textContent;
        let upvotesNumber = parentCommentDiv.querySelector(".upvotesNumber");
        let downvotesNumber = parentCommentDiv.querySelector(".downvotesNumber");

        if (this.likedCommentStatus === 1) {
            this.likedCommentStatus = 0;
            this.dislikedCommentStatus = 1;

            event.target.classList.add("disliked");
            nearestUpvoteIcon.classList.remove("liked");
            this.#readRepository.updateCommentDislikes(lastNumber, commentText);
            downvotesNumber.textContent = parseInt(downvotesNumber.textContent) + 1;

        } else if (this.likedCommentStatus !== 1 && this.dislikedCommentStatus === 0) {
            this.dislikedCommentStatus = 1;

            event.target.classList.add("disliked");
            nearestUpvoteIcon.classList.remove("liked");
            this.#readRepository.updateCommentDislikes(lastNumber, commentText);
            downvotesNumber.textContent = parseInt(downvotesNumber.textContent) + 1;

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
            console.log(storyData.wholikedwhat);
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
                    let likes = comment.likes;
                    let dislikes = comment.dislikes;
                    this.#appendComment(comment.bericht, this.user, comment.creation_date.slice(0, 10), likes, dislikes);
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
