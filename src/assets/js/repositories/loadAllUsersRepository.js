

import {NetworkManager} from "../framework/utils/networkManager.js";

export class loadAllUsersRepository {
    #networkManager;
    #route;

    constructor() {

        this.#route = "/loadUsers";
        this.#networkManager = new NetworkManager();
    }


    loadUsers(username, email) {

        return this.#networkManager.doRequest(`${this.#route}/${username}/${email}`,
            "GET")

    }


}