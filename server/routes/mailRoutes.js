

class MailRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        this.#create()
        //call method per route for the rooms entity
    }

    async #create() {
         this.#app.post("/mail", async (req, res) => {

             try {
                 const data = await fetch("https://api.hbo-ict.cloud", {

                 }).then((response) => {
                     console.log(response)
                 })

                 //just give all data back as json, could also be empty
                 res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

             } catch (e) {
                 res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: e })
             }
         });
     }

    // async #create() {
    //     this.#app.post("api.hbo-ict.cloud/mail", async (req, res) => {
    //         res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
    //
    //     });
    // }

}

module.exports = MailRoutes