/**
 * This class contains ExpressJS routes specific for the roomsExample entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */

class PostsRoutes {
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
        this.#getPostsAll()
    }


    /**
     * dummy data example endpoint - rooms (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */
    #getPostsAll() {
        this.#app.get("/posts", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT bericht FROM rooms_example WHERE id = ?",
                    values: [1]
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
                console.log(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }
}

module.exports = PostsRoutes