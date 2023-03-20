/**
 *
 * repository for entity signups
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class signUpRepository {
    #networkManager;
    #route;

    constructor() {

        this.#route = "/postUser";
        this.#networkManager = new NetworkManager();
    }


    signUpUser(password, email) {

        this.#networkManager.doRequest(this.#route,"POST", { password: password, email: email})

    }


}