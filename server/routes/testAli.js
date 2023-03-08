class testAli {/* test */


    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#testapi()
        this.#testapipost()
    }


    #testapi() {

        this.#app.get("/testlezen", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT bericht from posts where id = ?",
                    values: [9]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }

    #testapipost() {

        this.#app.post("/testtoevoegen", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "insert into posts(id, bericht) values (?,?)",
                    values: [req.body.id, req.body.bericht]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });

    }


}

module.exports = testAli;
