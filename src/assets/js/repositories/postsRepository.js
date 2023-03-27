/**
 * -- THIS IS AN EXAMPLE REPOSITORY WITH EXAMPLE DATA FROM DB --
 * Repository responsible for all room related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Pim Meijer
 */
import { NetworkManager } from "../framework/utils/networkManager.js";

export class PostsRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/posts"
        this.#networkManager = new NetworkManager();
    }

    async getAll() {
        return this.#networkManager.doRequest('/welcome', "GET");
    }

    /**
     * Async function to get a piece of room example data by its id via networkmanager
     * in the back-end we define :roomId as parameter at the end of the endpoint
     *
     * GET requests don't send data via the body like a POST request but via the url
     * @param roomId
     * @returns {Promise<>}
     */
    async get() {

    }

    async create(subject, jaartal, typeOfPost, post, sampleFile) {
        this.#networkManager.doRequest(this.#route, "POST", { subject: subject, jaartal: jaartal, typeOfPost: typeOfPost, post: post, sampleFile: sampleFile})

    }

    async delete() {

    }

    async update(id, values = {}) {

    }
}