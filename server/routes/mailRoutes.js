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
                        "subject": "Jouw wachtwoord",
                        "html":
                            "Hallo, " + wachtwoord[0].voornaam +

                            "\nJouw wachtwoord is " + wachtwoord[0].password
                    };
                } else if (type === "verificatie") {

                    const code = Math.floor(Math.random() * 10000)

                    this.#databaseHelper.handleQuery({
                        query: "UPDATE users SET OTP= ? where email = ?",
                        values: [code, mail]
                    });

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
                        "subject": "Verificatie",
                        "html":
                            "Hallo, " + wachtwoord[0].voornaam +
                            "<br><br>" +
                            "Bedankt voor het registreren bij ons platform! We zijn verheugd om je als nieuwe gebruiker te verwelkomen.<br><br>" +
                            "Om je account volledig te activeren, vragen we je vriendelijk om je e-mailadres te verifiëren door de onderstaande code in te voeren.<br><br>" +
                            "<span style='color: green;'>Jouw verificatiecode: " + code + "</span><br><br>" +
                            "Klik <a href='http://localhost:3000/#verification' style='color: green;'>hier</a> om je account te verifiëren.<br><br>" +
                            "Nogmaals bedankt voor het kiezen van ons platform. We kijken ernaar uit om je te voorzien van een geweldige gebruikerservaring!<br><br>" +
                            "Met vriendelijke groet,<br>De Buurtposter"
                    };

                } else if(type === "welkom") {
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
                        "subject": "Welkom",
                        "html":
                            "Hallo, " + wachtwoord[0].voornaam +

                            "Hartelijk welkom bij De Buurtposter, dé online plek waar je eenvoudig en snel jouw buurt op de hoogte kunt houden van alles wat er speelt in de buurt. We zijn blij dat je je hebt aangemeld en we willen je graag wat meer informatie geven over onze website.\n" +
                            "\n" +
                            "Op De Buurtposter kun je eenvoudig informatie delen met je buren, zoals nieuws over evenementen, buurtfeesten, problemen in de buurt en nog veel meer. Je kunt je eigen berichten plaatsen, of reageren op berichten van andere buurtbewoners. Zo blijf je op de hoogte van alles wat er in jouw buurt gebeurt!\n" +
                            "\n" +
                            "We hopen dat je onze website gemakkelijk en plezierig vindt om te gebruiken.\n" +
                            "\n" +
                            "Nogmaals hartelijk welkom bij De Buurtposter en we hopen dat je veel plezier hebt met het gebruik van onze website.\n" +
                            "\n" +
                            "Met vriendelijke groet,\n" +
                            "\n"
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