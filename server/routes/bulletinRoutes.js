/**
 * This class contains ExpressJS routes specific for the bulletin entity
 * this file is automatically loaded in app.js
 *
 * @author Rocco van Baardwijk
 */

class BulletinRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the rooms entity
        this.#create();

        this.#getAll();
    }

    /**
     * bulletin creation data endpoint - bulletin.html view (bulletin creation screen)
     * get request, data is sent by client via url - req.params
     * @private
     */
    #create() {
        this.#app.post("/bulletin", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO posts(gebruiker, onderwerp, soortBericht, bericht, jaartalGebeurtenis, plaatje, publicatieDatum, commentsenabled) values(?, ?, 'bulletin', ?, CURRENT_TIMESTAMP, '/uploads/geen.png', CURRENT_TIMESTAMP, 0) ",
                    values: [req.body.userid, req.body.titel, req.body.verhaal]
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }


    /**
     * bulletin dummy data example endpoint - welcome.html (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */
    #getAll() {
        this.#app.get("/welcome", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM posts"
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }
}

module.exports = BulletinRoutes