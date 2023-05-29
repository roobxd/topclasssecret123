import {NetworkManager} from "../framework/utils/networkManager.js";


export class SendMailRepository {
#networkManager
#route


    constructor() {
        this.#route = "/mail"
        this.#networkManager = new NetworkManager();
    }

    sendMail(mail){
        this.#route = "/mail/wachtwoord"
        this.#networkManager.doRequest(this.#route,"POST", { email: mail})

    }

    sendVerificationMail(mail){
        this.#route = "/mail/verificatie"
        this.#networkManager.doRequest(this.#route,"POST", { email: mail})
    }


    sendAnswerMail(mail, answer){
        this.#route = "/mail/support"
        this.#networkManager.doRequest(this.#route,"POST", { email: mail, answer: answer})
    }



    sendWelkomMail(mail){
        this.#route = "/mail/welkom"
        this.#networkManager.doRequest(this.#route,"POST", { email: mail})
    }


}