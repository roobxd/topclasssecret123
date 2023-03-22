/**
 *
 * repository account settings
 */
import { NetworkManager } from "../framework/utils/networkManager.js";


export class AccountSettingsRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/updatePassword";
        this.#networkManager = new NetworkManager();

    }


    getUsers() {
        const getUsersRoute = "/getUsers";
        return this.#networkManager
            .doRequest(getUsersRoute, "GET", {})
            .catch(error => {
                console.error("Error fetching users:", error);
                throw error;
            });
    }


    updatePassword(email, newPassword, confirmPassword) {
        // Get user ID from the email
        return this.getUsers()
            .then((users) => {
                const user = users.find((u) => u.email === email);
                if (!user) {
                    throw new Error("User not found");
                }
                const userId = user.id;

                // Send request with the required data
                const data = {
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                    userId: userId,
                };

                return this.#networkManager
                    .doRequest(this.#route, "POST", data)
                    .catch((error) => {
                        console.error("Error updating password:", error);
                        throw error;
                    });
            })
            .catch((error) => {
                console.error("Error getting users:", error);
                throw error;
            });
    }
}
