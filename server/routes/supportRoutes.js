/**
 * Routes file for  support file
 * @author Kifle
 *
 */
const https = require('https'); // Import the 'https' module;

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
        this.#sendMail();

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
                   res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
                   console.log(res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId}));
               }
            } catch (e) {
                console.log(e);
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e});

            }
        })
    }




    #sendMail() {
        this.#app.post("/sendmail", async (req, res) => {
            const fromEmail = 'buurtposter@hbo-ict.cloud';
            const apiKey = 'pad_flo_7.Ixxt5Fxzg0fJObw7';
            const { name, email, question } = req.body;

            const data = JSON.stringify({
                from: fromEmail,
                to: email,
                subject: " Vraag van klant; ",
                text: question,
                html: name,
            });

            const options = {
                hostname: 'api.hbo-ict.cloud',
                port: 443,
                path: '/mail',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            };

            const request = https.request(options, (response) => {
                console.log(`statusCode: ${response.statusCode}`);
                response.on('data', (d) => {
                    process.stdout.write(d);
                });
            });

            request.on('error', (error) => {
                console.error(error);
            });

            request.write(data);
            request.end();
        });
    }


}

module.exports = SupportRoutes;