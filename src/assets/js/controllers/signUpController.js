/**
 *
 * controller for sign in screen
 */
import { Controller } from "./controller.js";
import { signUpRepository } from "../repositories/signUpRepository.js";
import { App } from "../app.js";
import { loadAllUsersRepository } from "../repositories/loadAllUsersRepository.js";
import {SendMailRepository} from "../repositories/sendMailRepository.js";


export class signUpController extends Controller {
    #createSingInView;
    #signUpRepository;
    #loadAllUsersRepository;
    #sendMailRepository;


    constructor() {
        super();
        this.#signUpRepository = new signUpRepository();
        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#sendMailRepository = new SendMailRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#createSingInView = await super.loadHtmlIntoContent("html_views/signUp.html");


        this.#createSingInView.querySelector(".submitbutton").addEventListener("click", (event) => this.#saveUser(event));

        this.#createSingInView.querySelector(".login-container").addEventListener("click", event => App.loadController(App.CONTROLLER_LOGIN));

        let gaterugbutton = document.querySelector(".gaterug")
        gaterugbutton.addEventListener("click", () => {
            window.history.back();
        });

    }

  // ALI M EN T
    /**
     * Deze functie zorgt ervoor dat een gebruiker wordt gevalideerd en opgeslagen
     * @param event - Het gebeurtenisobject om het normale gedrag van een button te stoppen
     * @returns {Promise<void>}
     */
    async #saveUser(event) {

        event.preventDefault()

        const email = this.#createSingInView.querySelector("#email")
        const password = this.#createSingInView.querySelector("#password")
        const confirmPassword = this.#createSingInView.querySelector("#confirm_password")

        //emailcheck----------
        let emailcheck = false;
        // Er wordt gecheckt of de email aan de voorwaarden voldoet
        if (email.value.length === 0) {
            this.#setErrorfor(email, "email mag niet leeg zijn!")
        } else if (!this.#isEmail(email.value)) {
            this.#setErrorfor(email, "email moet een mail zijn!")
        } else {
            this.#setSuccesfor(email)

            // database opvragen gegevens en checken of mail al bestaat
            try {

                let data = await this.#loadAllUsersRepository.loadUsers(email.value);

                if (data.length === 0) {
                    this.#setSuccesfor(email)
                    emailcheck = true;
                } else {
                    this.#setErrorfor(email, "gebruikersnaam of Mail is al in gebruik")
                }
            } catch (e) {
                console.log(e)
            }


        }
        //password check
        let passwordCheck = false;

        if (password.value === "") {
            this.#setErrorfor(password, "Wachtwoord mag niet leeg zijn!")
        } else if (!this.#paswordPatternCheck(password.value)) {
            this.#setErrorfor(password, "Wachtwoord moet minimaal 1 hoofdletter,1 kleine letter, 1 leesteken en een cijfer hebben. ")
        } else if (password.value > 8) {
            this.#setErrorfor(password, "Wachtwoord mag niet langer dan 8 characters zijn!")

        } else {
            this.#setSuccesfor(password)
            passwordCheck = true;
        }
        //confirm password check
        let confirmPasswordCheck = false;


        if (confirmPassword.value === "") {
            this.#setErrorfor(confirmPassword, "Verificatie wachtwoord mag niet leeg zijn!")
        } else if (confirmPassword.value > 8) {
            this.#setErrorfor(confirmPassword, "Wachtwoord mag niet langer dan 8 characters zijn!")
        } else if (password.value !== confirmPassword.value) {
            this.#setErrorfor(confirmPassword, "Wachtwoord komt niet overeen!")
        } else {
            this.#setSuccesfor(confirmPassword)
            confirmPasswordCheck = true;
        }
        // checkt of alle ingevulde velden goed zijn en insert in de database. Ook wordt er een verificatie
        // en welkom mail gestuurd
        if (emailcheck && passwordCheck && confirmPasswordCheck) {
            alert("aanmelding is gelukt");
            // toevoegen aan database --------------------------
            this.#signUpRepository.signUpUser(password.value, email.value);
            this.#sendMailRepository.sendVerificationMail(email.value);
            this.#sendMailRepository.sendWelkomMail(email.value);
            App.loadController(App.CONTROLLER_LOGIN);
        }

    }
      // Ali einde M EN T

    
    //minimaal 1 hoofdletter,1 kleine letter, 1 leesteken en een cijfer
    #paswordPatternCheck(password) {
        return /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password) &&
            password.length > 4;
    }

    #isEmail(email) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
    }

    // Element wordt gehaald uit de html en er wordt een error bericht geprint
    #setErrorfor(message) {

        const small = this.#createSingInView.querySelector(".error");

        small.innerHTML = message;

    }

    // Element wordt gehaald uit de html en wordt weer leeg gehaald
    #setSuccesfor() {

        const small = this.#createSingInView.querySelector(".error");

        small.innerHTML = "";

    }

}