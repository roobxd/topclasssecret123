/**
 * Controller for the timeline, to integrate the timeline with welcome page and show data from database in the timeline.
 */
import {Controller} from "./controller.js";
import {TijdlijnRepository} from "../repositories/tijdlijnRepository.js";
import { App } from "../app.js";

export class TijdlijnController extends Controller{
    #tijdlijnView;
    #tijdlijnRepository;

    constructor() {
        super();
        this.#tijdlijnRepository = new TijdlijnRepository();
       this.#initializeView;

    }

    async #initializeView(){
        this.#tijdlijnView = await super.loadHtmlIntoContent("html_views/tijdlijn.html");

        console.log(this.#tijdlijnView);

    }

}