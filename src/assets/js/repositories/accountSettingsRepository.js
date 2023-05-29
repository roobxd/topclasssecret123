/**
 *
 * repository account settings
 */
import {NetworkManager} from "../framework/utils/networkManager.js";


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

    updateIdentity(userId, identity) {
        console.log("updateIdentity called with userId:", userId, "and identity:", identity); // Added console.log

        const isPersoon = identity === "persoon";

        const data = {
            userId: userId,
            isPersoon: isPersoon,
        };

        console.log("Sending data to networkManager:", data); // Added console.log

        return this.#networkManager
            .doRequest("/updateIdentity", "POST", data)
            .then(response => {
                console.log("Response from networkManager:", response); // Added console.log
                return response;
            })
            .catch((error) => {
                console.error("Error updating identity:", error);
                throw error;
            });
    }


    updateNaam(currentId, newVoornaam, newAchternaam) {
        return this.getUsers()
            .then((users) => {
                const user = users.find((u) => u.id === currentId);
                if (!user) {
                    throw new Error("User not found");
                }
                const userId = user.id;

                const data = {
                    newVoornaam: newVoornaam,
                    newAchternaam: newAchternaam,
                    userId: userId,
                };

                return this.#networkManager
                    .doRequest("/updateNaam", "POST", data)
                    .catch((error) => {
                        console.error("Error updating user info:", error);
                        throw error;
                    });
            })
            .catch((error) => {
                console.error("Error getting users:", error);
                throw error;
            });
    }


    updateSocials(currentId, newInstagram, newTiktok, newFacebook) {
        return this.getUsers()
            .then((users) => {
                const user = users.find((u) => u.id === currentId)
                if (!user) {
                    throw new Error("User not found");
                }
                const userId = user.id;

                const data = {
                    instagram: newInstagram,
                    tiktok: newTiktok,
                    facebook: newFacebook,
                    userId: userId,
                };

                return this.#networkManager
                    .doRequest("/updateSocials", "POST", data)
                    .catch((error) => {
                        console.error("Error updating user info:", error);
                        throw error;
                    });
            })
            .catch((error) => {
                console.error("Error getting users:", error);
                throw error;
            });
    }

    updateEmail(currentEmail, newEmail) {
        return this.getUsers()
            .then((users) => {
                const user = users.find((u) => u.email === currentEmail);
                if (!user) {
                    throw new Error("User not found");
                }
                const userId = user.id;

                const data = {
                    newEmail: newEmail,
                    userId: userId,
                };

                return this.#networkManager
                    .doRequest("/updateEmail", "POST", data)
                    .catch((error) => {
                        console.error("Error updating email:", error);
                        throw error;
                    });
            })
            .catch((error) => {
                console.error("Error getting users:", error);
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
