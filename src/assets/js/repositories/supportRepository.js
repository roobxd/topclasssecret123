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
        this.#networkManager.doRequest(this.#route, "POST", {
            name: nameInput,
            email: emailInput,
             question: qeustionInput
        }).then(r =>{
            console.log("Het gelukt om data te sturen")
        })
    }
}