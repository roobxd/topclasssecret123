/**
 *
 * repository account settings
 */
import { NetworkManager } from "../framework/utils/networkManager";

export class AccountSettingsRepository {
    #networkManager;
    #getUsersRoute = "/getUsers";
    #updatePasswordRoute = "/getUsers/updatePassword";

    constructor() {
        this.#networkManager = new NetworkManager();
    }

    getUsers() {
        return this.#networkManager
            .doRequest(this.#getUsersRoute, "GET", {})
            .catch(error => {
                console.error("Error fetching users:", error);
                throw error;
            });
    }

    updatePassword(email, newPassword) {
        const data = {
            email: email,
            newPassword: newPassword
        };

        return this.#networkManager
            .doRequest(this.#updatePasswordRoute, "POST", data)
            .catch(error => {
                console.error("Error updating password:", error);
                throw error;
            });
    }
}
