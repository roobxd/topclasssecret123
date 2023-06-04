/**
 * TijdlijnRepository.js
 *
 * This file contains the TijdlijnRepository class for interacting with the timeline endpoint
 * and communicating with the database.
 *
 * Author: Kifleyesus Musgun
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

/**
 * TijdlijnRepository class for interacting with the timeline endpoint and database communication
 */
export class TijdlijnRepository {
    // Attributes: route for endpoints
    #route;
    #networkManager;

    constructor() {
        this.#route = "/tijdlijn";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Method to get story data from the timeline endpoint
     * @param {string} beginDatum - Begin date for timeline
     * @param {string} eindDatum - End date for timeline
     * @returns {Promise} - Promise representing the story data
     */
    getStory(beginDatum, eindDatum) {
        return this.#networkManager.doRequest(
            `${this.#route}/${beginDatum}/${eindDatum}`,
            "GET"
        );
    }
}
