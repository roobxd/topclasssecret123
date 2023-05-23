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
    #readRoute;

    constructor(){
        this.#likeRoute = "/read/like";
        this.#dislikeRoute = "/read/dislike";
        this.#readRoute = "/read";
        this.#networkManager = new NetworkManager();
    }

    updateLikes(){
        this.#networkManager.doRequest(this.#likeRoute, "POST", {})
    }

    updateDislikes(){
        this.#networkManager.doRequest(this.#dislikeRoute, "POST", {})
    }

    readStory(sid){
        console.log(sid);
        return this.#networkManager.doRequest(`${this.#readRoute}/${sid}`, "GET")
    }
}