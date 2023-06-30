

import { NetworkManager } from "../framework/utils/networkManager.js";

/**
 * Repository for all timeline endpoints
 */
export class TijdlijnRodinRepository {
    // Attributes: route for endpoints
    #route;
    #networkManager;

    constructor() {
        this.#route = "/timelineRodin";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Return all stories per month
     * @returns {Promise<*>}
     */
    async getStoriesPerMonth() {
        return await this.#networkManager.doRequest(`${this.#route}/get`, "GET")
    }

    /**
     * Returns all stories for that month
     * @param month
     * @returns {Promise<*>}
     */
    async getStoriesByMonth(month) {
        return await this.#networkManager.doRequest(`${this.#route}/getByMonth/${month}`, "GET")
    }
}
