/**
 * Controller for the support page.
 * File description: This file contains the SupportController class, which is responsible for handling the support page functionality.
 * @author: Kifleyesus Musgun Sium
 */

import { Controller } from "./controller.js";
import { SupportRepository } from "../repositories/supportRepository.js";
import { App } from "../app.js";
import { SendMailRepository } from "../repositories/sendMailRepository.js";

export class SupportController extends Controller {
    #supportView;
    #supportRepository;
    #sendMailRepository;

    /**
     * Constructor for the SupportController class.
     * Initializes the supportView, supportRepository, and sendMailRepository attributes.
     */
    constructor() {
        super();
        this.#supportRepository = new SupportRepository();
        this.#sendMailRepository = new SendMailRepository();
        this.#initializeView();
    }

    /**
     * Initializes the support view and sets up event listeners.
     * @private
     */
    async #initializeView() {
        this.#supportView = await super.loadHtmlIntoContent("html_views/support.html");

        this.#supportView.querySelector(".btn").addEventListener("click", (event) => this.#sendData(event));
    }

    /**
     * Sends the support data to the server.
     * @param {Event} evt - The event object.
     * @private
     */
    async #sendData(evt) {
        evt.preventDefault();

        const email = this.#supportView.querySelector("#email").value;
        const name = this.#supportView.querySelector("#name").value;
        const question = this.#supportView.querySelector("#question").value;

        const reactieBox = this.#supportView.querySelector(".formReactie");
        if (email.length === 0 || name.length === 0 || question.length === 0) {
            reactieBox.style.color = "Red";
            reactieBox.innerHTML = "Email, naam en vraag moeten ingevuld worden.";
            return;
        }

        try {
            await this.#supportRepository.support(name, email, question);
            await this.#supportRepository.sendQuestionMail(name, email, question);

            reactieBox.innerHTML = "Bedankt voor jouw vraag. We hebben jouw reactie ontvangen!";
        } catch (error) {
            reactieBox.innerHTML = "Er is iets fout gegaan bij het indienen.";
            console.log(error);
        }
    }
}
