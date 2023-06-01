/**
 * Class representing a repository for the MyPosts entity.
 * This repository interacts with the network manager to handle data from the server.
 * @author Rocco van Baardwijk
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

class MyPostsRepository {
    /**
     * Private fields in JavaScript that hold the API route and network manager.
     */
    #networkManager;
    #myPostRoute;

    /**
     * Create a new instance of MyPostsRepository.
     */
    constructor(){
        this.#myPostRoute = "/myposts";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Get the stories of a specific user.
     * @param {string} userid - The ID of the user.
     * @returns {Promise} A promise that resolves to the stories of the user.
     */
    getStories(userid){
        return this.#networkManager.doRequest(`${this.#myPostRoute}/${userid}`, "GET")
    }
    
    /**
     * Delete a story.
     * @param {string} sid - The ID of the story to delete.
     */
    delete(sid){
        this.#networkManager.doRequest(`${this.#myPostRoute}/delete`, "POST", {sid: sid})
    }
}

export { MyPostsRepository };
