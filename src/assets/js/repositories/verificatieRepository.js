import { NetworkManager } from "../framework/utils/networkManager.js";

export class VerificatieRepository {

    #route
    #networkManager

    constructor() {
        this.#route = "/verificatie"
        this.#networkManager = new NetworkManager();
    }

    async verifier(mail,inputCode){

        this.#networkManager.doRequest(this.#route,"POST", { email: mail, inputCode: inputCode})

    }


    async verifierResult(email){

       return this.#networkManager.doRequest(`/verificatie/result/${email}`,"GET")

    }
}