class loadAllUsersRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#loadAllUsers();
    }

    // M EN T ALI
    /**
     * Loads user data from the database based on the provided email.
     *
     */
    #loadAllUsers() {

        // sets dynamic value with :
        this.#app.get("/loadUsers/:email", async (req, res) => {

            try {


                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT email from users where email = ?",
                    values:[req.params.email]
                });

                // sets the response status to succesful
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                //sets the response status to failed
                res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: e});
            }


        });

    }


}

module.exports = loadAllUsersRoutes