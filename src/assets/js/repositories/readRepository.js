/**
 * Class representing a repository for the Read entity.
 * This repository is responsible for handling all operations related to the Read entity.
 * It interacts with the network manager to handle data from the server.
 * @author Rocco van Baardwijk
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

class ReadRepository {
    /**
     * Private fields in JavaScript that hold the API routes and network manager.
     */
    #networkManager;
    #likeRoute;
    #dislikeRoute;
    #submitRoute;
    #likeCommentRoute;
    #dislikeCommentRoute
    #readRoute;

    /**
     * Create a new instance of ReadRepository.
     */
    constructor(){
        this.#likeRoute = "/read/like";
        this.#dislikeRoute = "/read/dislike";
        this.#readRoute = "/read";
        this.#submitRoute = "/read/:sid/comment";
        this.#likeCommentRoute = "/read/comment-like";
        this.#dislikeCommentRoute = "/read/comment-dislike";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Submit a comment to a story.
     * @param {string} message - The comment message.
     * @param {number} sid - The story ID.
     * @param {number} user - The user ID.
     */
    submitComment(message, sid, user){
        this.#networkManager.doRequest(this.#submitRoute, "POST", {message: message, sid: sid, user: user})
    }

    /**
     * Update the likes for a story.
     * @param {number} sid - The story ID.
     */
    updateLikes(sid){
        this.#networkManager.doRequest(this.#likeRoute, "POST", {sid: sid})
    }

    /**
     * Update the dislikes for a story.
     * @param {number} sid - The story ID.
     */
    updateDislikes(sid){
        this.#networkManager.doRequest(this.#dislikeRoute, "POST", {sid: sid})
    }

    /**
     * Update the likes for a comment.
     * @param {number} sid - The story ID.
     * @param {string} commentText - The comment text.
     */
    updateCommentLikes(sid, commentText){
        this.#networkManager.doRequest(this.#likeCommentRoute, "POST", {sid: sid, commentText: commentText})
    }

    /**
     * Update the dislikes for a comment.
     * @param {number} sid - The story ID.
     * @param {string} commentText - The comment text.
     */
    updateCommentDislikes(sid, commentText){
        this.#networkManager.doRequest(this.#dislikeCommentRoute, "POST", {sid: sid, commentText: commentText})
    }

    /**
     * Get a story by ID.
     * @param {number} sid - The story ID.
     * @returns {Promise} A promise that resolves to the story data.
     */
    readStory(sid){
        return this.#networkManager.doRequest(`${this.#readRoute}/${sid}`, "GET")
    }
}

export { ReadRepository };
