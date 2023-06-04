/**
 * Class representing a repository for the Edit entity.
 * The repository is responsible for all room-related data from the server - CRUD.
 * @author Rocco van Baardwijk
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

class EditRepository {
    /**
     * Private fields in JavaScript that hold the API routes and network manager.
     */
    #route;
    #updateRoute;
    #networkManager;

    /**
     * Create a new instance of EditRepository.
     */
    constructor() {
        this.#route = "/edit";
        this.#updateRoute = "/edit/update";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Get post details by the last number of the post.
     * @param {number} lastNumber - The last number of the post.
     * @returns {Promise} A promise that resolves to the post details.
     */
    async getPost(lastNumber) {
        return this.#networkManager.doRequest(`${this.#route}/${lastNumber}`, "GET");
    }

    /**
     * Update a post.
     * @param {number} id - The id of the post to be updated.
     * @param {string} titelinput - The new title of the post.
     * @param {string} storytype - The type of the story.
     * @param {string} dateinput - The input date.
     * @param {string} storyinput - The new content of the story.
     * @param {string} fileinput - The input file.
     * @param {number} sid - The id of the session.
     * @param {boolean} comments - Enable or disable comments.
     */
    async update(id, titelinput, storytype, dateinput, storyinput, fileinput, sid, comments) {
        this.#networkManager.doRequest(this.#updateRoute, "POST", {
            gebruiker: id,
            titelinput: titelinput,
            storytype: storytype,
            dateinput: dateinput,
            storyinput: storyinput,
            fileinput: fileinput,
            postid: sid,
            yesorno: comments
        });
    }

    /**
     * Delete a post.
     */
    async delete() {
        // TO-DO: Implement the delete method.
    }
}

export { EditRepository };
