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

    updateLikes(sid){
        this.#networkManager.doRequest(this.#likeRoute, "POST", {sid: sid})
    }

    updateDislikes(sid){
        this.#networkManager.doRequest(this.#dislikeRoute, "POST", {sid: sid})
    }

    readStory(sid){
        return this.#networkManager.doRequest(`${this.#readRoute}/${sid}`, "GET")
    }
}