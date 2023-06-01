/**
 * Routes file for read entity
 * @author Rocco van Baardwijk
 */

class MyPostsRoutes {
    // Private instance variables for express app, database helper and http error codes
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper");
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    /**
     * Creates a new MyPostsRoutes instance.
     * @param {Object} app - Express application instance.
     */
    constructor(app) {
        this.#app = app;

        // Initialize all route handling methods.
        this.#getStories();
        this.#delete();
    }

    /**
     * Route handler for getting stories by user.
     * @private
     */
    #getStories(){
        this.#app.get("/myposts/:userid", async (req, res) => {
            try {
                // Execute the database query with the user ID
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM posts WHERE gebruiker = ?",
                    values: [req.params.userid]
                });

                // Send response with the HTTP OK status and the JSON data.
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                // Send response with the HTTP BAD REQUEST status and the error message.
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Route handler for deleting a post.
     * @private
     */
    #delete() {
        this.#app.post("/myposts/delete", async (req, res) => {
            try {
                // Execute the delete query with the post ID
                const data = await this.#databaseHelper.handleQuery({
                    query: "DELETE FROM posts WHERE id = ? ",
                    values: [req.body.sid]
                });

                // Send response with the HTTP OK status and the JSON data.
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                // Send response with the HTTP BAD REQUEST status and the error message.
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }
}

module.exports = MyPostsRoutes;
