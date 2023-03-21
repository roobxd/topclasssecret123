/**
class testSum {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#insertPost()
    }


    #insertPost(){

        this.#app.post("/", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query:
                        "INSERT INTO `posts` (id, gebruiker, onderwerp, soortBericht, bericht, jaartalGebeurtenis, " +
                        "plaatje, publicatieDatum) VALUES (?,?,?,?,?,?,?,?)",
                    values: [req.body.id, req.body.email, req.body.subject, req.body.typeOfPost, req.body.post, req.body.year, req.body.LocalDa]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }


        });

    }

}

module.exports = testSum;
 */