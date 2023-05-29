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
                   this.#sendEmail(data.name, data.email, req.body.question);
               }
            } catch (e) {
                console.log(e);
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e});

            }
        })
    }

    #sendEmail(name, email, question){
        const data = JSON.stringify({
            from: email,
            to: `kiflemisgun15@gmail.com`,
            subject: 'FAQ vraag',
            text: 'Plaintext version of the message',
            html: '<p> dkdkdm ${question} </p>'
        })
        const options = {
            hostname: 'api.hbo-ict.cloud',
            port: 443,
            path: '/sendMail',
            method: 'POST',
            headers: {
                Authorization: '',
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