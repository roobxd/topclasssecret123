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
        this.#create();

        this.#getAll();

        this.#getUserTypes()
    }

    /**
     * dummy data example endpoint - rooms (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */
    #create() {

        this.#app.post("/posts", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO posts(gebruiker, onderwerp, soortBericht, bericht, jaartalGebeurtenis, plaatje, publicatieDatum, commentsenabled) values (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?) ",
                    values: [ req.body.gebruiker, req.body.titelinput, req.body.storytype, req.body.storyinput, req.body.dateinput, req.body.imagePath, req.body.yesorno]
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
    #getAll() {
        this.#app.get("/welcome", async (req, res) => {


            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM `posts` ORDER BY ID"});

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }

    /**
     * This methode gets all stories with their respective users
     */
    #getUserTypes() {
        this.#app.get("/posts/stories", async (req, res) => {


            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT posts.id as 'postID', posts.gebruiker, posts.onderwerp, posts.soortBericht, posts.bericht, posts.jaartalGebeurtenis, posts.plaatje, posts.publicatieDatum, posts.aantalLikes, posts.aantalDislikes, users.id as 'userID', users.persoon FROM pad_flo_7_dev.posts INNER JOIN users ON posts.gebruiker = users.id WHERE `jaartalGebeurtenis` ORDER BY 'postID' ASC"
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
            }
        });
    }
}

module.exports = PostsRoutes