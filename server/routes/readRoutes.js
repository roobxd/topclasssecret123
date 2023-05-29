/**
 * 
 * Routes file for read entity
 * @author Rocco van Baardwijk
 */

class ReadRoutes {
    #app
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;

        this.#readStory();

        this.#updateLikes();

        this.#updateDislikes();

        this.#submitComment();

        this.#updateCommentLikes();

        this.#updateCommentDislikes();
    }

    #readStory(){
        this.#app.get("/read/:sid", async (req, res) => {
            try {
                const postQuery = {
                    query: "SELECT * FROM posts where id = ?",
                    values: [req.params.sid]
                };
                
                const commentsQuery = {
                    query: "SELECT * FROM comments where post_id = ?",
                    values: [req.params.sid]
                };

                const wholikedwhat = {
                    query: "SELECT * FROM wholikedwhat"
                };
                
                const postData = await this.#databaseHelper.handleQuery(postQuery);
                const commentsData = await this.#databaseHelper.handleQuery(commentsQuery);
                const whoData = await this.#databaseHelper.handleQuery(wholikedwhat);
                
                const data = {
                    post: postData,
                    comments: commentsData,
                    wholikedwhat: whoData
                }
                
                // Just give all data back as json, could also be empty
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
        
            } catch (e) { // Fix the catch parameter name here
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
    

    #submitComment(){
        this.#app.post("/read/:sid/comment", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO comments(bericht, creation_date, post_id, user_id, likes, dislikes) VALUES(?, CURRENT_TIMESTAMP, ?, ?, 0, 0)",
                    values: [req.body.message, req.body.sid, req.body.user]
                });
                //just give all data back as json, could also be empty
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
    
            } catch (e) { // Fix the catch parameter name here
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
    
    
    #updateLikes(){
        this.#app.post("/read/like", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE posts SET aantalLikes = aantalLikes + 1 WHERE id = ?",
                    values: [req.body.sid]
                });

                if(data.affectedRows){
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
                }
            } catch (error) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: error});
            }
        });
    }

    #updateDislikes(){
        this.#app.post("/read/dislike", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE comments SET dislikes = dislikes + 1 WHERE id = ?",
                    values: [req.body.sid]
                });

                if(data.affectedRows){
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
                }
            } catch (error) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: error});
            }
        });
    }

    #updateCommentLikes(){
        this.#app.post("/read/comment-like", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE comments SET likes = likes + 1 WHERE post_id = ? AND bericht = ?",
                    values: [req.body.sid, req.body.commentText]
                });

                if(data.affectedRows){
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
                }
            } catch (error) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: error});
            }
        });
    }

    #updateCommentDislikes(){
        this.#app.post("/read/comment-dislike", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE comments SET dislikes = dislikes + 1 WHERE post_id = ? AND bericht = ? ",
                    values: [req.body.sid, req.body.commentText]
                });

                if(data.affectedRows){
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.affectedRows});
                }
            } catch (error) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: error});
            }
        });
    }
}

module.exports = ReadRoutes;