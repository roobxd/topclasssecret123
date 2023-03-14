/**
 *
 * controller for sign in screen
 */
import {Controller} from "./controller.js";
import {signUpRepository} from "../repositories/signUpRepository.js";
import {loadAllUsersRepository} from "../repositories/loadAllUsersRepository.js";


export class signUpController extends Controller {
    #createSingInView;
    #signUpRepository;
    #loadAllUsersRepository;


    constructor() {
        super();
        this.#signUpRepository = new signUpRepository();
        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#createSingInView = await super.loadHtmlIntoContent("html_views/signUp.html");


        this.#createSingInView.querySelector(".register-button").addEventListener("click",
            (event) => this.#saveUser(event))

    }


    async #saveUser(event) {

        event.preventDefault()
        const name = this.#createSingInView.querySelector("#fullname")
        const email = this.#createSingInView.querySelector("#email")
        const password = this.#createSingInView.querySelector("#password")
        const confirmPassword = this.#createSingInView.querySelector("#confirm_password")


        console.log(name.value + " " + email.value)


        //naamcheck--------------------
        // / mag niet
        let namecheck = false;

        if (name.value.length === 0) {
            this.#setErrorfor(name, "Gebruikersnaam mag niet leeg zijn!")
        } else if (name.value.length > 10) {
            //show error
            this.#setErrorfor(name, "Gebruikersnaam mag maximaal 10 characters hebben!")

        } else {
            //user data opvragen database
            this.#setSuccesfor(name);

            try {
                let data = await this.#loadAllUsersRepository.loadUsers(name.value, email.value);
                console.log(data)

                if (data.length === 0) {
                    // als naam niet bestaat
                    namecheck = true;
                    this.#setSuccesfor(name)
                } else {
                    this.#setErrorfor(name, "Gebruikersnaam of email is al in gebruik")
                }
            } catch (e) {
                console.log(e)
            }

        }


        //emailcheck----------

        let emailcheck = false;

        if (email.value.length === 0) {
            this.#setErrorfor(email, "email mag niet leeg zijn!")
        } else if (!this.#isEmail(email.value)) {
            this.#setErrorfor(email, "email moet een mail zijn!")
        } else {
            // database opvragen gegevens en checken of mail al bestaat
            this.#setSuccesfor(email)

            try {

                let data = await this.#loadAllUsersRepository.loadUsers(name.value, email.value);

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


        // checkt of alle checkt true zijn en insert alles in de database
        if (namecheck && emailcheck && passwordCheck && confirmPasswordCheck) {
            alert("aanmelding is gelukt")

            // toevoegen aan database --------------------------
            this.#signUpRepository.signUpUser(name.value, password.value, email.value)

        }

    }

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

    #setErrorfor(input, message) {

        const parentElementInput = input.parentElement;  // pakt parentelement
        const small = parentElementInput.querySelector('.error')

        small.innerText = message;

    }

    #setSuccesfor(input) {

        const parentElementInput = input.parentElement;  // pakt parentelement
        const small = parentElementInput.querySelector('.error')

        small.innerText = "";

    }

}