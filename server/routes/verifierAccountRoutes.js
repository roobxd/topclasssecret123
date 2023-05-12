class VerifierAccountRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        this.#verifier()
    }

    #verifier(){

        this.#app.post("/verificatie", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "Update users set verificatie values(1) where email = ?",
                    values: [req.body.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }


        });

    }

}

module.exports = VerifierAccountRoutes