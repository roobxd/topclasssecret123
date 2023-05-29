/**
 * 
 * Repository for entity read - also interacts with networkmanager
 * @author Rocco van Baardwijk
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class MyPostsRepository {
    #networkManager;
    #myPostRoute;

    constructor(){
        this.#myPostRoute = "/myposts";
        this.#networkManager = new NetworkManager();
    }

    getStories(userid){
        return this.#networkManager.doRequest(`${this.#myPostRoute}/${userid}`, "GET")
    }
    
    delete(sid){
        this.#networkManager.doRequest(`${this.#myPostRoute}/delete`, "POST", {sid: sid})
    }
}