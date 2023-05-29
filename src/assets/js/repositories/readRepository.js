/**
 * 
 * Repository for entity read - also interacts with networkmanager
 * @author Rocco van Baardwijk
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class ReadRepository {
    #networkManager;
    #likeRoute;
    #dislikeRoute;
    #submitRoute;
    #likeCommentRoute;
    #dislikeCommentRoute
    #readRoute;

    constructor(){
        this.#likeRoute = "/read/like";
        this.#dislikeRoute = "/read/dislike";
        this.#readRoute = "/read";
        this.#submitRoute = "/read/:sid/comment";
        this.#likeCommentRoute = "/read/comment-like";
        this.#dislikeCommentRoute = "/read/comment-dislike";
        this.#networkManager = new NetworkManager();
    }

    submitComment(message, sid, user){
        this.#networkManager.doRequest(this.#submitRoute, "POST", {message: message, sid: sid, user: user})
    }

    updateLikes(sid){
        this.#networkManager.doRequest(this.#likeRoute, "POST", {sid: sid})
    }

    updateDislikes(sid){
        this.#networkManager.doRequest(this.#dislikeRoute, "POST", {sid: sid})
    }

    updateCommentLikes(sid, commentText){
        this.#networkManager.doRequest(this.#likeCommentRoute, "POST", {sid: sid, commentText: commentText})
    }

    updateCommentDislikes(sid, commentText){
        this.#networkManager.doRequest(this.#dislikeCommentRoute, "POST", {sid: sid, commentText: commentText})
    }

    readStory(sid){
        return this.#networkManager.doRequest(`${this.#readRoute}/${sid}`, "GET")
    }
}