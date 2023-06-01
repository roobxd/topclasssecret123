

import { NetworkManager } from "../framework/utils/networkManager.js";

// M EN T ALI
export class loadAllUsersRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/loadUsers";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Sends the typed in email of the user to the endpoint with a url parameter.
     * @param email - Input of the user
     */
    loadUsers(email) {
        return this.#networkManager.doRequest(`${this.#route}/${email}`, "GET")
    }


}