/**
 * Controller for support page
 * @author Kifle
 */
import {Controller} from "./controller.js";
import {SupportRepository} from "../repositories/supportRepository.js";
import {App} from "../app.js";
import {SendMailRepository} from "../repositories/sendMailRepository.js";


export class SupportController extends Controller{
    #supportView
    #supportRepository;
    #sendMailRepository;

    constructor() {
        super();
        this.#supportRepository = new SupportRepository();
        this.#sendMailRepository = new SendMailRepository();
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
    async #sendData(evt){

        evt.preventDefault();
        console.log("Dit werkt");

        const email = this.#supportView.querySelector("#email").value;
        const name = this.#supportView.querySelector("#name").value;
        const  question = this.#supportView.querySelector("#question").value;

        console.log(email + name + question);

        const  reactieBox = this.#supportView.querySelector(".formReactie");
        if (email.length === 0 || name.length === 0 || question.length === 0 ){
            reactieBox.style.color = "Red";
            reactieBox.innerHTML = "Email, naam en vraag moeten ingevuld worden.";
            return;
        }
           try {
               const data = await this.#supportRepository.support(name, email, question);
               // const sendMail = await this.#supportRepository.sendContactInformation(name, email, question);
               const sendMail = await  this.#sendMailRepository.sendAnswerMail(email, question);
               // console.log(data);
               // console.log(sendMail);
               // console.log(sendMail);
               reactieBox.innerHTML = "Bedankt voor jouw vraag. We hebben jouw reactie ontvangen!"
               // if (data.id){
               //     APP.loadController(APP.CONTROLLER_WELCOME);
               // }
           }catch (error){
            reactieBox.innerHTML = "Er is iets fout gegaan bij het indienen."
            console.log(error);
           }
    }



}