class signUpRoutes {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#postUser()
    }
    
    // Hier word een HTTP post route gedefinieert op "/postuser". Wanneer een verzoek wordt gedaan naar de route word
    // er geprobeerd om gegevens op te slaan in de database. Als het succesvol is wordt er een JSON gestuurd met de
    // response. Als het niet lukt wordt er een JSON gestuurd met de reden. Bij de repository word de endpoint aageroepen
    // waarbij de input wordt doorgegeven, die dan in de body komt.
    #postUser(){

        this.#app.post("/postuser", async (req, res) => {
            
            try{
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO users(username,password,email) values(?,?,?)",
                    values: [req.body.username, req.body.password,req.body.email]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
            
            
        });
        
    }
    
}

module.exports = signUpRoutes;
