/**
 *
 */

class TijdlijnRoutes {
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;

    constructor(app) {
        this.#app = app;
        this.#getstory();
    }

    #getstory() {
        this.#app.get("/tijdlijn", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM pad_flo_7_dev.posts ORDER BY jaartalGebeurtenis ASC",
                    values: []
                });

                //just give all data back as json, could also be empty
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({result: data});



            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }
}

module.exports = TijdlijnRoutes;