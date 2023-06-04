/**
 * SupportRepository class for entity support and interaction with the network manager.
 * File description: This file contains the SupportRepository class, which is responsible for handling support-related functionality and interacting with the network manager.
 * @author: Kifleyesus Musgun Sium
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class SupportRepository {
    #networkManager;
    #route;

    /**
     * Constructor for the SupportRepository class.
     * Initializes the route and networkManager attributes.
     */
    constructor() {
        this.#route = "/support";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Sends support information to the server.
     * @param {string} nameInput - The name of the person requesting support.
     * @param {string} emailInput - The email of the person requesting support.
     * @param {string} questionInput - The support question or message.
     * @returns {Promise} A promise that resolves with the response from the server.
     */
    support(nameInput, emailInput, questionInput) {
        return this.#networkManager.doRequest(this.#route, "POST", {
            name: nameInput,
            email: emailInput,
            question: questionInput
        }).then(response => {
            console.log(response);
            console.log("Het gelukt om data te sturen");
        });
    }

    /**
     * Sends a support question via email to the server.
     * @param {string} name - The name of the person asking the question.
     * @param {string} mail - The email of the person asking the question.
     * @param {string} vraag - The question or message.
     * @returns {Promise} A promise that resolves with the response from the server.
     */
    sendQuestionMail(name, mail, vraag) {
        return this.#networkManager.doRequest("/sendmail", "POST", {
            naam: name,
            email: mail,
            question: vraag
        });
    }


}
