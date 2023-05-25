/**
 * Routes file for  support file
 * @author Kifle
 *
 */
const https = require("https");

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
        this.#sendEmail();

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

    #sendEmail(){
        const data = JSON.stringify({
            from: 'p.d.leek@hva.nl',
            to: 'p.d.leek@hva.nl',
            subject: 'Message title',
            text: 'Plaintext version of the message',
            html: '<p>HTML version of the message</p>'
        })
        const options = {
            hostname: 'api.hbo-ict.cloud',
            port: 443,
            path: '/mail',
            method: 'POST',
            headers: {
                Authorization: 'Bearer pad_flo_7.Ixxt5Fxzg0fJObw7',
                'Content-Type': 'application/json'
            }
        }
        const request = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            res.on('data', d => {
                process.stdout.write(d)
            })
        })
        request.on('error', error => {
            console.error(error)
        })
        request.write(data)
        request.end()
    }

}

module.exports = SupportRoutes;