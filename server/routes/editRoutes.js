/**
 * Routes file for edit entity
 * @author Rocco van Baardwijk
 */


class EditRoutes {
    // Private instance variables for error codes, database helper and express app.
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    /**
     * Creates a new EditRoutes instance.
     * @param {Object} app - ExpressJS application instance. 
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        // Initialize all route handling methods.
        this.#update();
        this.#getPost();
    }

    /**
     * Route handler for updating a post.
     * @private
     */
    #update() {
        this.#app.post("/edit/update", async (req, res) => {
            try {
                // Execute the update query with the provided data.
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE posts SET gebruiker = ?, onderwerp = ?, soortBericht = ?, bericht = ?, jaartalGebeurtenis = ?, plaatje = ?, publicatieDatum = CURRENT_TIMESTAMP, commentsenabled = ? WHERE id = ?",
                    values: [req.body.gebruiker, req.body.titelinput, req.body.storytype, req.body.storyinput, req.body.dateinput, req.body.fileinput, req.body.yesorno, req.body.postid]
                });

                // Send response with the HTTP OK status and the JSON data.
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                // Send response with the HTTP BAD REQUEST status and the error message.
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Route handler for getting a post.
     * @private
     */
    #getPost() {
        this.#app.get("/edit/:lastnumber", async (req, res) => {
            try {
                // Execute the select query with the post ID.
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM `posts` WHERE id = ?",
                    values: [req.params.lastnumber]
                });

                // Send response with the HTTP OK status and the JSON data.
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                // Send response with the HTTP BAD REQUEST status and the error message.
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }
}

module.exports = EditRoutes;
