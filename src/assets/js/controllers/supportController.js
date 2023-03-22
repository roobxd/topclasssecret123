/**
 * Controller for support page
 * @author Kifle
 */
import {Controller} from "./controller.js";
import {SupportRepository} from "../repositories/supportRepository.js";


export class SupportController extends Controller{
    #supportView
    #supportRepository;

    constructor() {
        super();
        this.#supportRepository = new SupportRepository();
        this.#initializeView();
    }

    async #initializeView() {
        this.#supportView = await super.loadHtmlIntoContent("html_views/support.html");

        console.log(this.#supportView);
        this.#supportView.querySelector(".btn").addEventListener("click",
            (event) => this.#sendData(event));


    }

    /**
     * This method sends name, email and question to database
     * @param evt: prevents default
     */
    #sendData(evt){

        evt.preventDefault();
        console.log("Dit werkt");

        const email = this.#supportView.querySelector("#email").value;
        const name = this.#supportView.querySelector("#name").value;
        const  question = this.#supportView.querySelector("#question").value;

        console.log(email + name + question);

        const  reactie = this.#supportView.querySelector(".formReactie");
        if (email.length === 0 || name.length === 0 || question.length === 0 ){
            reactie.style.color = "Red";
            reactie.innerHTML = "Email en naam mogen niet leeg zijn";
        } else{
             this.#supportRepository.support(name, email, question);
             
            reactie.innerHTML = "Bedankt voor je vraag. We hebben je vraag ontvangen!";

        }

    }



}