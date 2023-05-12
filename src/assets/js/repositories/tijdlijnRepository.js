import {NetworkManager} from "../framework/utils/networkManager.js";

/**
 * Deze klas is een repository voor de tijdlijn om endpoint met database te communiceren.
 */
export class TijdlijnRepository {
/* Attributen: route voor einpoints */
    #route;
    #networkManager;

    constructor() {
        this.#route = "/tijdlijn";
        this.#networkManager = new NetworkManager();

    }

     getStory() {
        return this.#networkManager.doRequest( this.#route, "GET");
    }

}