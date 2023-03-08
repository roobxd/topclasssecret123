/**
 *
 * repository for entity signups
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class signUpRepository {
    #networkManager;
    #route;

    constructor() {

        this.route = "/postUser";
        this.#networkManager = new NetworkManager();
    }


    signUpUser(username, password, email) {

        this.#networkManager.doRequest(this.#route,"POST", { username: username, password: password, email: email})

    }


}