class CheckVerificatieRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        this.#checkVerificatie()
    }


    #checkVerificatie() {

        try {
            this.#app.get("/verificatie/result/:email", async (req, res) => {

                const check = await this.#databaseHelper.handleQuery(
                    {
                        query: "SELECT * FROM users where email =?",
                        values: [req.params.email]
                    });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(check);
            })
        } catch (e) {
            res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
        }

    }
}

module.exports = CheckVerificatieRoutes