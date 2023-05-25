class VerifierAccountRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        this.#verifier()
    }

    #verifier() {

        this.#app.post("/verificatie", async (req, res) => {

            const inputCode = req.body.inputCode
            const check = await this.#databaseHelper.handleQuery(
                {
                    query: "SELECT * FROM users where OTP = ?",
                    values: [inputCode]
                });


            if (check.length > 0) {
                try {
                    const data = await this.#databaseHelper.handleQuery({
                        query: "Update users set verificatie = 1 where email = ?",
                        values: [req.body.email]
                    });
                    const data1 = await this.#databaseHelper.handleQuery({
                        query: "Update users set OTP = 1 where email = ?",
                        values: [req.body.email]
                    });


                    res.status(this.#errorCodes.HTTP_OK_CODE).json(check);

                } catch (e) {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
                }
            }


        });

    }
}

module.exports = VerifierAccountRoutes