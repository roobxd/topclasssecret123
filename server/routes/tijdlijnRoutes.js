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
        this.#getUser()
    }

    #getstory() {
        this.#app.get("/tijdlijn/:beginDate/:endDate" , async (req, res) => {
            console.log(req.params.beginDate + " / " + req.params.endDate)

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT posts.id as story_id, posts.gebruiker, posts.onderwerp, posts.soortBericht, posts.bericht, posts.jaartalGebeurtenis, posts.plaatje, posts.publicatieDatum, posts.aantalLikes, posts.aantalDislikes, users.id, users.persoon FROM pad_flo_7_dev.posts LEFT JOIN users ON posts.gebruiker = users.id WHERE `jaartalGebeurtenis` BETWEEN ? AND ? ORDER BY `jaartalGebeurtenis` ASC",
                    values: [ req.params.beginDate, req.params.endDate]
                });

                //just give all data back as json, could also be empty
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({result: data});



            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }


    #getUser() {
        this.#app.get("/tijdlijn/users/:id" , async (req, res) => {
            // console.log(req.params.beginDate + " / " + req.params.endDate)

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT id, persoon FROM pad_flo_7_dev.users WHERE id = ?",
                    values: [req.params.id]
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