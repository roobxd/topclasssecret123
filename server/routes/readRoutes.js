/**
 * Routes file for read entity
 * @author Rocco van Baardwijk
 */

class ReadRoutes {
    // Private instance variables for express app, database helper and http error codes
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper");
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    /**
     * Creates a new ReadRoutes instance.
     * @param {Object} app - Express application instance.
     */
    constructor(app) {
        this.#app = app;

        // Initialize all route handling methods.
        this.#readStory();
        this.#updateLikes();
        this.#updateDislikes();
        this.#submitComment();
        this.#updateCommentLikes();
        this.#updateCommentDislikes();
    }

    /**
     * Route handler for reading a story.
     * @private
     */
    #readStory(){
        this.#app.get("/read/:sid", async (req, res) => {
            // Execute the database queries
            const postQuery = { query: "SELECT * FROM posts where id = ?", values: [req.params.sid] };
            const commentsQuery = { query: "SELECT * FROM comments where post_id = ?", values: [req.params.sid] };

            // Await the data from the database
            const postData = await this.#databaseHelper.handleQuery(postQuery);
            const commentsData = await this.#databaseHelper.handleQuery(commentsQuery);

            // Prepare the response data
            const data = { post: postData, comments: commentsData }

            // Send response with the HTTP OK status and the JSON data.
            res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
        });
    }

    /**
     * Route handler for submitting a comment.
     * @private
     */
    #submitComment(){
        this.#app.post("/read/:sid/comment", async (req, res) => {
            // Execute the insert query with the request body data
            const data = await this.#databaseHelper.handleQuery({
                query: "INSERT INTO comments(bericht, creation_date, post_id, user_id, likes, dislikes) VALUES(?, CURRENT_TIMESTAMP, ?, ?, 0, 0)",
                values: [req.body.message, req.body.sid, req.body.user]
            });

            // Send response with the HTTP OK status and the JSON data.
            res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
        });
    }

    /**
     * Route handler for updating likes of a story.
     * @private
     */
    #updateLikes(){
        this.#app.post("/read/like", async (req, res) => {
            // Execute the update query with the request body data
            const data = await this.#databaseHelper.handleQuery({
                query: "UPDATE posts SET aantalLikes = aantalLikes + 1 WHERE id = ?",
                values: [req.body.sid]
            });

            // Send response with the HTTP OK status and the JSON data.
            res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
        });
    }

    /**
     * Route handler for updating dislikes of a story.
     * @private
     */
    #updateDislikes(){
        this.#app.post("/read/dislike", async (req, res) => {
            // Execute the update query with the request body data
            const data = await this.#databaseHelper.handleQuery({
                query: "UPDATE comments SET dislikes = dislikes + 1 WHERE id = ?",
                values: [req.body.sid]
            });

            // Send response with the HTTP OK status and the JSON data.
            res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
        });
    }

    /**
     * Route handler for updating likes of a comment.
     * @private
     */
    #updateCommentLikes(){
        this.#app.post("/read/comment-like", async (req, res) => {
            // Execute the update query with the request body data
            const data = await this.#databaseHelper.handleQuery({
                query: "UPDATE comments SET likes = likes + 1 WHERE post_id = ? AND bericht = ?",
                values: [req.body.sid, req.body.commentText]
            });

            // Send response with the HTTP OK status and the JSON data.
            res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
        });
    }

    /**
     * Route handler for updating dislikes of a comment.
     * @private
     */
    #updateCommentDislikes(){
        this.#app.post("/read/comment-dislike", async (req, res) => {
            // Execute the update query with the request body data
            const data = await this.#databaseHelper.handleQuery({
                query: "UPDATE comments SET dislikes = dislikes + 1 WHERE post_id = ? AND bericht = ? ",
                values: [req.body.sid, req.body.commentText]
            });

            // Send response with the HTTP OK status and the JSON data.
            res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
        });
    }
}

module.exports = ReadRoutes;
