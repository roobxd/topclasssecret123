/**
 * Routes file for posts entity
 * @author Rocco van Baardwijk
 */

class PostsRoutes {
    // Private instance variables for error codes, database helper and express app.
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    /**
     * Creates a new PostsRoutes instance.
     * @param {Object} app - ExpressJS application instance. 
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        // Initialize all route handling methods.
        this.#create();
        this.#getAll();
        this.#getUserTypes();
    }

    /**
     * Route handler for creating a new post.
     * @private
     */
    #create() {
        this.#app.post("/posts", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO posts(gebruiker, onderwerp, soortBericht, bericht, jaartalGebeurtenis, plaatje, publicatieDatum, commentsenabled) values (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
                    values: [req.body.gebruiker, req.body.titelinput, req.body.storytype, req.body.storyinput, req.body.dateinput, req.body.imagePath, req.body.yesorno]
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
     * Route handler for getting all posts.
     * @private
     */
    #getAll() {
        this.#app.get("/welcome", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM `posts` ORDER BY ID"
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
     * Route handler for getting all stories with their respective users.
     * @private
     */
    #getUserTypes() {
        this.#app.get("/posts/stories", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT posts.id as 'postID', posts.gebruiker, posts.onderwerp, posts.soortBericht, posts.bericht, posts.jaartalGebeurtenis, posts.plaatje, posts.publicatieDatum, posts.aantalLikes, posts.aantalDislikes, users.id as 'userID', users.persoon FROM pad_flo_7_dev.posts INNER JOIN users ON posts.gebruiker = users.id WHERE `jaartalGebeurtenis` ORDER BY 'postID' ASC"
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

module.exports = PostsRoutes;
