const fs = require("fs");

class AccountSettingsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #multer = require("multer");

    #app;

    constructor(app) {
        this.#app = app;

        this.#getUsers();
        this.#updateEmail();
        this.#updateNaam();
        this.#updatePassword();
        this.#uploadProfilePicture();
        this.#updateIdentity();
    }

    #getUsers() {
        this.#app.get("/getUsers", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT id,voornaam,achternaam, email, password FROM users",
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #updateEmail() {
        this.#app.post("/updateEmail", async (req, res) => {
            try {
                const newEmail = req.body.newEmail;
                const userId = req.body.userId;

                if (newEmail && userId) {
                    try {
                        const data = await this.#databaseHelper.handleQuery({
                            query: "UPDATE users SET email= ? WHERE id= ?",
                            values: [newEmail, userId],
                        });

                        res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                    } catch (e) {
                        res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                            message: "Database was not queried correctly",
                            error: e
                        });
                    }
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json("Input is NaN or missing" + {reason: e});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json("Error processing request: " + {reason: e});
            }
        });
    }

    #updateNaam() {
        this.#app.post("/updateNaam", async (req, res) => {
            try {
                const newVoornaam = req.body.newVoornaam;
                const newAchternaam = req.body.newAchternaam;
                const userId = req.body.userId;

                if (newVoornaam && userId) {
                    try {
                        const data = await this.#databaseHelper.handleQuery({
                            query: "UPDATE users SET voornaam = ?, achternaam = ?  WHERE id= ?",
                            values: [newVoornaam, newAchternaam, userId],
                        });

                        res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                    } catch (e) {
                        res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                            message: "Database was not queried correctly",
                            error: e
                        });
                    }
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json("Input is NaN or missing" + {reason: e});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json("Error processing request: " + {reason: e});
            }
        });
    }

    #updateIdentity() {
        this.#app.post("/updateIdentity", async (req, res) => {
            try {
                const isPersoon = req.body.isPersoon;
                const userId = req.body.userId;

                if (typeof isPersoon !== "undefined" && userId) {
                    const data = await this.#databaseHelper.handleQuery({
                        query: "UPDATE `users` SET `persoon` = ? WHERE `id` = ?",
                        values: [isPersoon, userId],
                    });

                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({message: "Input is NaN or missing"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({message: "Error processing request", reason: e});
            }
        });
    }


    #updatePassword() {
        this.#app.post("/updatePassword", async (req, res) => {
            try {
                const newPassword = req.body.newPassword;
                const confirmPassword = req.body.confirmPassword;
                const userId = req.body.userId;

                if (newPassword && confirmPassword && userId) {
                    if (newPassword === confirmPassword) {
                        try {
                            const data = await this.#databaseHelper.handleQuery({
                                query: "UPDATE `users` SET `password`= ? WHERE `id` = ?",
                                values: [newPassword, userId],
                            });

                            res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                        } catch (e) {
                            res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                                message: "Database was not queried correctly",
                                error: e
                            });
                        }
                    } else {
                        res.status(this.#errorCodes.BAD_REQUEST_CODE).json("Passwords do not match");
                    }
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({message: "Input is NaN or missing", reason: e});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({message: "Error processing request", reason: e});
            }
        });
    }

    #uploadProfilePicture() {
        this.#app.post("/uploadProfilePicture", this.#multer().single("profilePic"), async (req, res) => {

            if (!req.file) {
                return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "No file was uploaded."});
            }

            // Get the user ID from the request (assuming it's provided)
            const userId = req.body.userId;
            if (!userId) {
                return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "User ID not provided."});
            }

            // Generate a unique filename for the profile picture using the user ID
            const uniqueFilename = `profile_picture_${userId}.jpg`;

            // Save the file to the server
            const profilePicturePath = wwwrootPath + "/uploads/" + uniqueFilename;
            fs.writeFile(profilePicturePath, req.file.buffer, async (err) => {
                if (err) {
                    console.log(err)
                    return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: err});
                }

                // Update the user's profile picture in the database
                try {
                    await this.#databaseHelper.handleQuery({
                        query: "UPDATE `users` SET `profielFoto` = ? WHERE `id` = ?",
                        values: [uniqueFilename, userId],
                    });

                    return res.status(this.#errorCodes.HTTP_OK_CODE).json("Profile picture successfully uploaded!");

                } catch (e) {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                        message: "Database was not queried correctly",
                        error: e
                    });
                }
            });
        });
    }
}

module.exports = AccountSettingsRoutes;
