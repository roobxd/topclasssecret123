/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {SessionManager} from "./framework/utils/sessionManager.js"
import {LoginController} from "./controllers/loginController.js"
import {NavbarController} from "./controllers/navbarController.js"
import {NavbarLoggedController} from "./controllers/navbarControllerLogged.js"
import {UploadController} from "./controllers/uploadController.js"
import {WelcomeController} from "./controllers/welcomeController.js"
import {PostsController} from "./controllers/postsController.js"
import {EditController} from "./controllers/editController.js"
import {signUpController} from "./controllers/signUpController.js"
import {UpdatePasswordController} from "./controllers/updatePasswordController.js"
import {BulletinController} from "./controllers/bulletinController.js"
import {SupportController} from "./controllers/supportController.js";
import {PasswordUpdateMailController} from "./controllers/passwordUpdateMailController.js";
import {AccountSettingsController} from "./controllers/accountSettingsController.js";
import {AccountSettingsBewerkenController} from "./controllers/accountSettingsBewerkenController.js";
import {VerhalenController} from "./controllers/verhalenController.js";
import {IngelogdUpdatePasswordController} from "./controllers/ingelogdUpdatePasswordController.js";
import {TijdlijnController} from "./controllers/tijdlijnController.js";
import {readController} from "./controllers/readController.js";
import {myPostsController} from "./controllers/myPostsController.js";
import {InstantieController} from "./controllers/instantieController.js";
import {SocialMediaController} from "./controllers/socialMediaController.js";
import {BeveiligingController} from "./controllers/beveiligingController.js";
import {BulletinGedragController} from "./controllers/bulletinGedragController.js";
import {VerifieerAccountController} from "./controllers/verifieerAccountController.js";

export class App {
    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_NAVBAR_LOGGEDIN = "navbar_loggedin";
    static CONTROLLER_LOGOUT = "logout";
    static CONTROLLER_WELCOME = "welcome";
    static CONTROLLER_POSTS = "posts";
    static CONTROLLER_EDIT = "edit";
    static CONTROLLER_BULLETIN = "bulletin";
    static CONTROLLER_UPLOAD = "upload";
    static CONTROLLER_SIGNUP = "signUp";
    static CONTROLLER_UPDATEPASSWORD = "updatePassword";
    static CONTROLLER_SUPPORT = "support";
    static CONTROLLER_ACCOUNT_SETTINGS = "accountSettings";
    static CONTROLLER_ACCOUNT_SETTINGS_BEWERKEN = "accountSettingsBewerken";
    static CONTROLLER_INSTANTIE = "instantie";
    static CONTROLLER_SOCIALMEDIA = "socialMedia";
    static CONTROLLER_BEVEILIGING = "beveiliging";
    static CONTROLLER_BULLETINGEDRAG = "bulletinGedrag"
    static CONTROLLER_PASSWORDUPDATEMAIL = "passwordUpdateMail";
    static CONTROLLER_INGELOGDUPDATEPASSWORD = "ingelogdUpdatePassword";
    static CONTROLLER_VERHALEN = "verhalen";
    static CONTROLLER_TIJDLIJN = "tijdlijn";
    static CONTROLLER_VERIFIEERACCOUNT = "verification";
    static CONTROLLER_READ = "read";
    static CONTROLLER_MYPOSTS = "myposts";
    static CONTROLLER_LOGIN = "login";

