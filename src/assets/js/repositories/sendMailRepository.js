import {NetworkManager} from "../framework/utils/networkManager.js";


export class SendMailRepository {
#networkManager
#route


    constructor() {
        this.#route = "/mail"
        this.#networkManager = new NetworkManager();
    }

    sendMail(mail){

        this.#networkManager.doRequest(this.#route,"POST", { email: mail})

    }

}