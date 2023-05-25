/**
 * This class contains ExpressJS routes specific for the Edit entity
 * this file is automatically loaded in app.js
 *
 * @author Rocco van Baardwijk
 */


class EditRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app
    // #id = require("../../src/assets/js/app.js");

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the rooms entity
        this.#update();

        this.#getPost();
    }

    /**
     * Update post endpoint
     * post request, data is sent by client via body - req.body
     * @private
     */
    #update() {

        this.#app.post("/edit/update", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE posts SET gebruiker = ?, onderwerp = ?, soortBericht = 'verhaal', bericht = ?, jaartalGebeurtenis = ?, plaatje = ?, publicatieDatum = CURRENT_TIMESTAMP, commentsenabled = ? WHERE id = ?",
                    values: [ req.body.gebruiker, req.body.titelinput, req.body.storyinput, req.body.dateinput, req.body.fileinput, req.body.yesorno, req.body.postid]
                });
                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }



    /**
     * dummy data example endpoint - rooms (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */
    #getPost() {
        this.#app.get("/edit/:lastnumber", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM `posts` WHERE id = ?",
                    values: [req.params.lastnumber]
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }
}

module.exports = EditRoutes