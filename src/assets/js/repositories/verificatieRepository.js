import { NetworkManager } from "../framework/utils/networkManager.js";

export class VerificatieRepository {

    #route
    #networkManager

    constructor() {
        this.#route = "/verificatie"
        this.#networkManager = new NetworkManager();
    }

    async verifier(mail){

        this.#networkManager.doRequest(this.#route,"POST", { email: mail})
    }
}