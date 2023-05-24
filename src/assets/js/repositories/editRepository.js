/**
 * -- THIS IS AN EXAMPLE REPOSITORY WITH EXAMPLE DATA FROM DB --
 * Repository responsible for all room related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Pim Meijer
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class EditRepository {
    //# is a private field in Javascript
    #route
    #updateRoute
    #networkManager

    constructor() {
        this.#route = "/edit"
        this.#updateRoute = "/edit/update"
        this.#networkManager = new NetworkManager();
    }

    async getPost(lastNumber) {
        return this.#networkManager.doRequest(`${this.#route}/${lastNumber}`, "GET");
    }

    async update( id, titelinput, dateinput, storyinput, fileinput, sid) {
        this.#networkManager.doRequest(this.#updateRoute, "POST", { gebruiker: id, titelinput: titelinput, dateinput: dateinput, storyinput: storyinput, fileinput: fileinput, postid: sid})
    }

    async delete() {

    }
}