/**
 * Routes file for  support file
 * @author Kifle
 *
 */

class SupportRoutes{
    #app
    #databaseHelper = require("../framework/utils/databaseHelper");
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");



    /**
     * Class constructor
     * @param app: applicatie
     */
    constructor(app) {
        this.#app = app;

        this.#createSupport();

    }

    #createSupport(){

        this.#app.post("/support", async (req, res) =>{
            // res.json({"message":"API endpoints called support", "Formulier: " : req.body})
            try{
               const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO faq(name, email, question) VALUES (?,?,?);",
                    values: [req.body.name, req.body.email, req.body.question]
                });

               if (data.insertId){

                   res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({result: data.insertId})
               }
            } catch (e) {
                console.log(e);
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e});

            }
        })
    }

}

module.exports = SupportRoutes;