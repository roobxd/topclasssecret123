/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { SessionManager } from "./framework/utils/sessionManager.js"
import { LoginController } from "./controllers/loginController.js"
import { NavbarController } from "./controllers/navbarController.js"
import { UploadController } from "./controllers/uploadController.js"
import { WelcomeController } from "./controllers/welcomeController.js"
import { PostsController } from "./controllers/postsController.js"

export class App {
    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_LOGIN = "login";
    static CONTROLLER_LOGOUT = "logout";
    static CONTROLLER_WELCOME = "welcome";
    static CONTROLLER_POSTS = "posts";
    static CONTROLLER_UPLOAD = "upload";

    constructor() {
        //Always load the navigation
        App.loadController(App.CONTROLLER_NAVBAR);

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

            case App.CONTROLLER_LOGOUT:
                App.handleLogout();
                return true;
        }

        //Otherwise, load any of the other controllers
        App.setCurrentController(name, controllerData);

        switch (name) {
            case App.CONTROLLER_LOGIN:
                App.isLoggedIn(() => new WelcomeController(), () => new LoginController());
                break;

            case App.CONTROLLER_WELCOME:
                App.isLoggedIn(() => new WelcomeController(), () => new LoginController());
                break;

            case App.CONTROLLER_POSTS:
                App.isLoggedIn(() => new PostsController(), () => new LoginController());
                break;

            case App.CONTROLLER_UPLOAD:
                App.isLoggedIn(() => new UploadController(), () => new LoginController());
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
                App.loadController(fallbackController);
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
        }
        else {
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
        }
        else {
            history.pushState(undefined, undefined, `#${name}`);
        }
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    static isLoggedIn(whenYes, whenNo) {
        if (App.sessionManager.get("username")) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {

        const loggedins = document.querySelectorAll('.loggedin');
        const loggedouts = document.querySelectorAll('.loggedout');

        // Loop through each <a> element and add "nav-link" class name
        loggedouts.forEach(link => {
            link.classList.remove('loggedout');
            link.classList.add('loggedin');
        });

        // Loop through each <a> element and add "nav-link" class name
        loggedins.forEach(link => {
            link.classList.remove('loggedin');
            link.classList.add('loggedout');
        });


        App.sessionManager.remove("username");
        App.sessionManager.remove("email");

        //go to login screen
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