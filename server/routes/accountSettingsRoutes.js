class AccountSettingsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    constructor(app) {
        this.#app = app;

        this.#getUsers();
        this.#updatePassword();
    }

    #getUsers() {
        this.#app.get("/getUsers", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT id, email, password FROM users",
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
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

                            res.status(this.#errorCodes.HTTP_OK_CODE).json({ data });
                        } catch (e) {
                            res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ message: "Database was not queried correctly", error: e });
                        }
                    } else {
                        res.status(this.#errorCodes.BAD_REQUEST_CODE).json("Passwords do not match");
                    }
                } else {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ message: "Input is NaN or missing", reason: e });
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ message: "Error processing request", reason: e });
            }
        });
    }
}

module.exports = AccountSettingsRoutes;
