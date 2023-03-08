class loadAllUsersRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#loadAllUsers();
    }

    #loadAllUsers() {

        this.#app.get("/loadUsers", async (req, res) => {

            try {

                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT username, email from users where username = ? or email = ?",
                    values: [req.body.username, req.body.email]
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