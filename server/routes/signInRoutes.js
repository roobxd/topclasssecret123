class signInRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#postUser()
    }


    #postUser() {

        this.#app.post("/postuser", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO users(voornaam, tussenvoegsel, achternaam, password, email) values('','','',?,?)",
                    values: [req.body.password, req.body.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }


        });

    }

}

module.exports = signInRoutes;
