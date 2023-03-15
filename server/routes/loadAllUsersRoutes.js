class loadAllUsersRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#loadAllUsers();
    }

    #loadAllUsers() {

        this.#app.get("/loadUsers/:email", async (req, res) => {

            try {

                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT email from users where email = ?",
                    values:[req.params.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
                console.log(data.length === 0)

            } catch (e) {
                res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: e});
            }


        });

    }


}

module.exports = loadAllUsersRoutes