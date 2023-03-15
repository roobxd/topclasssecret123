class UpdatePasswordRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor() {
        this.#app = app

        this.#updatePassword()

    }


    #updatePassword(){

        this.#app.post("/updateUser", async (req,res) => {

            try{
                const data = await this.#databaseHelper.handleQuery({

                    query:"UPDATE users set password = ? WHERE email = ?",
                    values: [req.body.password, req.body.email]
                })

                res.status(req.#errorCodes.HTTP_OK_CODE).json(data)
            } catch (e) {
                res.status(req.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }

        });

    }

}

module.exports = updatePasswordRoutes
