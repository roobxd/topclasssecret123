/**
 * Deze klas is for entity support and also interacts with network manager
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class SupportRepository{
    #networkManager;
    #route;

    constructor() {
        this.#route = "/support";
        this.#networkManager = new NetworkManager();
    }

    support(nameInput, emailInput, qeustionInput){
        return this.#networkManager.doRequest(this.#route, "POST", {
            name: nameInput,
            email: emailInput,
             question: qeustionInput
        }).then(r =>{
            console.log(r);
            console.log("Het gelukt om data te sturen");
        })
    }


    sendQuestionMail(name, mail, vraag){
        return this.#networkManager.doRequest("/sendmail", "POST", {
            naam: name,
            email: mail,
            question: vraag,
             })
    }


    // getUser(id){
    //     this.#networkManager.doRequest(this.#route, "GET", {
    //
    //     })
    // }
}