/**
 * Deze klas is een repository voor de tijdlijn om endpoint met database te communiceren.
 */
export class TijdlijnRepository {
/* Attributen: route voor einpoints */
    #route;

    constructor() {
        this.#route = "/tijdlijn";
    }
}