    constructor() {
        //Always load the navigation
        if (App.sessionManager.get("email")) {
            App.loadController(App.CONTROLLER_NAVBAR_LOGGEDIN);
        } else {
            App.loadController(App.CONTROLLER_NAVBAR);
        }

        //Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
        App.loadControllerFromUrl(App.CONTROLLER_WELCOME);
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData) {
        console.log("loadController: " + name);

        //log the data if data is being passed via controllers
        if (controllerData && Object.entries(controllerData).length !== 0) {
            console.log(controllerData);
        }

        //Check for a special controller that shouldn't modify the URL
        switch (name) {

            case App.CONTROLLER_NAVBAR:
                new NavbarController();
                return true;

            case App.CONTROLLER_NAVBAR_LOGGEDIN:
                new NavbarLoggedController();
                return true;

            case App.CONTROLLER_LOGOUT:
                App.handleLogout();
                return true;
        }

        if (window.location.href.includes("read")) {
            new readController();
        }


        if (window.location.href.includes("myposts")) {
            new myPostsController();
        }

        if (window.location.href.includes("edit")) {
            new EditController();
        }




        //Otherwise, load any of the other controllers
        App.setCurrentController(name, controllerData);

        switch (name) {
            case App.CONTROLLER_LOGIN:
                App.isLoggedIn(() => new LoginController(), () => new LoginController());
                break;
            case App.CONTROLLER_VERHALEN:
                App.isLoggedIn(() => new VerhalenController(), () => new VerhalenController());
                break;
            case App.CONTROLLER_WELCOME:
                App.isLoggedIn(() => new WelcomeController(), () => new WelcomeController());
                break;
            case App.CONTROLLER_SIGNUP:
                App.isLoggedIn(() => new signUpController(), () => new signUpController());
                break;
            case App.CONTROLLER_BULLETIN:
                App.isLoggedIn(() => new BulletinController(), () => new LoginController());
                break;
            case App.CONTROLLER_POSTS:
                App.isLoggedIn(() => new PostsController(), () => new LoginController());
                break;
            case App.CONTROLLER_EDIT:
                App.isLoggedIn(() => new EditController(), () => new LoginController());
                break;
            case App.CONTROLLER_VERIFIEERACCOUNT:
                App.isLoggedIn(() => new VerifieerAccountController(), () => new LoginController())
                break;
            case App.CONTROLLER_UPDATEPASSWORD:
                App.isLoggedIn(() => new UpdatePasswordController(), () => new UpdatePasswordController());
                break;
            case App.CONTROLLER_INSTANTIE:
                App.isLoggedIn(() => new InstantieController(), () => new InstantieController());
                break;
            case App.CONTROLLER_BEVEILIGING:
                App.isLoggedIn(() => new BeveiligingController(), () => new BeveiligingController());
                break;
            case App.CONTROLLER_BULLETINGEDRAG:
                App.isLoggedIn(() => new BulletinGedragController(), () => new BulletinGedragController());
                break;
            case App.CONTROLLER_SOCIALMEDIA:
                App.isLoggedIn(() => new SocialMediaController(), () => new SocialMediaController());
                break;
            case App.CONTROLLER_INGELOGDUPDATEPASSWORD:
                App.isLoggedIn(() => new IngelogdUpdatePasswordController(), () => new LoginController())
                break;
            case App.CONTROLLER_UPLOAD:
                App.isLoggedIn(() => new UploadController(), () => new LoginController());
                break;
            case App.CONTROLLER_PASSWORDUPDATEMAIL:
                App.isLoggedIn(() => new PasswordUpdateMailController(), () => new PasswordUpdateMailController())
                break;
            case App.CONTROLLER_SUPPORT:
                App.isLoggedIn(() => new SupportController(), () => new LoginController())
                break;
            case App.CONTROLLER_ACCOUNT_SETTINGS:
                App.isLoggedIn(() => new AccountSettingsController(), () => new LoginController());
                break;
            case App.CONTROLLER_ACCOUNT_SETTINGS_BEWERKEN:
                App.isLoggedIn(() => new AccountSettingsBewerkenController(), () => new LoginController());
                break;
            case App.CONTROLLER_TIJDLIJN:
                App.isLoggedIn(() => new TijdlijnController(), () => new TijdlijnController());
                break;
            case App.CONTROLLER_READ:
                App.isLoggedIn(() => new readController(), () => new readController());
                break;
            case App.CONTROLLER_MYPOSTS:
                App.isLoggedIn(() => new myPostsController(), () => new myPostsController());
                break;


            default:
                return false;
        }

        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController.name, currentController.data)) {
                // App.loadController(fallbackController);
                if (window.location.hash.includes("tijdlijn") ||
                    window.location.hash.includes("read") ||
                    window.location.hash.includes("myposts") ||
                    window.location.hash.includes("edit")
                )
                    return;
                window.location.href = "#welcome";
            }
        } else {
            App.loadController(fallbackController);
        }
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        const fullPath = location.hash.slice(1);

        if (!fullPath) {
            return undefined;
        }

        const queryStringIndex = fullPath.indexOf("?");

        let path;
        let queryString;

        if (queryStringIndex >= 0) {
            path = fullPath.substring(0, queryStringIndex);
            queryString = Object.fromEntries(new URLSearchParams(fullPath.substring(queryStringIndex + 1)));
        } else {
            path = fullPath;
            queryString = undefined
        }

        return {
            name: path,
            data: queryString
        };
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     */
    static setCurrentController(name, controllerData) {
        if (App.dontSetCurrentController) {
            return;
        }

        if (controllerData) {
            history.pushState(undefined, undefined, `#${name}?${new URLSearchParams(controllerData)}`);
        } else {
            history.pushState(undefined, undefined, `#${name}`);
        }
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    static isLoggedIn(whenYes, whenNo) {
        if (App.sessionManager.get("email")) {
            whenYes();
            const loggedInElements = document.querySelectorAll('#whenLoggedIn');
            for (let i = 0; i < loggedInElements.length; i++) {
                loggedInElements[i].style.display = 'flex';
            }
        } else {
            whenNo();

            const loggedOutElements = document.querySelectorAll('#whenLoggedOut');
            for (let i = 0; i < loggedOutElements.length; i++) {
                console.log("Im logged out!");
                loggedOutElements[i].style.display = 'flex';
            }
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {
        App.sessionManager.remove("username");
        App.sessionManager.remove("email");

        //go to login screen
        App.loadController(App.CONTROLLER_NAVBAR);
        App.loadController(App.CONTROLLER_LOGIN);
    }
}

window.addEventListener("hashchange", function () {
    App.dontSetCurrentController = true;
    App.loadControllerFromUrl(App.CONTROLLER_WELCOME);
    App.dontSetCurrentController = false;
});

//When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", _ => {
    new App();
});