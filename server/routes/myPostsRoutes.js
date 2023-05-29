/**
 * 
 * Routes file for read entity
 * @author Rocco van Baardwijk
 */

class MyPostsRoutes {
    #app
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;

        this.#getStories();

        this.#delete();
    }

    #getStories(){
        this.#app.get("/myposts/:userid", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM posts WHERE gebruiker = ?",
                    values: [req.params.userid]
                });
                
                //just give all data back as json, could also be empty
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
    
            } catch (e) { // Fix the catch parameter name here
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #delete() {
        this.#app.post("/myposts/delete", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "DELETE FROM posts WHERE id = ? ",
                    values: [req.body.sid]
                });

                //just give all data back as json, could also be empty
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }
}

module.exports = MyPostsRoutes;