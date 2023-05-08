const {query} = require("express");


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
        this.#app.post("/mail/:type", async (req, res) => {
            try {
                const type = req.params.type;
                const mail = req.body.email;
                const apiKey = "pad_flo_7.Ixxt5Fxzg0fJObw7";
                const headers = {
                    "Authorization": `Bearer ${apiKey}`
                };

                const wachtwoord = await this.#databaseHelper.handleQuery({
                    query: "SELECT password, voornaam from users where email = ?",
                    values: [mail]
                });


                if (type === "wachtwoord") {
                    var emailData = {
                        "from": {
                            "name": "Buurtposter",
                            "address": "buurtposter@hbo-ict.cloud"
                        },
                        "to": [
                            {
                                "name": "Lennard Fonteijn",
                                "address": mail
                            }
                        ],
                        "subject": "   Jouw wachtwoord",
                        "html":
                            "Hallo, " + wachtwoord[0].voornaam +

                            "\nJouw wachtwoord is " + wachtwoord[0].password
                    };
                } else if (type === "verificatie") {
                     emailData = {
                        "from": {
                            "name": "Buurtposter",
                            "address": "buurtposter@hbo-ict.cloud"
                        },
                        "to": [
                            {
                                "name": "Lennard Fonteijn",
                                "address": mail
                            }
                        ],
                        "subject": " verificatie",
                        "html":
                            "Hallo, " + wachtwoord[0].voornaam +

                            "dit is een verificatie mail"
                    };

                }

                const data = await fetch("https://api.hbo-ict.cloud/mail", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(emailData)
                })

                if (data.ok) {
                    const responseData = await data.json();
                    console.log(responseData);
                    res.status(this.#errorCodes.HTTP_OK_CODE).json(responseData);

                } else {
                    const errorData = await data.json();
                    console.log(errorData);
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json(errorData);
                }


            } catch (e) {
                console.log(e)
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = MailRoutes