/**
 * Class representing a repository for the Posts entity.
 * This repository is responsible for handling all CRUD operations related to Posts.
 * It interacts with the network manager to handle data from the server.
 * @author Rocco van Baardwijk
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

class PostsRepository {
    /**
     * Private fields in JavaScript that hold the API route and network manager.
     */
    #route
    #networkManager

    /**
     * Create a new instance of PostsRepository.
     */
    constructor() {
        this.#route = "/posts"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Get all posts.
     * @returns {Promise} A promise that resolves to the list of all posts.
     */
    async getAll () {
        return this.#networkManager.doRequest(`/welcome`, "GET");
    }

    /**
     * Get all user types.
     * @returns {Promise} A promise that resolves to the list of all user types.
     */
    async getUserTypes() {
        return this.#networkManager.doRequest(`${this.#route}/stories`, "GET");
    }

    // TODO: Implement this method.
    async get() {

    }

    /**
     * Create a new post.
     * @param {string} id - The ID of the user creating the post.
     * @param {string} titelinput - The title of the post.
     * @param {string} storytype - The type of the story.
     * @param {string} dateinput - The date of the story.
     * @param {string} storyinput - The content of the story.
     * @param {string} imagePath - The path to the image for the story.
     * @param {boolean} comments - The state of comments enabled/disabled for the post.
     * @returns {Promise} A promise that resolves when the post has been created.
     */
    async create( id, titelinput, storytype, dateinput, storyinput, imagePath, comments) {
        return this.#networkManager.doRequest(this.#route, "POST", { gebruiker: id, titelinput: titelinput, storytype: storytype, dateinput: dateinput, storyinput: storyinput, imagePath: imagePath, yesorno: comments})
    }

    // TODO: Implement this method.
    async delete() {

    }

    // TODO: Implement this method.
    async update(id, values = {}) {

    }
}

export { PostsRepository };
