import {NetworkManager} from "../framework/utils/networkManager.js";

export class UpdatePasswordRepository {
    #networkManager
    #route

    constructor() {
        this.#route = "/posts"
        this.#networkManager = new NetworkManager();

    }


}
