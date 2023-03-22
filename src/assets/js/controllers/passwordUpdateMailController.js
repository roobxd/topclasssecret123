import {Controller} from "./controller.js";
import {loadAllUsersRepository} from "../repositories/loadAllUsersRepository.js";


export class PasswordUpdateMailController extends Controller {
    #MailUpdatePasswordView
    #loadAllUsersRepository


    constructor() {
        super();

        this.#loadAllUsersRepository = new loadAllUsersRepository();
        this.#setupView()
    }


    async #setupView() {
        this.#MailUpdatePasswordView = await super.loadHtmlIntoContent("html_views/passwordUpdateMail")


    }


    async #checkMail() {

        try {
            let data = await this.#loadAllUsersRepository.loadUsers(email.value)


        } catch (e) {

        }
    }


}


