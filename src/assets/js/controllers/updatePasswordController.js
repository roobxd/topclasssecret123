import {Controller} from "./controller.js";
import {UpdatePasswordRepository} from "../repositories/updatePasswordRepository.js";

export class UpdatePasswordController extends Controller {

    #updatePasswordRepository
    #newPasswordView


    constructor() {
        super();

        this.#updatePasswordRepository = new UpdatePasswordRepository();
        this.#setupview()
    }

    #setupview() {
        this.#newPasswordView = super.loadHtmlIntoContent("html_views/updatePassword.html")

    }

}
