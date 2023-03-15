class UpdatePasswordRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app

        this.#updatePassword()

    }


    #updatePassword(){

        this.#app.post("/updateUser", async (req,res) => {

            try{
                const data = await this.#databaseHelper.handleQuery({
                    query:"UPDATE users set password = ? where email = ? ",
                    values: [req.body.password, req.body.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data)
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }

        });

    }

}

module.exports = UpdatePasswordRoutes
