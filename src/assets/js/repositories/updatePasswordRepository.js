import {NetworkManager} from "../framework/utils/networkManager.js";

export class UpdatePasswordRepository {
    #networkManager
    #route

    constructor() {
        this.#route = "/updateUser"
        this.#networkManager = new NetworkManager();

    }

    async updatePassword(password, email) {
            return await this.#networkManager.doRequest(this.#route, "POST",{password:password,email:email});
    }

    async create() {

    }

    async delete() {

    }

    async update(id, values = {}) {

    }


}
