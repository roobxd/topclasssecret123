

import {NetworkManager} from "../framework/utils/networkManager.js";

export class loadAllUsersRepository {
    #networkManager;
    #route;

    constructor() {

        this.#route = "/loadUsers";
        this.#networkManager = new NetworkManager();
    }


    loadUsers( email) {

        return this.#networkManager.doRequest(`${this.#route}/${email}`,
            "GET")

    }


}